"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/Context/supabaseContext";

type EditableTextProps = {
  textKey: string;
  value?: string;
  fallback: string;
  textClassName?: string;
  width?: string;
};

function normalizeTextKey(input: string) {
  return String(input ?? "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export default function EditableText({ textKey, value, fallback, textClassName, width }: EditableTextProps) {
  const { isAdmin, setDraftText, clearDraftText, draftTextsMap, serverTextsMap } = useSupabase();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 850px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const normalizedKey = normalizeTextKey(textKey);

  const originalValue = serverTextsMap?.[normalizedKey] ?? fallback;
  const previewDraftValue = draftTextsMap?.[normalizedKey];
  const hasChangedFromOriginal =
    typeof previewDraftValue === "string" && previewDraftValue !== originalValue;

  if (!isAdmin || isMobile) {
    return <span className={`inline-block ${textClassName ?? ""}`}>{value ?? fallback}</span>;
  }

  return (
    <span className="relative inline-block">
      <span className={`inline-block ${textClassName ?? ""}`}>
        {isEditing ? (
          <input
            value={draft ?? ""}
            onChange={(e) => setDraft(e.target.value)}
            style={{ width: width ?? "10em" }}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900"
            aria-label={`Edit text: ${textKey}`}
          />
        ) : (
          value ?? fallback
        )}
      </span>

      <span className="block gap-2">
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              const next = draft ?? (value ?? fallback);
              if (next === originalValue) {
                clearDraftText?.(textKey);
              } else {
                setDraftText?.(textKey, next);
              }
              setIsEditing(false);
              setDraft(null);
              return;
            }

            if (hasChangedFromOriginal) {
              clearDraftText?.(textKey);
              setIsEditing(false);
              setDraft(null);
              return;
            }

            setDraft(value ?? fallback);
            setIsEditing(true);
          }}
          className={`edit px-2 py-0.5 rounded-lg bg-[#66BEF0] text-white ${
            isEditing ? "w-15" : hasChangedFromOriginal ? "w-12.5" : "w-10"
          }`}
        >
          {isEditing ? "Preview" : hasChangedFromOriginal ? "Revert" : "Edit"}
        </button>
      </span>
    </span>
  );
}
