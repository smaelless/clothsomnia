import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { HelpContent } from "../help/help-content";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Free delivery anywhere in Morocco, cash on delivery, and a confirmation call before anything ships.",
};

export default function ShippingPage() {
  return (
    <>
      <PageHero
        label="Shipping"
        lines={["Free across Morocco"]}
        copy="Free delivery anywhere in Morocco, cash on delivery, and a confirmation call before anything ships."
        tone="pine"
        seed="shipping-hero"
      />
      <HelpContent open="shipping" />
    </>
  );
}
