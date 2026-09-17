import { getTranslations } from "next-intl/server";

export default async function LegalDisclaimerPage() {
  const t = await getTranslations("legalDisclaimer");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-4 flex flex-col gap-4 text-black/70">
        <p>{t("body1")}</p>
        <p>{t("body2")}</p>
        <p>{t("body3")}</p>
        <p>{t("body4")}</p>
      </div>
    </div>
  );
}