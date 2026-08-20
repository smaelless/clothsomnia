import { LookbookGallery } from "@/components/home/lookbook-gallery";
import { WaitingBoard } from "@/components/home/waiting-board";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { Marquee } from "@/components/ui/marquee";
import { Reveal, SplitLines } from "@/components/ui/reveal";

/**
 * THE WAITING PAGE — a departure hall.
 *
 * A drop is a departure, and the countdown was already a split-flap board, so
 * the page is built as the terminal that board belongs to: a status line, a
 * departure time, a manifest of what is on the flight, and one desk where you
 * put your name down. Nothing is centred and nothing is sold.
 *
 * The shop is built and works, but until 27 September there is nothing to
 * collect, and a front door that sells what it cannot ship is how a first
 * order becomes a first refund.
 *
 * Written in the three languages the audience actually mixes, and not
 * translated line for line — that reads as a language toggle nobody asked for.
 * Each line lands in whichever of the three carries it best.
 *
 * The lookbook is untouched: same component, same stack, same captions. It is
 * the one section that already worked.
 *
 * The real homepage is saved whole at app/_backup/home-principal.tsx. Copy it
 * back over this file on drop day; every component it needs is still here.
 */
export default function WaitingPage() {
  return (
    <>
      <WaitingBoard />

      {/* ───────────────  THE DESK  ───────────────
          The one pale panel on a site that is otherwise all night. Everything
          above and below it is atmosphere; this is the only thing being asked
          for, so it gets the lights turned on. */}
      <section className="relative bg-cream text-ink" aria-label="Join the list">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-28">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-24">
            <div>
              <Reveal>
                <p className="label-wide text-ink/45">Desk 01 — L&apos;liste</p>
              </Reveal>

              <SplitLines
                lines={["Khod l'code", "qbel kolchi."]}
                className="display mt-8 text-[clamp(2.5rem,8vw,6rem)] leading-[0.88] tracking-[-0.02em]"
                lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-ink/45"
              />

              <Reveal delay={0.2}>
                <p className="mt-10 max-w-[42ch] text-base leading-relaxed text-ink/70 md:text-lg">
                  Nhar l&apos;drop, l&apos;gens ghadi ykhaser 3lihom l&apos;waqt — nta ghadi
                  ykoun 3endek l&apos;code qbel ma tebda.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink/45">
                  Un message sur WhatsApp avant le 27 septembre, avec ton code. Rien d&apos;autre.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <WaitlistForm tone="light" />
            </Reveal>
          </div>
        </div>

        {/* The seam back into the dark, so the panel ends deliberately rather
            than just stopping. */}
        <div aria-hidden className="h-px w-full bg-ink/10" />
      </section>

      {/* ───────────────  THE TICKER  ───────────────
          Thin, loud, and the only place the lines get to shout. */}
      <div className="border-b border-bone/10 bg-ink py-5" aria-hidden>
        <Marquee duration={20}>
          <span className="label flex shrink-0 items-center gap-6 whitespace-nowrap pr-6 text-[11px] tracking-[0.3em] text-smoke">
            ILA 3REFTINI, 3REFTINI
            <span className="text-lime">✦</span>
            WEAR IT ONCE, THEY TALK ABOUT IT SAISON KAMLA
            <span className="text-lime">✦</span>
            DRESS LIKE YOU ALREADY MADE IT
            <span className="text-lime">✦</span>
            MA KAYN LA RESTOCK LA WALOU
            <span className="text-lime">✦</span>
          </span>
        </Marquee>
      </div>

      {/* ───────────────  THE CARGO  ─────────────── */}
      <section className="pt-20 md:pt-28" aria-label="Chapter 1, out of focus">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-8 border-b border-bone/10 pb-8">
            <div>
              <Reveal>
                <p className="label-wide text-lime">Cargo — Chnou kayjina</p>
              </Reveal>

              <SplitLines
                lines={["Wahed l'hoodie.", "Jouj colours."]}
                className="display mt-6 text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.9]"
                lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
              />
            </div>

            <Reveal delay={0.2}>
              <p className="max-w-[34ch] text-sm leading-relaxed text-smoke">
                L&apos;photos hna mghayrin b&apos;chwiya. L&apos;wost ghadi tchoufo nhar 27.
                <span className="mt-1 block text-smoke/60">
                  Les photos sont floues. Exprès.
                </span>
              </p>
            </Reveal>
          </div>
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

        <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
          <SplitLines
            lines={["Kolchi kaylbes.", "Machi kolchi kay3ref ykhtar."]}
            className="display text-[clamp(2rem,7vw,6rem)] leading-[0.9]"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <Reveal delay={0.3}>
            <p className="label-wide mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-bone/10 pt-8 text-smoke">
              <span className="text-lime">27.09.2026 — 00:00</span>
              <span>Clothsomnia — Chapter 1</span>
              <span className="ml-auto">inchaAllah</span>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
