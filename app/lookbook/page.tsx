import type { Metadata } from "next";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { PrivateList } from "@/components/home/private-list";
import { PageHero } from "@/components/ui/page-hero";
import { FRAMES, type Frame } from "@/lib/worlds";

export const metadata: Metadata = {
  title: "Lookbook — 24 frames",
  description:
    "Chapter 01, After Hours. Twenty-four frames shot between midnight and first light.",
};

/** The full book — the homepage shows six of these, this page runs all of them. */
const EXTRA: Frame[] = [
  { id: "f7", caption: "Nothing opens until we do", meta: "Frame 02 / 24", tone: "cobalt", orientation: "portrait" },
  { id: "f8", caption: "Dress the static", meta: "Frame 06 / 24", tone: "violet", orientation: "landscape" },
  { id: "f9", caption: "After dark, everything sharpens", meta: "Frame 11 / 24", tone: "magenta", orientation: "tall" },
  { id: "f10", caption: "Uniform for the wide-awake", meta: "Frame 15 / 24", tone: "lime", orientation: "portrait" },
  { id: "f11", caption: "The long way home", meta: "Frame 19 / 24", tone: "navy", orientation: "landscape" },
  { id: "f12", caption: "Sleep can wait", meta: "Frame 24 / 24", tone: "silver", orientation: "tall" },
];

export default function LookbookPage() {
  return (
    <>
      <PageHero
        label="Lookbook — Chapter 01"
        lines={["After midnight,", "twenty-four frames"]}
        copy="Shot across one night in Rotterdam between 23:00 and first light, on a crew who had all agreed to stay up. No studio, no reshoots, no daylight anywhere in the book."
        tone="magenta"
        seed="lookbook-hero"
        meta={[
          { k: "Frames", v: "24" },
          { k: "Shot", v: "23:00 — 05:40" },
          { k: "Location", v: "Rotterdam" },
        ]}
      />

      <LookbookGallery frames={FRAMES} heading={false} />
      <LookbookGallery frames={EXTRA} heading={false} />
      <PrivateList />
    </>
  );
}
