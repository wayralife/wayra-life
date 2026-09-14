"use client";

import { useActionState } from "react";
import type { ContentFormState } from "@/app/[locale]/admin/content/actions";
import AutoTranslateButton from "@/components/admin/AutoTranslateButton";
import ImageUploadField from "@/components/admin/ImageUploadField";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "es", label: "Español" },
] as const;

export interface ContentFieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "url" | "image";
}

const initialState: ContentFormState = { status: "idle" };

export default function ContentBlockForm({
  action,
  fields,
  initialData,
}: {
  action: (
    state: ContentFormState,
    formData: FormData
  ) => Promise<ContentFormState>;
  fields: ContentFieldConfig[];
  initialData: Record<string, Record<string, string>>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  // Images are shared across all three locales (one photo, not three) — the
  // same field name is submitted once and copied server-side to every
  // locale's row. Everything else is per-locale text.
  const imageFields = fields.filter((f) => f.type === "image");
  const localizedFields = fields.filter((f) => f.type !== "image");
  const translateFieldNames = localizedFields
    .filter((f) => f.type === "text" || f.type === "textarea")
    .map((f) => f.name);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {imageFields.map((field) => (
        <ImageUploadField
          key={field.name}
          name={field.name}
          label={field.label}
          defaultValue={initialData.en?.[field.name] ?? ""}
        />
      ))}

      {localizedFields.length > 0 && (
        <>
          {translateFieldNames.length > 0 && (
            <div className="flex justify-end">
              <AutoTranslateButton fields={translateFieldNames} />
            </div>
          )}
          {LOCALES.map((locale) => (
            <div
              key={locale.code}
              className="rounded-md border border-black/10 p-4"
            >
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50">
                {locale.label}
              </h3>
              <div className="flex flex-col gap-3">
                {localizedFields.map((field) => (
                  <div key={field.name}>
                    <label className="mb-1 block text-sm font-medium">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={`${field.name}_${locale.code}`}
                        defaultValue={
                          initialData[locale.code]?.[field.name] ?? ""
                        }
                        rows={5}
                        className="w-full rounded-md border border-black/20 px-3 py-2"
                      />
                    ) : (
                      <input
                        name={`${field.name}_${locale.code}`}
                        type={field.type === "url" ? "url" : "text"}
                        defaultValue={
                          initialData[locale.code]?.[field.name] ?? ""
                        }
                        placeholder={
                          field.type === "url" ? "https://..." : undefined
                        }
                        className="w-full rounded-md border border-black/20 px-3 py-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {state.status === "error" && (
        <p className="text-sm text-red-600">
          Błąd: {state.message ?? "nieznany błąd"}
        </p>
      )}
      {state.status === "success" && (
        <p className="text-sm text-green-700">Zapisano.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-black px-8 py-3 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40"
      >
        {isPending ? "Zapisywanie…" : "Zapisz"}
      </button>
    </form>
  );
}
