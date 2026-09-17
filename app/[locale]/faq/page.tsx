import { getTranslations } from "next-intl/server";

export default async function FaqPage() {
  const t = await getTranslations("faq");
  const questionKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-6 flex flex-col divide-y divide-black/10">
        {questionKeys.map((key) => (
          <div key={key} className="py-5">
            <h2 className="font-medium">{t(key)}</h2>
            <p className="mt-2 text-black/70">{t(`a${key.slice(1)}`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}