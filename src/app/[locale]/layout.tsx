import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "WAYRA.life",
  description:
    "Ceremonial South American plant tools — rapé, hapé, kuripe, herbs and crafts — brought to the UK with care.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col antialiased">
        <NextIntlClientProvider locale={locale}>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
