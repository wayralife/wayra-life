import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("admin");

  const sections = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/products", label: t("products") },
    { href: "/admin/orders", label: t("orders") },
    { href: "/admin/categories", label: t("categories") },
    { href: "/admin/customers", label: t("customers") },
    { href: "/admin/content", label: t("content") },
    { href: "/admin/settings", label: t("settings") },
  ] as const;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-current/50">
          {t("title")}
        </h2>
        <nav className="mt-4 flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-6 inline-block text-xs text-current/50 hover:underline"
        >
          ← {t("backToSite")}
        </Link>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
