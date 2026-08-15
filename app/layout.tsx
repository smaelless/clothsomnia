import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import "./globals.css";

import { SiteChrome } from "@/components/chrome/site-chrome";
import { StoreProvider } from "@/providers/store";

/** Editorial display face — high contrast, campaign headlines only. */
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display-family",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** UI face — everything you actually have to read. */
const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clothsomnia.com"),
  title: {
    default: "Clothsomnia — T'lbess what they'll remember",
    template: "%s — Clothsomnia",
  },
  description:
    "Clothing for the sleepless. Chapter 1: Dreams — one oversized hoodie, two colourways, dropping 27 September. Free delivery across Morocco, cash on delivery.",
  keywords: ["Clothsomnia", "fashion", "streetwear", "after hours", "runway", "unisex"],
  openGraph: {
    title: "Clothsomnia — Chapter 1: Dreams",
    description: "One oversized hoodie, two colourways. Drops 27 September.",
    type: "website",
    locale: "en_GB",
    siteName: "Clothsomnia",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#05060A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh bg-ink antialiased">
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
