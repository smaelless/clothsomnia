import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { WaitingHero } from "@/components/home/waiting-hero";

/**
 * THE WAITING PAGE.
 *
 * Four things, in this order: the header, the clock, what it means, and where
 * to leave a number. Then the lookbook, untouched.
 *
 * Nothing is for sale here on purpose. The shop is built and works, but until
 * 27 September there is nothing to collect, and a front door that sells what
 * it cannot ship is how a first order becomes a first refund.
 *
 * The real homepage is saved whole at app/_backup/home-principal.tsx. Copy it
 * back over this file on drop day; every component it needs is still here.
 */
export default function WaitingPage() {
  return (
    <>
      <WaitingHero />
      <LookbookGallery heading={false} />
    </>
  );
}
