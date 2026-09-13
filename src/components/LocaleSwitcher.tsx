"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  pl: "PL",
  es: "ES",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(event) => {
        const nextLocale = event.target.value;
        router.replace(pathname, { locale: nextLocale });
      }}
      className="rounded border border-black/15 bg-transparent px-2 py-1 text-sm dark:border-white/20"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {LOCALE_LABELS[loc] ?? loc}
        </option>
      ))}
    </select>
  );
}
