import { getTranslations } from "next-intl/server";

export default async function RefundPolicyPage() {
  const t = await getTranslations("refundPolicy");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-black/70">{t("intro")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("unopenedHeading")}</h2>
      <p className="mt-2 text-black/70">{t("unopenedBody")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("hygieneHeading")}</h2>
      <p className="mt-2 text-black/70">{t("hygieneBody")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("refundHeading")}</h2>
      <p className="mt-2 text-black/70">{t("refundBody")}</p>

      <p className="mt-8 text-sm text-black/50">{t("contactNote")}</p>
    </div>
  );
}