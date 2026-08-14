import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { WishlistClient } from "./wishlist-client";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The pieces you saved.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHero
        label="Wishlist"
        lines={["The ones", "you kept"]}
        copy="Everything you saved, held on this device. No account needed — but the list will not survive clearing your browser, and it will not hold stock for you."
        tone="wine"
        seed="wishlist-hero"
      />
      <WishlistClient />
    </>
  );
}
