"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountNavLink() {
  const t = useTranslations("nav");
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsSignedIn(!!data.user);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsSignedIn(!!session?.user);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <Link
      href="/account"
      className="flex items-center gap-1.5 text-sm whitespace-nowrap"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
        </svg>
      </span>
      {isSignedIn ? t("account") : t("logIn")}
    </Link>
  );
}
