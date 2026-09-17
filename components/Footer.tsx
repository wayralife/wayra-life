import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getShopCategories } from "@/lib/products";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  const categories = await getShopCategories(locale);

  return (
    <footer className="border-t border-black/10 bg-black/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 text-sm sm:grid-cols-4">
        <div>
          <h3 className="mb-3 font-semibold">{t("shopHeading")}</h3>
          <ul className="flex flex-col gap-2 text-black/60">
            {categories.slice(0, 4).map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="hover:text-black"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("accountHeading")}</h3>
          <ul className="flex flex-col gap-2 text-black/60">
            <li>
              <Link href="/login" className="hover:text-black">
                {t("login")}
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-black">
                {t("myAccount")}
              </Link>
            </li>
            <li>
              <Link href="/login?mode=signup" className="hover:text-black">
                {t("createAccount")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("quickLinksHeading")}</h3>
          <ul className="flex flex-col gap-2 text-black/60">
            <li>
              <Link href="/our-story" className="hover:text-black">
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-black">
                {t("shippingPolicy")}
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-black">
                {t("refundPolicy")}
              </Link>
            </li>
            <li>
              <Link href="/legal-disclaimer" className="hover:text-black">
                {t("legalDisclaimer")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-black">
                {t("faq")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">{t("contactHeading")}</h3>
          <p className="text-black/60">
            <a href="mailto:info@wayra.life" className="hover:text-black">
              info@wayra.life
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-black/10 py-6 text-center text-xs text-black/50">
        © {year} WAYRA.life. {t("rights")}
      </div>
    </footer>
  );
}