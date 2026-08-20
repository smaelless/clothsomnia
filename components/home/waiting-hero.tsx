"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Countdown } from "@/components/ui/countdown";
import { WaitlistForm } from "@/components/home/waitlist-form";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE WAIT — the clock, and the number.
 *
 * Two things. The line that used to sit under the board as a headline now sits
 * above it as the board's own label, which is where it belonged: it is what the
 * clock is counting toward, not a separate announcement. Everything that was
 * repeating it underneath is gone.
 *
 * The field follows immediately, so the page reads as one movement — how long,
 * then how not to miss it — with nothing between the date and the ask.
 */
export function WaitingHero() {
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden pt-5 pb-14 md:pt-8 md:pb-20"
      aria-label="The wait"
    >
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

          <Countdown
            size="large"
            label={
              /* Overrides the label utility's caps and wide tracking: this is a
                 sentence, and a sentence set at 0.45em is a puzzle. */
              <span className="flex flex-wrap items-baseline justify-center gap-x-2.5 gap-y-1 normal-case tracking-normal">
                <span className="display text-[clamp(1.1rem,2.6vw,1.6rem)] leading-tight text-bone">
                  Pas De Panic.
                </span>
                <span className="text-[clamp(0.8rem,1.7vw,0.95rem)] leading-snug text-silver">
                  — We&apos;re cooking something big f&apos;le lab. Coming very soon.
                </span>
              </span>
            }
          />
        </motion.div>

        {/* ── The number ──
            Straight after the date, deliberately. Nothing should stand between
            reading when it lands and being able to do something about it. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.9 }}
          className="relative mx-auto mt-8 max-w-[640px] md:mt-10"
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
