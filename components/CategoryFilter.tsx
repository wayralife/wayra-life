"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { ShopCategory } from "@/lib/products";

export default function CategoryFilter({
  categories,
}: {
  categories: ShopCategory[];
}) {
  const t = useTranslations("shop");
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <div className="mb-8 flex flex-wrap gap-2 text-sm">
      <Link
        href="/shop"
        className={`rounded-full border px-4 py-1.5 ${
          !activeCategory
            ? "border-black bg-black text-white"
            : "border-black/20"
        }`}
      >
        {t("allCategories")}
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={{ pathname: "/shop", query: { category: category.slug } }}
          className={`rounded-full border px-4 py-1.5 ${
            activeCategory === category.slug
              ? "border-black bg-black text-white"
              : "border-black/20"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
