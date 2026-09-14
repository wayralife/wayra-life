"use client";

import { useState, useTransition } from "react";
import { translateFromEnglish } from "@/app/[locale]/admin/translate-action";

/**
 * Reads the current value of each `${field}_en` input/textarea in the
 * enclosing form, sends it to Claude for translation, and writes the
 * result straight into the matching `${field}_pl` / `${field}_es`
 * elements — no React state involved, so it works with the plain
 * uncontrolled inputs the admin forms already use.
 */
export default function AutoTranslateButton({ fields }: { fields: string[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleClick() {
    setError(null);
    setDone(false);

    const sourceTexts: Record<string, string> = {};
    for (const field of fields) {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${field}_en"]`
      );
      if (el) sourceTexts[field] = el.value;
    }

    startTransition(async () => {
      try {
        const result = await translateFromEnglish(sourceTexts);
        for (const locale of ["pl", "es"] as const) {
          for (const field of fields) {
            const value = result[locale]?.[field];
            if (value == null) continue;
            const el = document.querySelector<
              HTMLInputElement | HTMLTextAreaElement
            >(`[name="${field}_${locale}"]`);
            if (el) el.value = value;
          }
        }
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Błąd tłumaczenia");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-md border border-black/20 px-4 py-2 text-sm transition hover:border-black/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Tłumaczenie…" : "Przetłumacz PL/ES automatycznie (AI)"}
      </button>
      {done && !isPending && (
        <span className="text-xs text-green-700">
          Gotowe — sprawdź i popraw jeśli trzeba, potem zapisz.
        </span>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
