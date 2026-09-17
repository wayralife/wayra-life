import { getTranslations } from "next-intl/server";

export default async function ShippingPolicyPage() {
  const t = await getTranslations("shippingPolicy");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-black/70">{t("intro")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("processingHeading")}</h2>
      <p className="mt-2 text-black/70">{t("processingBody")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("deliveryHeading")}</h2>
      <p className="mt-2 text-black/70">{t("deliveryBody")}</p>

      <h2 className="mt-8 text-lg font-medium">{t("costHeading")}</h2>
      <p className="mt-2 text-black/70">{t("costBody")}</p>
    </div>
  );
}