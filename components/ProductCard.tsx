import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ShopProduct } from "@/lib/products";
import { formatGBP } from "@/lib/format";

export default function ProductCard({ product }: { product: ShopProduct }) {
  const t = useTranslations("shop");
  const displayPrice = product.onSale && product.salePrice != null
    ? product.salePrice
    : product.price;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/10 transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-black/5">
        {product.imageUrl ? (
          // Plain img, not next/image: product photos can be added by the
          // admin from any URL, and next/image requires each host to be
          // allow-listed in next.config.ts ahead of time.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.imageAlt ?? product.name}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-black/40">
            WAYRA
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-medium">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold">{formatGBP(displayPrice)}</span>
          {product.onSale && product.salePrice != null && (
            <span className="text-xs text-black/40 line-through">
              {formatGBP(product.price)}
            </span>
          )}
        </div>
        {product.stockQty <= 0 && (
          <span className="text-xs text-red-600">{t("outOfStock")}</span>
        )}
      </div>
    </Link>
  );
}