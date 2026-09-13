import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getShopProductBySlug } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { formatGBP } from "@/lib/format";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("product");
  const tShop = await getTranslations("shop");
  const product = await getShopProductBySlug(locale, slug);

  if (!product) {
    notFound();
  }

  const displayPrice =
    product.onSale && product.salePrice != null
      ? product.salePrice
      : product.price;
  const inStock = product.stockQty > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/shop" className="text-sm text-black/60 hover:underline">
        ← {t("backToShop")}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.imageAlt ?? product.name}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/40">
              WAYRA
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-xs uppercase tracking-wide text-black/40">
            {tShop("sku")}: {product.sku}
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatGBP(displayPrice)}
            </span>
            {product.onSale && product.salePrice != null && (
              <span className="text-black/40 line-through">
                {formatGBP(product.price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-black/70">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={displayPrice}
              imageUrl={product.imageUrl}
              disabled={!inStock}
            />
            <p className="mt-3 text-xs text-black/50">{t("cartWip")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
