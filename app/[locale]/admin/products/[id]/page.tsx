import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getAdminProduct, getAdminCategoryOptions } from "@/lib/admin/products";
import { updateProduct } from "../actions";
import ProductForm from "@/components/admin/ProductForm";
import ProductImages from "@/components/admin/ProductImages";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategoryOptions(),
  ]);

  if (!product) {
    notFound();
  }

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/admin/products" className="text-sm text-black/60 underline">
        ← Wróć do listy produktów
      </Link>

      <h1 className="mt-4 mb-8 text-3xl font-semibold">
        Edycja: {product.translations.en?.name || product.slug}
      </h1>

      <ProductImages productId={product.id} images={product.images} />

      <div className="mt-10">
        <ProductForm
          action={boundUpdate}
          categories={categories}
          product={product}
        />
      </div>
    </div>
  );
}