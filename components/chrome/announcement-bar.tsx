"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/motion";

const MESSAGES = [
  "Tonight's drop is live — 00:00 CET",
  "Enter the after-hours collection",
  "Complimentary shipping over €150",
  "Midnight pieces available now",
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
    <div className="relative z-50 border-b border-bone/10 bg-ink">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
        <span className="label-wide hidden shrink-0 text-smoke sm:block">Est. 00:00</span>

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

        <span className="label-wide hidden shrink-0 text-lime sm:block">Free returns</span>
      </div>
    </div>
  );
}
