/**
 * THE LAUNCH HOMEPAGE — the real one, parked while the waiting page runs.
 *
 * Hero, countdown band, the drop, the lookbook. Restore it by copying this
 * file back over app/page.tsx; nothing else has to change, because every
 * component it uses is still in the tree and still used elsewhere.
 */
import { CountdownBand } from "@/components/home/countdown-band";
import { Hero } from "@/components/home/hero";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { NewDrop } from "@/components/home/new-drop";

/**
 * HOMEPAGE
 *
 * Three sections and the footer: the opening frame, the drop, the lookbook.
 * A single-product launch does not need a runway, a product-page teaser and a
 * brand essay before it shows the thing it is selling — those pages still
 * exist and are still linked, they just are not in the way.
 *
 * The longer running order is preserved at app/_backup/home-full.tsx.
 */
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
