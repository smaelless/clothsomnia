"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/motion";

/**
 * Each line pulls a different lever: risk reversal (shipping, returns),
 * scarcity (small runs, never restocked), and urgency (ships tomorrow).
 * Kept in the brand's voice — a bar that shouts stops being believed.
 */
const MESSAGES = [
  "Wear what you dream of",
  "If you know, you know",
  "Order tonight → ships tomorrow.",
  "Don't dress to fit in",
  "Your size won't wait",
];

/**
 * A single line that swaps its message on a slow cycle. Deliberately quiet —
 * the bar earns its place by never competing with the hero.
 */
export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 4600);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative z-50 overflow-hidden border-b border-bone/10 bg-ink">
      {/* Light travelling along the bottom rule — the runway rig, still on. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-lime/70 to-transparent animate-sweep"
      />

      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        {/* Left mark — carries the wordmark's flicker so the bar reads as
            part of the same identity rather than a strip bolted on top. */}
        <span className="label-wide hidden shrink-0 items-center gap-2 text-smoke sm:flex">
          <span aria-hidden className="inline-block size-1 rounded-full bg-lime animate-flicker" />
          Clothsomnia
        </span>

        <div className="relative h-9 flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={i}
              initial={reduced ? false : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: -14, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              className="label absolute inset-0 flex items-center justify-center text-silver"
            >
              {MESSAGES[i]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right mark — a slow breathing dot. Different rhythm from the left
            flicker on purpose, so the two ends of the bar never sync up. */}
        <span className="label-wide hidden shrink-0 items-center gap-2 text-lime sm:flex">
          <span aria-hidden className="inline-block size-1 rounded-full bg-lime animate-breathe" />
          Shipping is free
        </span>
      </div>
    </div>
  );
}
