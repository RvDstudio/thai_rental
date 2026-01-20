"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "th", name: "ภาษาไทย", flag: "🇹🇭" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    // Set cookie to persist the language preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Force a hard reload to ensure the new locale is picked up
    // router.refresh() doesn't work reliably with cookie-based locales
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 px-2 py-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#122B45]/20"
        disabled={isPending}
      >
        <Globe size={18} className={isPending ? "animate-spin" : ""} />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage?.flag}
        </span>
        <ChevronDown size={14} className="opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between gap-3 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {locale === lang.code && (
              <Check size={16} className="text-[#122B45]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
