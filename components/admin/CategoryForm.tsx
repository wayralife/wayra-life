"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import type { CategoryFormState } from "@/app/[locale]/admin/categories/actions";
import type { AdminCategoryDetail } from "@/lib/admin/categories";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "es", label: "Español" },
] as const;

const initialState: CategoryFormState = { status: "idle" };

export default function CategoryForm({
  action,
  category,
}: {
  action: (
    state: CategoryFormState,
    formData: FormData
  ) => Promise<CategoryFormState>;
  category?: AdminCategoryDetail;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!category && state.status === "success" && state.categoryId) {
      router.push(`/admin/categories/${state.categoryId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Slug (adres URL, np. rape-hape)
          </label>
          <input
            name="slug"
            defaultValue={category?.slug}
            required
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Kolejność (mniejsza liczba = wyżej)
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            URL zdjęcia kategorii (opcjonalnie)
          </label>
          <input
            name="image_url"
            type="url"
            defaultValue={category?.image_url ?? ""}
            placeholder="https://..."
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={category?.visible ?? true}
          />
          Widoczna w sklepie
        </label>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-medium">Tłumaczenia</h2>
        {LOCALES.map((locale) => (
          <div
            key={locale.code}
            className="rounded-md border border-black/10 p-4"
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/50">
              {locale.label}
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nazwa
                </label>
                <input
                  name={`name_${locale.code}`}
                  defaultValue={category?.translations[locale.code]?.name}
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Opis
                </label>
                <textarea
                  name={`description_${locale.code}`}
                  defaultValue={
                    category?.translations[locale.code]?.description
                  }
                  rows={2}
                  className="w-full rounded-md border border-black/20 px-3 py-2"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

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
