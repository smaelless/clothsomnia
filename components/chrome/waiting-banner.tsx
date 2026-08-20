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
 * Four things moving at once and none of them competing: a fine line of type
 * travelling right, the wordmark under a light that crosses it, the day count
 * travelling left, and a lime thread running along the bottom edge. Layers
 * going different directions at different speeds is what makes a band feel
 * alive rather than decorated.
 *
 * On speed: the first version ran a 563px cycle in 30s — about 19px a second,
 * which is genuinely moving and completely invisible. Nothing here travels
 * slower than 35px a second.
 */
export function WaitingBanner() {
  // Rendered only after mount. Days remaining differ between server and client,
  // so printing them during hydration would mismatch.
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () =>
      setDays(Math.max(Math.ceil((LAUNCH_AT.getTime() - Date.now()) / 86400000), 0));
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
      {/* Top rail — fine type, travelling right */}
      <div className="border-b border-bone/[0.07] py-2.5">
        <Marquee duration={18}>
          <span className="label flex shrink-0 items-center gap-5 whitespace-nowrap pr-5 text-[9px] tracking-[0.34em] text-smoke">
            CHAPTER 1 — DREAMS
            <span aria-hidden className="text-lime">✦</span>
            PAS DE PANIC
            <span aria-hidden className="text-lime">✦</span>
            50 PIÈCES PAR TAILLE
            <span aria-hidden className="text-lime">✦</span>
            CASH F&apos;YEDDEK
            <span aria-hidden className="text-lime">✦</span>
          </span>
        </Marquee>
      </div>

      {/* The name, with a light crossing it */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="relative grid place-items-center py-6 md:py-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-bone/[0.09] to-transparent animate-sweep [animation-duration:4.5s]"
        />
        <Wordmark className="text-[clamp(1.75rem,6vw,3.25rem)]" />
      </motion.div>

      {/* The count, travelling left, at the size it deserves */}
      <div className="border-t border-bone/[0.07] py-3.5 md:py-4">
        <Marquee duration={14} reverse>
          <span className="display flex shrink-0 items-center gap-6 whitespace-nowrap pr-6 text-[clamp(1.1rem,3.4vw,2rem)] leading-none text-bone">
            {line}
            <span aria-hidden className="text-lime">✦</span>
          </span>
        </Marquee>
      </div>

      {/* A thread of light along the bottom edge — the runway rig, still on */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-lime/70 to-transparent animate-sweep"
      />
    </header>
  );
}
