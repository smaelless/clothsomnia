import { CountdownBand } from "@/components/home/countdown-band";
import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { Opening } from "@/components/home/opening";

/**
 * THE WAITING PAGE — temporary.
 *
 * Three things, in the order someone needs them: who this is, when it lands,
 * and what it looks like. Nothing to buy, because until 27 September there is
 * nothing to collect — the shop is still built, still linked and still works,
 * it is simply not what the front door is for yet.
 *
 * The real homepage is saved whole at app/_backup/home-principal.tsx. Copy it
 * back over this file on drop day; every component it needs is still here.
 */
export default function WaitingPage() {
  return (
    <>
      <Opening />
      <CountdownBand />
      <LookbookGallery />
    </>
  );
}
