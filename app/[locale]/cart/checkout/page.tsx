import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function CheckoutPage() {
  const t = await getTranslations("cart");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">{t("checkoutTitle")}</h1>
      <p className="mt-6 rounded-md border border-dashed border-black/20 p-6 text-black/60">
        {t("checkoutPlaceholder")}
      </p>
      <Link
        href="/cart"
        className="mt-8 inline-block rounded-md border border-black/20 px-6 py-2.5 transition hover:border-black/40"
      >
        {t("backToCart")}
      </Link>
    </div>
  );
}
