import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 py-8 text-center text-sm text-black/60">
      <p>WAYRA.life — {t("email")}</p>
      <p>
        © {year} WAYRA.life. {t("rights")}
      </p>
    </footer>
  );
}
