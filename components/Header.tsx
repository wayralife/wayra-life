"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { totalItems, isLoaded } = useCart();

  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/wayra-logo.jpg"
            alt="WAYRA.life"
            width={160}
            height={160}
            className="h-24 w-24 object-contain"
            priority
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/">{t("home")}</Link>
          <Link href="/shop">{t("shop")}</Link>
          <Link href="/our-story">{t("ourStory")}</Link>
          <Link href="/support">{t("support")}</Link>
          <Link href="/account">{t("account")}</Link>
          <Link href="/cart" className="font-medium">
            {t("cart")}
            {isLoaded && totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {routing.locales.map((loc) => (
            <Link
              key={loc}
              href={pathname}
              locale={loc}
              className={
                loc === locale ? "font-semibold underline" : "text-black/60"
              }
            >
              {loc.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}