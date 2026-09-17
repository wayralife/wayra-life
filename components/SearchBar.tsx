"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function SearchBar() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    const target = trimmed
      ? `/${locale}/shop?q=${encodeURIComponent(trimmed)}`
      : `/${locale}/shop`;
    window.location.href = target;
  }

  return (
    <form onSubmit={handleSubmit} className="w-36 shrink-0 sm:w-48">
      <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5">
        <button
          type="submit"
          aria-label={t("searchPlaceholder")}
          className="shrink-0 text-black/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" strokeLinecap="round" />
          </svg>
        </button>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
        />
      </div>
    </form>
  );
}