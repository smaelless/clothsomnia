import type { Metadata } from "next";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { PrivateList } from "@/components/home/private-list";
import { PageHero } from "@/components/ui/page-hero";
import { FRAMES, type Frame } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Lookbook — Chapter 1",
  description:
    "Chapter 1: Dreams. The hoodie, both ways, in twelve frames.",
};

/** The full book — the homepage shows six of these, this page runs all of them. */
const EXTRA: Frame[] = [
  { id: "f7", caption: "Nothing opens until we do", meta: "Frame 07 / 12", tone: "cream", orientation: "portrait" },
  { id: "f8", caption: "Dress the static", meta: "Frame 08 / 12", tone: "pine", orientation: "landscape" },
  { id: "f9", caption: "After dark, everything sharpens", meta: "Frame 09 / 12", tone: "wine", orientation: "tall" },
  { id: "f10", caption: "Uniform for the wide-awake", meta: "Frame 10 / 12", tone: "cream", orientation: "portrait" },
  { id: "f11", caption: "The long way home", meta: "Frame 11 / 12", tone: "pine", orientation: "landscape" },
  { id: "f12", caption: "Sleep can wait", meta: "Frame 12 / 12", tone: "silver", orientation: "tall" },
];

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
          { k: "Frames", v: "12" },
          { k: "Colourways", v: "Pine & Wine" },
          { k: "Drops", v: "27 September" },
        ]}
      />

      <LookbookGallery frames={FRAMES} heading={false} />
      <LookbookGallery frames={EXTRA} heading={false} />
      <PrivateList />
    </>
  );
}
