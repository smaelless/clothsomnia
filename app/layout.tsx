import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import "./globals.css";

import { AnnouncementBar } from "@/components/chrome/announcement-bar";
import { BagDrawer } from "@/components/chrome/bag-drawer";
import { Cursor } from "@/components/chrome/cursor";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { Intro } from "@/components/chrome/intro";
import { MobileMenu } from "@/components/chrome/mobile-menu";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { SearchOverlay } from "@/components/chrome/search-overlay";
import { TypeField } from "@/components/chrome/type-field";
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
    default: "Clothsomnia — Made for the hours that never end",
    template: "%s — Clothsomnia",
  },
  description:
    "Clothing for the sleepless. A midnight runway of unisex, men's, girls', sport and school pieces, dropped after dark.",
  keywords: ["Clothsomnia", "fashion", "streetwear", "after hours", "runway", "unisex"],
  openGraph: {
    title: "Clothsomnia — Made for the hours that never end",
    description: "Clothing for the sleepless. Tonight's drop is live.",
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
          <a href="#main" className="skip-link label glass rounded-full px-5 py-3 text-lime">
            Skip to content
          </a>

          <Intro />
          <ScrollProgress />
          <Cursor />

          {/* Sits above the page background, below all content */}
          <TypeField />

          <div className="relative z-10">
            <AnnouncementBar />
            <Header />

            <main id="main">{children}</main>

            <Footer />
          </div>

          {/* Overlays — mounted once, driven by the store */}
          <MobileMenu />
          <SearchOverlay />
          <BagDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
