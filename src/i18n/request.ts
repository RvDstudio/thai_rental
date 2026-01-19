import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { routing } from "./routing";

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  // Try to get from Accept-Language header as fallback
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");
  const browserLocale = acceptLanguage?.split(",")[0]?.split("-")[0];

  // Determine the locale
  let locale = localeCookie;

  if (!locale || !routing.locales.includes(locale as "en" | "th")) {
    if (browserLocale && routing.locales.includes(browserLocale as "en" | "th")) {
      locale = browserLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
