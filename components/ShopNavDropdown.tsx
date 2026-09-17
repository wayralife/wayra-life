"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

interface CategoryOption {
  slug: string;
  name: string;
}

export default function ShopNavDropdown() {
  const t = useTranslations("nav");
  const tShop = useTranslations("shop");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    supabase
      .from("categories")
      .select("slug, sort_order, category_translations(locale, name)")
      .eq("visible", true)
      .order("sort_order")
      .then(({ data }) => {
        if (!active || !data) return;
        setCategories(
          data.map((row: any) => {
            const translations: any[] = row.category_translations ?? [];
            const translation =
              translations.find((tr) => tr.locale === locale) ??
              translations.find((tr) => tr.locale === "en") ??
              translations[0];
            return { slug: row.slug, name: translation?.name ?? row.slug };
          })
        );
      });

    return () => {
      active = false;
    };
  }, [locale]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-1">
        <Link href="/shop">{t("shop")}</Link>
        {categories.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle shop categories"
            aria-expanded={open}
            className="p-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`h-3.5 w-3.5 text-black/50 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/*
        pt-2 (not mt-2) on purpose: a margin would leave a gap between the
        trigger and this menu that isn't part of either element's hit box,
        so moving the mouse straight down from "Shop" to a category would
        cross a dead zone and fire onMouseLeave on the container, closing
        the menu before the click landed. Padding keeps that space inside
        this element (and therefore inside the shared hover area), while
        the visible white box still starts below it.
      */}
      {open && categories.length > 0 && (
        <div className="absolute left-0 top-full z-20 pt-2">
          <div className="min-w-44 rounded-md border border-black/10 bg-white py-2 shadow-lg">
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="block px-4 py-1.5 text-sm hover:bg-black/5"
            >
              {tShop("allCategories")}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-1.5 text-sm hover:bg-black/5"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}