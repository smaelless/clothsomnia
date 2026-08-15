import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { HelpContent } from "../help/help-content";

export const metadata: Metadata = {
  title: "Returns",
  description: "How exchanges and returns work, and what happens if a piece arrives faulty.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        label="Returns"
        lines={["Wrong size, no drama"]}
        copy="How exchanges and returns work, and what happens if a piece arrives faulty."
        tone="pine"
        seed="returns-hero"
      />
      <HelpContent open="returns" />
    </>
  );
}
