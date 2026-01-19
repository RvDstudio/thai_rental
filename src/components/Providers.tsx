"use client";

import { ReactNode } from "react";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WishlistProvider>{children}</WishlistProvider>
    </ThemeProvider>
  );
}
