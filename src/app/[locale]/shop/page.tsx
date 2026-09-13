import { getTranslations } from "next-intl/server";

export default async function ShopPage() {
  const t = await getTranslations("shop");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-current/70">{t("comingSoon")}</p>
    </div>
  );
}
