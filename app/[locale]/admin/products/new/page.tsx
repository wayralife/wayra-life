import { Link } from "@/i18n/navigation";
import { getAdminCategoryOptions } from "@/lib/admin/products";
import { createProduct } from "../actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getAdminCategoryOptions();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin/products" className="text-sm text-black/60 underline">
        ← Wróć do listy produktów
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">Nowy produkt</h1>

      <p className="mb-6 rounded-md border border-dashed border-black/20 p-4 text-sm text-black/60">
        Zapisz produkt najpierw z podstawowymi danymi — zdjęcia dodasz na
        następnym ekranie, po zapisaniu.
      </p>

      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}