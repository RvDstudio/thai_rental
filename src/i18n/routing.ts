import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "en",
  // Don't use URL-based locale prefixes - rely on cookie instead
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
