"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { createCheckoutSession } from "./actions";
import { formatGBP } from "@/lib/format";

export default function CheckoutPage() {
  const t = useTranslations("cart");
  const { items, isLoaded, totalPrice } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setIsPending(true);
    const result = await createCheckoutSession(
      items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );
    if (result.error || !result.url) {
      setIsPending(false);
      setError(t("checkoutError"));
      return;
    }
    window.location.href = result.url;
  }

  if (!isLoaded) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">{t("checkoutTitle")}</h1>
        <p className="mt-6 text-black/60">{t("empty")}</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-md bg-black px-6 py-2.5 text-white transition hover:bg-black/80"
        >
          {t("browseShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("checkoutTitle")}</h1>

      <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between py-3 text-sm"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatGBP(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between text-lg font-medium">
        <span>{t("total")}</span>
        <span>{formatGBP(totalPrice)}</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handlePay}
        disabled={isPending}
        className="mt-8 w-full rounded-md bg-black px-6 py-3 text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/40"
      >
        {isPending ? t("redirecting") : t("payWithCard")}
      </button>

      <p className="mt-3 text-center text-xs text-black/40">
        {t("testModeNote")}
      </p>

      <Link
        href="/cart"
        className="mt-6 block text-center text-sm text-black/60 underline"
      >
        {t("backToCart")}
      </Link>
    </div>
  );
}