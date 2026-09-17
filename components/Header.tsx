"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useCart } from "@/lib/cart-context";
import SearchBar from "@/components/SearchBar";
import AccountNavLink from "@/components/AccountNavLink";
import ShopNavDropdown from "@/components/ShopNavDropdown";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { totalItems, isLoaded } = useCart();

  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/wayra-logo.jpg"
            alt="WAYRA.life"
            width={160}
            height={160}
            className="h-14 w-14 object-contain"
            priority
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/">{t("home")}</Link>
          <ShopNavDropdown />
          <Link href="/our-story">{t("ourStory")}</Link>
          <Link href="/support">{t("support")}</Link>
        </nav>

        <SearchBar />

        <div className="flex items-center gap-5 text-sm">
          <AccountNavLink />

          <Link href="/cart" className="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M3 6h2l1.6 9.6A2 2 0 0 0 8.57 17H18a2 2 0 0 0 1.96-1.6L21 9H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs font-medium text-white">
              {isLoaded ? totalItems : 0}
            </span>
          </Link>

          <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}