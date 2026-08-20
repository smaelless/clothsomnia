"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_OUT } from "@/lib/motion";
import { LAUNCH_AT } from "@/lib/pricing";

/**
 * THE HEADER — the waiting page has nowhere to navigate to, so this stands
 * where the nav and the announcement bar used to.
 *
 * Two rows. The upper one travels, the lower one does not: the name on the
 * left, the day count on the right, both still, so the one fact anybody came
 * for can be read at a glance instead of waited for.
 *
 * Items in the moving rail are divided by hairlines rather than by a glyph.
 * A rule is a piece of the layout; a star is a decoration that has to be
 * chosen, and it was the wrong choice.
 */

/** A hairline between rail items. */
function Divider() {
  return <span aria-hidden className="inline-block h-3 w-px shrink-0 bg-bone/20" />;
}

export function WaitingBanner() {
  // Rendered only after mount. Days remaining differ between server and client,
  // so printing them during hydration would mismatch.
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () =>
      // Floor, not ceil. The board sits directly underneath reading "37 days
      // 18 hrs"; rounding up here put a 38 above it and made the page argue
      // with itself. Floor also means the final day reads "Today", which is
      // both true and the better line to be showing that morning.
      setDays(Math.max(Math.floor((LAUNCH_AT.getTime() - Date.now()) / 86400000), 0));
    tick();
    // Hourly: enough to roll over near midnight without a timer that never rests.
    const id = window.setInterval(tick, 3600000);
    return () => window.clearInterval(id);
  }, []);

  const line =
    days === null
      ? "Clothsomnia"
      : days === 0
        ? "Today — Clothsomnia, inchaAllah"
        : `${days} ${days === 1 ? "day" : "days"} to the Clothsomnia, inchaAllah`;

  return (
    <header className="relative z-50 overflow-hidden border-b border-bone/10 bg-ink">
      {/* Upper rail — fine type, travelling */}
      <div className="border-b border-bone/[0.07] py-2.5">
        <Marquee duration={18}>
          <span className="label flex shrink-0 items-center gap-5 whitespace-nowrap pr-5 text-[9px] tracking-[0.34em] text-smoke">
            CHAPTER 1 — DREAMS
            <Divider />
            PAS DE PANIC
            <Divider />
            50 PIÈCES PAR TAILLE
            <Divider />
            CASH F&apos;YEDDEK
            <Divider />
          </span>
        </Marquee>
      </div>

      {/* Lower row — still. Name left, count right. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="relative mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-5 md:px-8 md:py-7"
      >
        {/* The one moving thing left on this row: a light crossing the name. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-bone/[0.08] to-transparent animate-sweep [animation-duration:4.5s]"
        />

        <Wordmark className="relative text-[clamp(1.5rem,5vw,2.75rem)]" />

        <p className="display relative ml-auto text-right text-[clamp(0.95rem,2.6vw,1.6rem)] leading-tight text-bone">
          {line}
        </p>
      </motion.div>

      {/* A thread of light along the bottom edge — the runway rig, still on */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-lime/70 to-transparent animate-sweep"
      />
    </header>
  );
}
