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
export default function HomePage() {
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
