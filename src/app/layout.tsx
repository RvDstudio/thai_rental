import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/Providers";
import "./globals.css";

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope/Manrope-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope/Manrope-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thai Rental - Find Your Perfect Property",
  description: "Discover beautiful rental properties across Thailand",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased root`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
