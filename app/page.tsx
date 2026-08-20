import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { WaitingHero } from "@/components/home/waiting-hero";
import { SplitLines } from "@/components/ui/reveal";

/**
 * THE WAITING PAGE.
 *
 * The header, the clock, where to leave a number, and then the lookbook.
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

      {/*
        The title sits here rather than inside LookbookGallery, which stays
        exactly as it is. Its own heading carries a section number and a link
        through to the full book — neither of which belongs on a page where the
        lookbook is the last thing and there is nowhere else to send anyone.
      */}
      <section className="pb-10 md:pb-14" aria-label="Lookbook">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <SplitLines
            lines={["Lbess fchkel,", "be the difference."]}
            className="display text-[clamp(2rem,6.5vw,5rem)] leading-[0.92]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />
        </div>
      </section>

      <LookbookGallery heading={false} />
    </>
  );
}
