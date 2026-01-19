"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Search, Heart, User } from "lucide-react";
import Image from "next/image";
import { UserDropdown } from "./UserDropdown";
import { useWishlist } from "@/contexts/WishlistContext";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { data: session } = useSession();
  const { items: wishlistItems } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const t = useTranslations("common");

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 ">
      <div className="container mx-auto w-full px-6 py-4 md:px-0 grid grid-cols-3 items-center">
        {/* Logo on the left */}
        <Link href="/" className="flex items-center justify-start">
          <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
        </Link>

        {/* Navigation in the center */}
        <nav className="flex items-center justify-center gap-8">
          <Link
            href="/properties"
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            {t("properties")}
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            {t("about")}
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            {t("contact")}
          </Link>
        </nav>

        {/* Icons on the right */}
        <div className="flex items-center justify-end gap-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("searchPlaceholder")}
                  className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45] transition-all"
                />
                <button
                  type="submit"
                  className="ml-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={t("search")}
                >
                  <Search size={20} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={t("search")}
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          <Link
            href="/wishlist"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
            aria-label={t("wishlist")}
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
              </span>
            )}
          </Link>

          {session?.user ? (
            <UserDropdown
              user={
                session.user as {
                  name: string;
                  email: string;
                  image?: string | null;
                  role?: string;
                }
              }
            />
          ) : (
            <Link
              href="/sign-in"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={t("signIn")}
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
