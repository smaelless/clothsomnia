import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { WaitingClock } from "@/components/home/waiting-clock";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, SplitLines } from "@/components/ui/reveal";

/**
 * THE WAITING PAGE
 *
 * The clock is the page. Everything else answers one of the two questions a
 * visitor actually arrives with — when, and how do I not miss it — in that
 * order, and nothing else is asked of them.
 *
 * There is nothing to buy here on purpose. The shop is built and works, but
 * until 27 September there is nothing to collect, and a front door that sells
 * something it cannot ship is how a first order becomes a first refund.
 *
 * Written in the three languages the audience actually mixes, and not
 * translated line for line — that reads as a language toggle nobody asked for.
 * Each line lands in whichever of the three carries it best.
 *
 * The lookbook is untouched: same component, same stack, same captions. It is
 * the one section here that already worked.
 *
 * The real homepage is saved whole at app/_backup/home-principal.tsx. Copy it
 * back over this file on drop day; every component it needs is still here.
 */
export default function WaitingPage() {
  return (
    <>
      <WaitingClock />

      {/* ───────────────  THE LIST  ─────────────── */}
      <section
        className="relative overflow-hidden border-y border-bone/10 py-20 md:py-28"
        aria-label="Join the list"
      >
        <div
          aria-hidden
          className="bloom left-[8%] top-1/2 size-[30rem] -translate-y-1/2 bg-wine/20"
        />

        <div className="relative mx-auto grid max-w-[1200px] gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <p className="label-wide text-lime">L&apos;liste</p>
            </Reveal>

            <SplitLines
              lines={["Khod l'code", "qbel kolchi."]}
              className="display mt-6 text-[clamp(2.25rem,6.5vw,4.75rem)] leading-[0.95]"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
            />

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-silver">
                Sift numéro dialek. Nhar l&apos;drop, l&apos;gens ghadi ykhaser 3lihom
                l&apos;waqt — nta ghadi ykoun 3endek l&apos;code qbel ma tebda.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-smoke">
                Un message sur WhatsApp avant le 27 septembre, avec ton code. Rien d&apos;autre.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            {/* Framed, because it is the only thing on the page that asks for
                something — it should look like a door, not a footnote. */}
            <div className="rounded-3xl border border-bone/12 bg-charcoal/40 p-6 md:p-8">
              <WaitlistForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────  THE BAND  ───────────────
          A breath between the ask and the pictures, and the only place on the
          page where the lines get to be loud. */}
      <div className="border-b border-bone/10 py-6" aria-hidden>
        <Marquee duration={22}>
          <span className="display flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 text-[clamp(1.75rem,5vw,3.5rem)] leading-none text-bone/[0.16]">
            Ila 3reftini, 3reftini.
            <span className="text-lime/40">✦</span>
            Wear it once, they talk about it saison kamla.
            <span className="text-wine/60">✦</span>
            Dress like you already made it.
            <span className="text-lime/40">✦</span>
          </span>
        </Marquee>
      </div>

      {/* ───────────────  WHAT THEY ARE WAITING FOR  ─────────────── */}
      <section className="pt-20 md:pt-28" aria-label="Chapter 1, out of focus">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <Reveal>
            <p className="label-wide text-lime">Chnou kayjina</p>
          </Reveal>

          <SplitLines
            lines={["Wahed l'hoodie.", "Jouj colours."]}
            className="display mt-6 max-w-[20ch] text-giant leading-[0.9]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[48ch] text-base leading-relaxed text-silver">
              Pine w Wine. L&apos;photos hna mghayrin b&apos;chwiya — l&apos;wost ghadi tchoufo
              nhar 27. <span className="text-smoke">Floues f&apos;yeddek, livraison free.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Untouched, deliberately. */}
      <LookbookGallery heading={false} />

      {/* ───────────────  THE LAST WORD  ─────────────── */}
      <section
        className="relative overflow-hidden border-t border-bone/10 py-24 md:py-32"
        aria-label="Chapter 1"
      >
        <div
          aria-hidden
          className="bloom left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 bg-pine/20"
        />

        <div className="relative mx-auto max-w-[1600px] px-4 text-center md:px-8">
          <SplitLines
            lines={["Kolchi kaylbes.", "Machi kolchi kay3ref ykhtar."]}
            className="display text-giant leading-[0.9]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <Reveal delay={0.3}>
            <p className="label-wide mt-12 text-lime">
              27 September — <span className="text-smoke">inchaAllah</span>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
