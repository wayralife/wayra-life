import { getTranslations } from "next-intl/server";

export default async function OurStoryPage() {
  const t = await getTranslations("ourStory");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 leading-relaxed text-current/70">{t("body")}</p>
    </div>
  );
}
