"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSupabase } from "@/Context/supabaseContext";

type EditableImageProps = {
  imageKey: string;
  value?: string;
  alt: string;
  className?: string;
  priority?: "eager" | "lazy";
  fill?: boolean;
  sizes?: string;
  editButtonClassName?: string;
};

function normalizeKey(input: string) {
  return String(input ?? "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export default function EditableImage({
  imageKey,
  value,
  alt,
  className,
  priority,
  fill,
  sizes,
  editButtonClassName,
}: EditableImageProps) {
  const { isAdmin, imagesMap, draftImagesMap, setDraftImage, clearDraftImage } = useSupabase();
  const [isMobile, setIsMobile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 850px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const normalizedKey = normalizeKey(imageKey);
  const serverValue = imagesMap?.[normalizedKey];
  const draftFile = draftImagesMap?.[normalizedKey] ?? null;

  useEffect(() => {
    if (!draftFile) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsPreviewing(false);
      return;
    }
    const url = URL.createObjectURL(draftFile);
    setPreviewUrl(url);
    setIsPreviewing(true);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftFile]);

  const currentSrc = useMemo<string | null>(() => {
    const draft = isPreviewing ? previewUrl : null;
    return draft ?? value ?? serverValue ?? null;
  }, [isPreviewing, previewUrl, value, serverValue]);

  const validSrc = useMemo<string | null>(() => {
    const s = String(currentSrc ?? "").trim();
    if (!s) return null;
    // Accept absolute HTTP(S), site-relative, blob, or data URLs
    if (/^(https?:\/\/|\/|blob:|data:)/i.test(s)) return s;
    return null;
  }, [currentSrc]);

  const derivedAlt = useMemo(() => {
    if (alt !== "auto") return alt;
    const safeSrc = String(currentSrc ?? "");
    const stripQuery = safeSrc.split("?")[0].split("#")[0];
    const lastSegment = stripQuery.split("/").pop() ?? "";
    const name = lastSegment.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, "");
    return name || "image";
  }, [alt, currentSrc]);

  if (!isAdmin || isMobile) {
    const isBlobSrc = String(validSrc ?? "").startsWith("blob:");
    if (!validSrc) {
      return fill ? <div className="relative w-full h-full" /> : null;
    }
    const image = (
      <Image
        src={validSrc}
        alt={derivedAlt}
        className={className}
        loading={priority}
        fill={fill}
        sizes={sizes}
        unoptimized={isBlobSrc || undefined}
      />
    );

    return fill ? <div className="relative w-full h-full">{image}</div> : image;
  }

  const onPick = () => fileInputRef.current?.click();

  const onRevert = () => {
    clearDraftImage?.(normalizedKey);
    setIsPreviewing(false);
  };

  return (
    <div className={fill ? "relative w-full h-full" : "relative"}>
      {validSrc ? (
        <Image
          src={validSrc}
          alt={derivedAlt}
          className={className}
          loading={priority}
          fill={fill}
          sizes={sizes}
          unoptimized={String(validSrc ?? "").startsWith("blob:") || undefined}
        />
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          if (f) {
            setDraftImage?.(normalizedKey, f);
            setIsPreviewing(true);
          }
          // allow re-picking the same file
          e.currentTarget.value = "";
        }}
      />

      <div className={`absolute left-3 top-3 z-20 flex gap-2`}>
        <button
          type="button"
          onClick={onPick}
          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-[#66BEF0] text-white flex-none ${editButtonClassName ?? ""}`}
        >
          Edit image
        </button>

        {!!draftFile && (
          <>
            <button
              type="button"
              onClick={() => setIsPreviewing((v) => !v)}
              disabled={!previewUrl}
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-[#66BEF0] text-white disabled:opacity-50 flex-none ${editButtonClassName ?? ""}`}
            >
              {isPreviewing ? "Hide preview" : "Preview"}
            </button>
            <button
              type="button"
              onClick={onRevert}
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-[#66BEF0] text-white disabled:opacity-50 flex-none ${editButtonClassName ?? ""}`}
            >
              Revert
            </button>
          </>
        )}
      </div>
    </div>
  );
}
