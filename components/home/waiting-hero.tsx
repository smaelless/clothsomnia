"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Countdown } from "@/components/ui/countdown";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE WAIT — the clock, the line, and the number.
 *
 * Three things down the middle and nothing else. Everything that used to sit
 * around them — manifests, rings, panels, tickers — was scenery competing with
 * the only two facts that matter: when it lands, and how not to miss it.
 *
 * The motion is in how it arrives rather than in how much of it there is. The
 * board drops in, the headline builds word by word out of a mask, the line
 * follows, and the field is last so it is the thing left moving when everything
 * else has settled.
 */
export function WaitingHero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-14 pb-24 md:pt-20 md:pb-32" aria-label="The wait">
      {/* Atmosphere. Two lights, drifting, and nothing else behind the clock. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bloom left-1/2 top-[38%] size-[42rem] -translate-x-1/2 -translate-y-1/2 bg-pine/25 animate-drift" />
        <div className="bloom right-[-14%] top-[10%] size-[24rem] bg-wine/20 animate-drift [animation-delay:-9s]" />
      </div>

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-8">
        {/* ── The clock ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.1 }}
          className="relative"
        >
          {/* A light crossing the face of the board */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-bone/[0.07] to-transparent animate-sweep [animation-duration:5s]"
          />
          <Countdown size="large" label="L'drop kayji f" />
        </motion.div>

        {/* ── The line ── */}
        <div className="mt-20 text-center md:mt-24">
          <Words
            text="Pas De Panic"
            reduced={Boolean(reduced)}
            className="display justify-center text-[clamp(2.5rem,9vw,6.5rem)] leading-[0.9] tracking-[-0.02em]"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.05 }}
            className="mx-auto mt-8 max-w-[44ch] text-base leading-relaxed text-silver md:text-lg"
          >
            We&apos;re cooking something big f&apos;le lab.
            <span className="block text-smoke">Coming very soon.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.3 }}
            className="mx-auto mt-6 max-w-[48ch] text-sm leading-relaxed text-smoke"
          >
            Khamsin qet3a f&apos;kol taille, f&apos;kol loun. Ma kayn la restock la walou.
            <span className="mt-1 block text-smoke/60">
              50 pièces par taille. Une fois parties, c&apos;est fini.
            </span>
          </motion.p>
        </div>

        {/* ── The number ──
            Last to arrive, and framed, because it is the only thing on the page
            that asks for anything. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 1.4 }}
          className="relative mx-auto mt-16 max-w-[640px] md:mt-20"
        >
          {/* A slow lime breath around the frame, so the eye comes back to it */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -inset-px rounded-[calc(1.5rem+1px)] bg-gradient-to-r from-lime/0 via-lime/30 to-lime/0",
              !reduced && "animate-breathe",
            )}
          />

          <div className="relative rounded-3xl border border-bone/12 bg-charcoal/70 p-6 md:p-8">
            <p className="label-wide mb-6 flex items-center gap-3 text-lime">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full bg-lime animate-flicker"
              />
              Khod l&apos;code qbel kolchi
            </p>

            <WaitlistForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Word by word, out of a mask. Words rather than letters: at this size a letter
 * stagger turns a three-word headline into an eleven-beat wait.
 */
function Words({
  text,
  reduced,
  className,
}: {
  text: string;
  reduced: boolean;
  className?: string;
}) {
  return (
    <h1 className={cn("flex flex-wrap gap-x-[0.25em]", className)} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={word} aria-hidden className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: "108%", rotate: 3 }}
            animate={reduced ? { opacity: 1 } : { y: "0%", rotate: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.55 + i * 0.12 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
