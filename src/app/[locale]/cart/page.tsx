import { getTranslations } from "next-intl/server";

export default async function CartPage() {
  const t = await getTranslations("cart");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-current/70">{t("empty")}</p>
      <p className="mt-2 text-sm text-current/50">{t("body")}</p>
    </div>
  );
}
