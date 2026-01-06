import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/db/server";
import { isAdminUser } from "@/lib/auth/isAdmin";
import type { SupabaseClient } from "@supabase/supabase-js";

function normalizeKey(input: string) {
  return String(input ?? "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function guessExtension(mimeType: string | undefined) {
  const t = (mimeType ?? "").toLowerCase();
  if (t === "image/webp") return "webp";
  if (t === "image/png") return "png";
  if (t === "image/jpeg" || t === "image/jpg") return "jpg";
  if (t === "image/svg+xml") return "svg";
  return "bin";
}

async function getAdminWriteClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function urlForPath(client: SupabaseClient, adminClient: SupabaseClient | null, bucket: string, path: string) {
  // Always return a public URL so clients receive long-lived, cacheable URLs
  const { data: urlData } = client.storage.from(bucket).getPublicUrl(path);
  return urlData?.publicUrl ?? null;
}

async function latestFileName(client: SupabaseClient, bucket: string, folderPath: string) {
  const { data, error } = await client.storage
    .from(bucket)
    .list(folderPath, { limit: 1, sortBy: { column: "name", order: "desc" } });
  if (error || !data?.length) return null;
  return data[0]?.name ?? null;
}

async function findLatestIn(
  client: SupabaseClient,
  bucket: string,
  prefixes: string[]
): Promise<{ file: string; prefix: string } | null> {
  for (const prefix of prefixes) {
    const name = await latestFileName(client, bucket, prefix);
    if (name) return { file: name, prefix };
  }
  return null;
}

function isAllowedPrefix(groupKey: string | null, imageKey: string) {
  const g = String(groupKey ?? "");
  const i = String(imageKey ?? "");
  const picMatch = i.match(/^pic_(\d+)$/);
  const picIndex = picMatch ? parseInt(picMatch[1], 10) : null;

  if (g === "services_background" && picIndex && picIndex >= 1 && picIndex <= 6) return true;
  if (g === "carousel_background" && picIndex && picIndex >= 1 && picIndex <= 12) return true;
  if (g === "hero_background" && i === "main") return true;
  return false;
}

async function collectUrlsForFolder(
  client: SupabaseClient,
  adminClient: SupabaseClient | null,
  bucket: string,
  folder: string,
  rootFolder: string
) {
  const results: Array<{ key: string; url: string }> = [];

  // Try direct structure: <folder>/<rootFolder>/<file>
  const direct = await findLatestIn(client, bucket, [`${folder}/${rootFolder}`, `${folder}`]);
  if (direct) {
    const path = `${direct.prefix}/${direct.file}`;
    const url = await urlForPath(client, adminClient, bucket, path);
    if (url && normalizeKey(folder) !== "services_background") {
      results.push({ key: normalizeKey(folder), url });
    }
    if (url && normalizeKey(folder) !== "carousel_background") {
      results.push({ key: normalizeKey(folder), url });
    }
  }

  // Try grouped structure: <folder>/<sub>/<rootFolder>/<file>
  const { data: subs, error: subsErr } = await client.storage
    .from(bucket)
    .list(`${folder}`, { limit: 1000, sortBy: { column: "name", order: "asc" } });
  if (subsErr) return results;

  for (const sub of subs ?? []) {
    const subName = sub?.name ?? "";
    if (!subName) continue;
    const found = await findLatestIn(client, bucket, [`${folder}/${subName}/${rootFolder}`, `${folder}/${subName}`]);
    if (!found) continue;
    const path = `${found.prefix}/${found.file}`;
    const url = await urlForPath(client, adminClient, bucket, path);
    if (!url) continue;
    results.push({ key: `${normalizeKey(folder)}_${normalizeKey(subName)}`, url });
  }

  return results;
}

export async function GET() {
  try {
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET ?? "page-images";
    const rootFolder = process.env.NEXT_PUBLIC_SUPABASE_IMAGES_ROOT ?? "main";

    const adminClient = await getAdminWriteClient();
    const client = adminClient ?? (await supabaseServerClient());

    const { data: roots, error: listRootErr } = await client.storage
      .from(bucket)
      .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });
    if (listRootErr) return NextResponse.json({ error: listRootErr.message }, { status: 500 });

    const map: Record<string, string> = {};
    for (const item of roots ?? []) {
      const folder = item?.name ?? "";
      if (!folder) continue;
      const pairs = await collectUrlsForFolder(client, adminClient, bucket, folder, rootFolder);
      for (const p of pairs) map[p.key] = p.url;
    }

    return NextResponse.json(map);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServerClient();

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) return NextResponse.json({ error: userErr.message }, { status: 500 });
    const user = userData.user;
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const ok = await isAdminUser(supabase, user);
    if (!ok) return NextResponse.json({ error: "Forbidden. User is not admin" }, { status: 403 });
    const adminWriteClient = await getAdminWriteClient();
    if (!adminWriteClient) {
      return NextResponse.json(
        {
          error: "Server is missing SUPABASE_SERVICE_ROLE_KEY for write access",
          hint: "Set SUPABASE_SERVICE_ROLE_KEY in your server environment and restart the dev server.",
          code: "missing_service_role_key",
        },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const image_key = typeof form.get("image_key") === "string" ? String(form.get("image_key")) : null;
    const group_key = typeof form.get("group_key") === "string" ? String(form.get("group_key")) : null;
    const idRaw = form.get("id");
    const idNum = typeof idRaw === "string" ? parseInt(idRaw, 10) : typeof idRaw === "number" ? idRaw : null;
    const file = form.get("file");
    if (!image_key) return NextResponse.json({ error: "Missing image_key" }, { status: 400 });
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGES_BUCKET ?? "page-images";
    const normalizedKey = normalizeKey(image_key);
    let normalizedGroup = group_key ? normalizeKey(group_key) : null;

    // If group_key is omitted but there's an existing grouped entry with image_key 'main', use that mapping.
    if (!normalizedGroup) {
      const { data: probe, error: probeErr } = await adminWriteClient
        .from("pageImages")
        .select("group_key,image_key")
        .eq("group_key", normalizedKey)
        .eq("image_key", "main")
        .limit(1);
      if (!probeErr && (probe?.length ?? 0) > 0) {
        normalizedGroup = normalizedKey;
      }
    }

    // Do not default to 'main'; use the provided image_key unless overridden by id/pattern mapping
    let finalImageKey = normalizedKey;
    let finalGroupKey = normalizedGroup ?? null;

    // If the image_key is encoded like "<group>_pic_<n>", derive group + pic mapping
    if (!finalGroupKey) {
      const m = normalizedKey.match(/^(.+?)_pic_(\d+)$/);
      if (m) {
        const base = normalizeKey(m[1] ?? "");
        const idx = parseInt(m[2] ?? "", 10);
        const maxByGroup = base === "carousel_background" ? 12 : base === "services_background" ? 6 : 0;
        if (base && Number.isFinite(idx) && idx >= 1 && (maxByGroup ? idx <= maxByGroup : true)) {
          finalGroupKey = base;
          finalImageKey = `pic_${idx}`;
        }
      }
    }

    // If an id is provided, map to pic_{id} under the resolved group.
    if (idNum && Number.isFinite(idNum) && idNum >= 1) {
      const groupForRange = (normalizedGroup ?? normalizedKey) || "";
      const maxId = groupForRange === "carousel_background" ? 12 : 6;
      if (idNum <= maxId) {
        finalGroupKey = normalizedGroup ?? normalizedKey; // derive group from image_key if missing
        finalImageKey = `pic_${idNum}`;
      }
    }

    // Default grouped uploads to 'main' ONLY when the provided key equals the group name (hero)
    // Example: image_key = "hero_background" with group resolved to "hero_background" -> use "main"
    if (finalGroupKey && finalGroupKey === normalizedKey && finalImageKey === normalizedKey) {
      finalImageKey = "main";
    }

    // Build storage folder path without duplicating the root folder.
    // Always upload directly under the resolved group/image without a 'main' subfolder
    const folderPath = finalGroupKey ? `${finalGroupKey}/${finalImageKey}` : `${finalImageKey}`;

    // Ensure the target prefix already exists (has files) to avoid creating new folders
    const { data: existing, error: listErr } = await adminWriteClient.storage
      .from(bucket)
      .list(folderPath, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (listErr) {
      return NextResponse.json({ error: `Failed to read target folder: ${listErr.message}` }, { status: 500 });
    }

    if ((existing?.length ?? 0) === 0) {
      // Allow upload into known, pre-defined prefixes even if currently empty
      const allowed = isAllowedPrefix(finalGroupKey, finalImageKey);
      if (!allowed) {
        return NextResponse.json(
          {
            error: "Target folder not found or empty; refusing to create new folder",
            details: { bucket, folderPath },
            code: "missing_target_folder",
          },
          { status: 400 }
        );
      }
    }

    // Remove any existing files in the folder so only the newest remains
    const toRemove = (existing ?? []).map((f) => `${folderPath}/${f.name}`);
    if (toRemove.length > 0) {
      await adminWriteClient.storage.from(bucket).remove(toRemove);
    }

    // Preserve the original filename if available
    const originalName = (file as File)?.name ?? null;
    const ext = guessExtension(file.type);
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    const filename = originalName && originalName.trim().length > 0 ? originalName : `${Date.now()}-${id}.${ext}`;
    const path = `${folderPath}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const { error: uploadErr } = await adminWriteClient.storage
      .from(bucket)
      .upload(path, bytes, { contentType: file.type || undefined, upsert: true, cacheControl: "31536" });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 500 });
    }

    // Return a public URL (filename already part of the path), so caches can persist per object
    const { data: urlData } = adminWriteClient.storage.from(bucket).getPublicUrl(path);
    const url: string | null = urlData?.publicUrl ?? null;

    if (!url) return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });

    // Deterministic public-style URL for table storage (includes filename)
    let tableUrl: string | null = null;
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      if (supabaseUrl) {
        tableUrl = `${new URL(supabaseUrl).origin}/storage/v1/object/public/${bucket}/${path}`;
      }
    } catch {
      tableUrl = null;
    }

    // Update pageImages so path/url reflect the latest file.
    // If a group_key is provided, filter by both group_key and image_key ('main' by convention).
    let tableUpdated = false;
    let tableError: string | null = null;
    try {
      const query = adminWriteClient.from("pageImages").update({ path, url: tableUrl ?? url });

      const finalQuery = finalGroupKey
        ? query.eq("group_key", finalGroupKey).eq("image_key", finalImageKey)
        : query.eq("image_key", finalImageKey);

      const { data: updData, error: updErr } = await finalQuery.select();
      if (!updErr && (updData?.length ?? 0) > 0) {
        tableUpdated = true;
      } else if (!updErr) {
        // No matching row: attempt upsert to ensure the table has the latest path/url.
        const payload = finalGroupKey
          ? { group_key: finalGroupKey, image_key: finalImageKey, path, url: tableUrl ?? url }
          : { image_key: finalImageKey, path, url: tableUrl ?? url };
        const onConflict = finalGroupKey ? "group_key,image_key" : "image_key";
        const { error: upsertErr } = await adminWriteClient.from("pageImages").upsert(payload, { onConflict });
        if (!upsertErr) tableUpdated = true;
        else tableError = upsertErr.message;
      } else {
        tableError = updErr.message;
      }
    } catch (e: unknown) {
      tableError = e instanceof Error ? e.message : String(e);
    }

    // Storage-only approach: return the latest uploaded file URL for this key
    return NextResponse.json({
      success: true,
      image_key: finalImageKey,
      group_key: finalGroupKey,
      url,
      path,
      tableUrl,
      tableUpdated,
      tableError,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
