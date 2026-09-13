import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";

export default function NavBar() {
  const t = useTranslations("nav");

  const links = [
    { href: "/", label: t("home") },
    { href: "/shop", label: t("shop") },
    { href: "/our-story", label: t("ourStory") },
    { href: "/support", label: t("support") },
  ] as const;

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          WAYRA<span className="text-amber-600">.life</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-current/80 transition hover:text-current"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/account" className="text-current/80 transition hover:text-current">
            {t("account")}
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-black/15 px-3 py-1 transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/50"
          >
            {t("cart")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
