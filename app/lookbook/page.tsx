import type { Metadata } from "next";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { PrivateList } from "@/components/home/private-list";
import { PageHero } from "@/components/ui/page-hero";
import { FRAMES } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Lookbook — Chapter 1",
  description:
    "Chapter 1: Dreams. The hoodie, both ways, in twelve frames.",
};

export default function LookbookPage() {
  return (
    <>
      <PageHero
        label="Lookbook — Chapter 1: Dreams"
        lines={["Both ways,", "twelve frames"]}
        copy="One hoodie, two colourways, front and back. The curved panel does something different from every angle — that is the whole reason the book exists."
        tone="wine"
        seed="lookbook-hero"
        meta={[
          { k: "Frames", v: String(FRAMES.length) },
          { k: "Colourways", v: "Pine & Wine" },
          { k: "Drops", v: "27 September" },
        ]}
      />

      <LookbookGallery frames={FRAMES} heading={false} />
      <PrivateList />
    </>
  );
}
