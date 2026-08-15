import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { HelpContent } from "../help/help-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach us about an order, a size, or anything else.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        lines={["Talk to a person"]}
        copy="How to reach us about an order, a size, or anything else."
        tone="pine"
        seed="contact-hero"
      />
      <HelpContent open="contact" />
    </>
  );
}
