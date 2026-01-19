"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Search, Heart, User } from "lucide-react";
import Image from "next/image";
import { UserDropdown } from "./UserDropdown";
import { useWishlist } from "@/contexts/WishlistContext";

export function Header() {
  const { data: session } = useSession();
  const { items: wishlistItems } = useWishlist();

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
          Properties
        </Link>
        <Link
          href="/about"
          className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          Contact
        </Link>
      </nav>

      {/* Icons on the right */}
      <div className="flex items-center justify-end gap-6">
        <Link
          href="/search"
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </Link>
        
        <Link
          href="/wishlist"
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative"
          aria-label="Wishlist"
        >
          <Heart size={20} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
            </span>
          )}
        </Link>

        {session?.user ? (
          <UserDropdown user={session.user as { name: string; email: string; image?: string | null; role?: string }} />
        ) : (
          <Link
            href="/sign-in"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Sign in"
          >
            <User size={20} />
          </Link>
        )}
      </div>
      </div>
    </header>
  );
}