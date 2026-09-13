import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ContactForm";

export default async function SupportPage() {
  const t = await getTranslations("support");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-3 text-black/60">{t("intro")}</p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <p className="mt-8 text-sm text-black/50">
        {t("emailNote")}{" "}
        <a href="mailto:info@wayra.life" className="underline">
          info@wayra.life
        </a>
      </p>
    </div>
  );
}