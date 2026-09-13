import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getShopCategories } from "@/lib/products";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const categories = await getShopCategories(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-black/70">{t("heroSubtitle")}</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-md bg-black px-8 py-3 text-white transition hover:bg-black/80"
        >
          {t("shopNow")}
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="mb-6 text-center text-sm uppercase tracking-widest text-black/50">
          {t("categoriesTitle")}
        </h2>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={{ pathname: "/shop", query: { category: category.slug } }}
                className="rounded-lg border border-black/10 p-6 text-center transition hover:border-black/30 hover:shadow-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}
        <p className="mt-6 text-center text-xs text-black/40">
          {t("connectedNote")}
        </p>
      </section>
    </div>
  );
}
