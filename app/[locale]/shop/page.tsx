import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getShopCategories, getShopProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  const t = await getTranslations("shop");

  const [categories, products] = await Promise.all([
    getShopCategories(locale),
    getShopProducts(locale, category, q),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold">{t("title")}</h1>

      {q && (
        <p className="mb-4 text-sm text-black/60">
          {t("searchResultsFor", { query: q })}
        </p>
      )}

      <Suspense fallback={null}>
        <CategoryFilter categories={categories} />
      </Suspense>

      {products.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/20 p-8 text-center text-black/60">
          {q ? t("noSearchResults") : t("empty")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
