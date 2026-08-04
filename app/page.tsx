import { AboutBlock } from "@/components/home/about-block";
import { CollectionWorlds } from "@/components/home/collection-worlds";
import { Hero } from "@/components/home/hero";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { Manifesto } from "@/components/home/manifesto";
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
      <Manifesto />
      <Runway />
      <CollectionWorlds />
      <NewDrop />
      <LookbookGallery />
      <ProductTeaser />
      <AboutBlock />
      <PrivateList />
    </>
  );
}
