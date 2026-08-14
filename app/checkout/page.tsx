import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Cash on delivery, free anywhere in Morocco.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        label="Checkout — Cash on delivery"
        lines={["Almost", "yours"]}
        copy="No card, no payment now. Tell us where you are and we will call to confirm before it ships. You pay the courier in cash when it arrives."
        tone="pine"
        seed="checkout-hero"
      />
      <CheckoutClient />
    </>
  );
}
