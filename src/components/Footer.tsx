import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 py-8 text-sm text-current/70 dark:border-white/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:px-6">
        <span>WAYRA.life &copy; {year} — {t("rights")}</span>
        <a href={`mailto:${t("email")}`} className="hover:underline">
          {t("email")}
        </a>
      </div>
    </footer>
  );
}
