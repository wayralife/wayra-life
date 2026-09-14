"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import type { ProductFormState } from "@/app/[locale]/admin/products/actions";
import type { AdminCategoryOption, AdminProductDetail } from "@/lib/admin/products";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "es", label: "Español" },
] as const;

const initialState: ProductFormState = { status: "idle" };

export default function ProductForm({
  action,
  categories,
  product,
}: {
  action: (
    state: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  categories: AdminCategoryOption[];
  product?: AdminProductDetail;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (!product && state.status === "success" && state.productId) {
      router.push(`/admin/products/${state.productId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">SKU</label>
          <input
            name="sku"
            defaultValue={product?.sku}
            required
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Slug (adres URL, np. rape-tsunu)
          </label>
          <input
            name="slug"
            defaultValue={product?.slug}
            required
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Cena (GBP)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price ?? 0}
            required
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Cena promocyjna (opcjonalnie)
          </label>
          <input
            name="sale_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.sale_price ?? ""}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Ilość w magazynie
          </label>
          <input
            name="stock_qty"
            type="number"
            min="0"
            defaultValue={product?.stock_qty ?? 0}
            required
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Kolejność w sklepie (mniejsza liczba = wyżej)
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={product?.sort_order ?? 0}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          >
            <option value="draft">draft (ukryty)</option>
            <option value="active">active (widoczny w sklepie)</option>
            <option value="archived">archived (zarchiwizowany)</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Kategoria</label>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="w-full rounded-md border border-black/20 px-3 py-2"
          >
            <option value="">— brak —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="on_sale"
              defaultChecked={product?.on_sale}
            />
            W promocji
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured}
            />
            Wyróżniony
          </label>
        </div>
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
                  defaultValue={product?.translations[locale.code]?.name}
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
                    product?.translations[locale.code]?.description
                  }
                  rows={3}
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
