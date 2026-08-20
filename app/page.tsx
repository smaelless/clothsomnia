import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { Countdown } from "@/components/ui/countdown";
import { Marquee } from "@/components/ui/marquee";
import { SplitLines } from "@/components/ui/reveal";

/**
 * THE WAITING PAGE
 *
 * The clock is the page. Everything else answers one of the two questions a
 * visitor arrives with — when, and how do I not miss it — in that order.
 *
 * There is nothing to buy here on purpose. The shop is built and works, but
 * until 27 September there is nothing to collect, and a front door that sells
 * something it cannot ship is how a first order becomes a first refund.
 *
 * Written in the three languages the audience actually mixes. Not translated
 * line for line, which reads as a language toggle nobody asked for — each line
 * lands in whichever of the three carries it best.
 *
 * The real homepage is saved whole at app/_backup/home-principal.tsx. Copy it
 * back over this file on drop day; every component it needs is still here.
 */
export default function WaitingPage() {
  return (
    <>
      {/* ───────────────  THE CLOCK  ─────────────── */}
      <section
        className="relative overflow-hidden pb-20 pt-4 md:pb-28 md:pt-6"
        aria-label="Time until the drop"
      >
        <div
          aria-hidden
          className="bloom left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 bg-pine/20"
        />

        {/* Ghost type behind the board, moving at its own pace */}
        <Marquee
          duration={54}
          className="pointer-events-none absolute inset-x-0 top-[38%] -translate-y-1/2 select-none opacity-[0.045]"
        >
          <span className="display whitespace-nowrap pr-10 text-[clamp(4rem,15vw,13rem)] leading-none">
            TSENNA — BIENTÔT — TSENNA — BIENTÔT —
          </span>
        </Marquee>

        <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
          <p className="label-wide mb-8 flex items-center justify-center gap-3 text-lime">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-lime animate-flicker" />
            Chapter 1 — Dreams
          </p>

          {/*
            Deliberately quiet, and above the board rather than below it. The
            clock is the message; this only says what is being waited for.
          */}
          <SplitLines
            lines={["Tsenna chwiya.", "Ça arrive."]}
            className="display mb-12 text-center text-[clamp(1.75rem,4.6vw,3.25rem)] leading-[1.05]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          {/* The board — the largest thing on the page, by a distance */}
          <Countdown size="large" label="L'drop kayji f" />

          <p className="mx-auto mt-12 max-w-[52ch] text-center text-sm leading-relaxed text-smoke">
            Khamsin qet3a f&apos;kol taille, f&apos;kol loun. Ma kayn la restock la walou.
            <span className="mt-1 block text-smoke/70">
              50 pièces par taille. Une fois parties, c&apos;est fini.
            </span>
          </p>
        </div>
      </section>

      {/* ───────────────  THE LIST  ─────────────── */}
      <section className="border-y border-bone/10 py-16 md:py-24" aria-label="Join the list">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <p className="label-wide text-lime">L&apos;liste</p>

            <SplitLines
              lines={["Khod l'code", "qbel kolchi."]}
              className="display mt-6 text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95]"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
            />

            <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-silver">
              Sift numéro dialek. Nhar l&apos;drop, l&apos;gens ghadi ykhaser 3lihom l&apos;waqt —
              nta ghadi ykoun 3endek l&apos;code qbel ma tebda.
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-smoke">
              Un message sur WhatsApp avant le 27 septembre, avec ton code. Rien d&apos;autre.
            </p>
          </div>

          <div className="lg:pl-4">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* ───────────────  WHAT THEY ARE WAITING FOR  ─────────────── */}
      <section className="pt-16 md:pt-24" aria-label="Chapter 1, out of focus">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <p className="label-wide text-lime">Chnou kayjina</p>
          <SplitLines
            lines={["Wahed l'hoodie.", "Jouj colours."]}
            className="display mt-6 max-w-[20ch] text-giant leading-[0.9]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />
          <p className="mt-8 max-w-[48ch] text-base leading-relaxed text-silver">
            Pine w Wine. L&apos;photos hna mghayrin b&apos;chwiya — l&apos;wost ghadi tchoufo
            nhar 27. <span className="text-smoke">Floues f&apos;yeddek, livraison free.</span>
          </p>
        </div>
      </section>

      <LookbookGallery heading={false} />

      {/* ───────────────  THE LAST WORD  ─────────────── */}
      <section className="border-t border-bone/10 py-20 md:py-28" aria-label="Chapter 1">
        <div className="mx-auto max-w-[1600px] px-4 text-center md:px-8">
          <p className="display text-giant leading-[0.9]">
            Kolchi kaylbes.
            <span className="block italic font-light text-silver">
              Machi kolchi kay3ref ykhtar.
            </span>
          </p>
          <p className="label-wide mt-10 text-lime">
            27 September — <span className="text-smoke">inchaAllah</span>
          </p>
        </div>
      </section>
    </>
  );
}
