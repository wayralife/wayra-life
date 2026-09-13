"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { formatGBP } from "@/lib/format";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, isLoaded, removeItem, setQuantity, totalPrice } = useCart();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-semibold">{t("title")}</h1>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-black/20 p-8 text-center">
          <p className="text-black/60">{t("empty")}</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-md bg-black px-6 py-2.5 text-white transition hover:bg-black/80"
          >
            {t("browseShop")}
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-black/5">
                  {item.imageUrl ? (
                    // Plain img, not next/image: product photos can be
                    // added by the admin from any URL.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <Link href={`/shop/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-sm text-black/50">
                    {formatGBP(item.price)}
                  </p>
                </div>

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    setQuantity(item.productId, Number(e.target.value))
                  }
                  className="w-16 rounded border border-black/20 px-2 py-1 text-center"
                  aria-label={t("quantity")}
                />

                <p className="w-24 text-right font-medium">
                  {formatGBP(item.price * item.quantity)}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-black/40 hover:text-red-600"
                >
                  {t("remove")}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-medium">{t("total")}</span>
            <span className="text-lg font-semibold">
              {formatGBP(totalPrice)}
            </span>
          </div>

          <Link
            href="/cart/checkout"
            className="mt-6 block w-full rounded-md bg-black px-6 py-3 text-center text-white transition hover:bg-black/80"
          >
            {t("checkout")}
          </Link>
        </>
      )}
    </div>
  );
}