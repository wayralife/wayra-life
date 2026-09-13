"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const t = useTranslations("cart");
  const { clear, isLoaded } = useCart();

  useEffect(() => {
    if (isLoaded) clear();
    // Only clear once the cart has loaded from storage, and only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold">{t("successTitle")}</h1>
      <p className="mt-4 text-black/60">{t("successBody")}</p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-md bg-black px-6 py-2.5 text-white transition hover:bg-black/80"
      >
        {t("browseShop")}
      </Link>
    </div>
  );
}