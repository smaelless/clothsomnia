"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/chrome/announcement-bar";
import { BagDrawer } from "@/components/chrome/bag-drawer";
import { Cursor } from "@/components/chrome/cursor";
import { Footer } from "@/components/chrome/footer";
import { Header } from "@/components/chrome/header";
import { Intro } from "@/components/chrome/intro";
import { MobileMenu } from "@/components/chrome/mobile-menu";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { SearchOverlay } from "@/components/chrome/search-overlay";
import { Soundtrack } from "@/components/chrome/soundtrack";
import { TypeField } from "@/components/chrome/type-field";
import { WaitingBanner } from "@/components/chrome/waiting-banner";

/**
 * Everything wrapped around the storefront — and nothing wrapped around the
 * admin. The admin is a tool, not a shop window: the intro curtain, the drifting
 * type field and the custom cursor all get in the way of reading a phone number
 * off an order at speed.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /*
   * The waiting page has nowhere to navigate to, so it loses the announcement
   * bar and the nav and gets a banner instead. Every other page keeps both —
   * the shop is still built, still linked and still works, and stripping the
   * header everywhere would strand anyone who reached it.
   */
  const waiting = pathname === "/";

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main" className="skip-link label glass rounded-full px-5 py-3 text-lime">
        Skip to content
      </a>

      {/* First, deliberately: the audio element starts playing as soon as it
          parses, so it should parse before the loading screen rather than after
          it. Storefront only — music over the order screen would be a
          liability, not a mood. */}
      <Soundtrack />

      <Intro />
      <ScrollProgress />
      <Cursor />

      {/* Sits above the page background, below all content */}
      <TypeField />

      <div className="relative z-10">
        {waiting ? (
          <WaitingBanner />
        ) : (
          <>
            <AnnouncementBar />
            <Header />
          </>
        )}

        <main id="main">{children}</main>

        <Footer />
      </div>

      {/* Overlays — mounted once, driven by the store */}
      <MobileMenu />
      <SearchOverlay />
      <BagDrawer />
    </>
  );
}
