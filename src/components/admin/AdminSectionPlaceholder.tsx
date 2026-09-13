import { getTranslations } from "next-intl/server";

export default async function AdminSectionPlaceholder({
  titleKey,
}: {
  titleKey: "dashboard" | "products" | "orders" | "categories" | "customers" | "content" | "settings";
}) {
  const t = await getTranslations("admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t(titleKey)}</h1>
      <p className="mt-3 text-sm text-current/60">{t("placeholder")}</p>
    </div>
  );
}
