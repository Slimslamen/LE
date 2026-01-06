import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/db/server";
import { isAdminUser } from "@/lib/auth/isAdmin";

type PageTextRow = { text_key?: string | null; text?: string | null };

function getSupabaseErrorMeta(err: unknown): { code?: string; details?: string; hint?: string } {
  if (!err || typeof err !== 'object') return {};
  const record = err as Record<string, unknown>;
  return {
    code: typeof record.code === 'string' ? record.code : undefined,
    details: typeof record.details === 'string' ? record.details : undefined,
    hint: typeof record.hint === 'string' ? record.hint : undefined,
  };
}

async function getAdminWriteClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET() {
  const supabase = await supabaseServerClient();
  const { data, error } = await supabase.from("pageTexts").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // convert to an object map keyed by normalized text_key -> text
  const map: Record<string, string> = {};
  (data ?? []).forEach((row: PageTextRow) => {
    if (!row?.text_key) return;
    // normalize keys: replace non-word chars with underscore, collapse repeats, trim underscores, lowercase
    const key = String(row.text_key ?? "")
      .replace(/[^\w]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
    map[key] = row?.text ?? "";
  });

  return NextResponse.json(map);
}

/**
 * POST /api/texts
 * - Admin-only endpoint: requires an authenticated user present in `profiles` table
 * - Supports:
 *   - Single: { text_key: string, text: string, published?: boolean }
 *   - Bulk:   { texts: Record<string, string>, published?: boolean }
 * - Upserts into `pageTexts` by `text_key`
 */
export async function POST(req: Request) {
  try {
    const supabase = await supabaseServerClient();

    // ensure authenticated user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      const meta = getSupabaseErrorMeta(userErr);
      return NextResponse.json(
        { error: userErr.message, ...meta },
        { status: 500 }
      );
    }
    const user = userData.user;
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    // admin check for this user
    const ok = await isAdminUser(supabase, user);
    if (!ok) return NextResponse.json({ error: 'Forbidden. User is not admin' }, { status: 403 });

    const body = await req.json();
    const published = typeof body?.published === 'boolean' ? body.published : true;

    const adminWriteClient = await getAdminWriteClient();
    if (!adminWriteClient) {
      return NextResponse.json(
        {
          error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY for write access',
          hint: 'Set SUPABASE_SERVICE_ROLE_KEY in your server environment and restart the dev server.',
          code: 'missing_service_role_key',
        },
        { status: 500 }
      );
    }

    // Bulk save: { texts: { key: value, ... } }
    if (body?.texts && typeof body.texts === 'object' && !Array.isArray(body.texts)) {
      const entries = Object.entries(body.texts as Record<string, unknown>)
        .filter(([key, value]) => typeof key === 'string' && typeof value === 'string')
        .map(([text_key, text]) => ({ text_key, text, published }));

      if (entries.length === 0) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

      const { data: upserted, error: upsertErr } = await adminWriteClient
        .from('pageTexts')
        .upsert(entries, { onConflict: 'text_key' })
        .select('text_key');
      if (upsertErr) {
        const meta = getSupabaseErrorMeta(upsertErr);
        return NextResponse.json(
          { error: upsertErr.message, ...meta },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, saved: upserted?.length ?? entries.length });
    }

    // Single save: { text_key, text }
    const text_key = typeof body?.text_key === 'string' ? body.text_key : null;
    const text = typeof body?.text === 'string' ? body.text : null;
    if (!text_key || text === null) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const row = { text_key, text, published };
    const { data: upserted, error: upsertErr } = await adminWriteClient
      .from('pageTexts')
      .upsert(row, { onConflict: 'text_key' })
      .select()
      .single();
    if (upsertErr) {
      const meta = getSupabaseErrorMeta(upsertErr);
      return NextResponse.json(
        { error: upsertErr.message, ...meta },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, row: upserted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}