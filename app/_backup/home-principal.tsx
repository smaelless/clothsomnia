/**
 * HOME — PRINCIPAL
 *
 * The main page, saved whole and unrouted.
 *
 * This is the one to come back to. Copy this file over app/page.tsx and the
 * site is exactly as it is now, because every component it names still lives
 * in the tree and is still used by other pages — nothing here depends on this
 * file existing.
 *
 * Running order: the opening frame, the clock, the drop, the lookbook.
 * The longer original is at home-full.tsx.
 */
import { CountdownBand } from "@/components/home/countdown-band";
import { Hero } from "@/components/home/hero";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { NewDrop } from "@/components/home/new-drop";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CountdownBand />
      <NewDrop />
      <LookbookGallery />
    </>
  );
}
