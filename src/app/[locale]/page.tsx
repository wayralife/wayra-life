import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type Category = {
  id: string;
  slug: string;
  image_url: string | null;
  category_translations: { name: string }[];
};

async function getCategories(locale: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, image_url, category_translations(name, locale)")
    .eq("visible", true)
    .eq("category_translations.locale", locale)
    .order("sort_order", { ascending: true });

  return { data: data as Category[] | null, error };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const { data: categories, error } = await getCategories(locale);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-lg text-current/75">{t("heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-amber-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            {t("shopCta")}
          </Link>
          <Link
            href="/our-story"
            className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition hover:border-black/40 dark:border-white/20 dark:hover:border-white/50"
          >
            {t("storyCta")}
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-xl font-semibold">{t("categoriesTitle")}</h2>

        <p className="mt-2 text-xs text-current/50">
          {error ? t("connectionError") : t("connectionOk")}
        </p>

        {categories && categories.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="rounded-lg border border-black/10 p-4 text-center text-sm dark:border-white/15"
              >
                {category.category_translations?.[0]?.name ?? category.slug}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-current/60">{t("categoriesEmpty")}</p>
        )}
      </section>
    </div>
  );
}
