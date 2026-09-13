import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales the storefront supports. English is the default/fallback
  // language per the Phase 1 architecture doc.
  locales: ["en", "pl", "es"],
  defaultLocale: "en",
});
