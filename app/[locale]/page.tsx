import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getShopCategories } from "@/lib/products";
import { getContentBlock } from "@/lib/content";

interface HomeHero {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const categories = await getShopCategories(locale);
  const hero = await getContentBlock<HomeHero>("home_hero", locale);

  const heroTitle = hero?.heroTitle || t("heroTitle");
  const heroSubtitle = hero?.heroSubtitle || t("heroSubtitle");
  const ctaLabel = hero?.ctaLabel || t("shopNow");
  const ctaUrl = hero?.ctaUrl || "/shop";
  const isExternalCta = ctaUrl.startsWith("http");

  const hasBackground = Boolean(hero?.heroImageUrl);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section
        className={
          hasBackground
            ? "relative mx-auto max-w-3xl overflow-hidden rounded-2xl text-center"
            : "mx-auto max-w-2xl text-center"
        }
      >
        {hasBackground && (
          <>
            {/* Plain img, not next/image: this URL is set by the admin and
                can come from any host. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero!.heroImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <div
          className={
            hasBackground
              ? "relative z-10 px-6 py-20 sm:py-28"
              : undefined
          }
        >
          <h1
            className={
              hasBackground
                ? "text-4xl font-semibold tracking-tight text-white"
                : "text-4xl font-semibold tracking-tight"
            }
          >
            {heroTitle}
          </h1>
          <p
            className={
              hasBackground
                ? "mt-4 whitespace-pre-line text-white/90"
                : "mt-4 whitespace-pre-line text-black/70"
            }
          >
            {heroSubtitle}
          </p>
          {isExternalCta ? (
            
              href={ctaUrl}
              className={
                hasBackground
                  ? "mt-8 inline-block rounded-md bg-white px-8 py-3 text-black transition hover:bg-white/90"
                  : "mt-8 inline-block rounded-md bg-black px-8 py-3 text-white transition hover:bg-black/80"
              }
            >
              {ctaLabel}
            </a>
          ) : (
            <Link
              href={ctaUrl}
              className={
                hasBackground
                  ? "mt-8 inline-block rounded-md bg-white px-8 py-3 text-black transition hover:bg-white/90"
                  : "mt-8 inline-block rounded-md bg-black px-8 py-3 text-white transition hover:bg-black/80"
              }
            >
              {ctaLabel}
            </Link>
          )}
        </div>
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
      </section>
    </div>
  );
}