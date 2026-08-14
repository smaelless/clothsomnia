/**
 * FULL HOMEPAGE — kept as a backup, not routed.
 *
 * This is the long version: hero, runway, drop, lookbook, product teaser,
 * about and the private list. The live homepage was trimmed to hero + drop +
 * lookbook; this file preserves the original running order.
 *
 * A folder starting with _ is private in the App Router, so nothing here is
 * reachable as a URL.
 *
 * To restore: copy the JSX below back into app/page.tsx.
 */
import { AboutBlock } from "@/components/home/about-block";
import { Hero } from "@/components/home/hero";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { NewDrop } from "@/components/home/new-drop";
import { PrivateList } from "@/components/home/private-list";
import { ProductTeaser } from "@/components/home/product-teaser";
import { Runway } from "@/components/home/runway";

/**
 * HOMEPAGE — the fashion show, in order.
 * Every section is self-contained and reusable; this file is only the running
 * order, which is exactly how it should read.
 */
export default function HomePageFull() {
  return (
    <>
      <Hero />
      <Runway />
      <NewDrop />
      <LookbookGallery />
      <ProductTeaser />
      <AboutBlock />
      <PrivateList />
    </>
  );
}
