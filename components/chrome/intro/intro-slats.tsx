"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import type { IntroProps } from "./types";

const COUNT = 8;
const DURATION = 1700;

/**
 * RUNWAY SLATS — the selected opening sequence.
 *
 * A call-time counter runs 000 → 100 under the wordmark, then eight columns
 * lift off the stage. Centre columns leave first and the edges last, so it
 * reads as a rig parting rather than a flat wipe.
 */
export function IntroSlats({ onComplete }: IntroProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    if (reduced) {
      setCount(100);
      setLifting(true);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      // Eased so the count hesitates at the end, like a real cue.
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setLifting(true);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Call sheet — leaves just before the rig does */}
      <motion.div
        className="absolute inset-0 z-10 grid place-items-center px-6"
        animate={lifting ? { opacity: 0, y: -18 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div className="w-full max-w-md text-center">
          <Wordmark className="text-[clamp(2.75rem,11vw,9rem)]" />

          <div className="mx-auto mt-9 h-px w-full max-w-[320px] bg-bone/15">
            <div
              className="h-full bg-lime"
              style={{ width: `${count}%` }}
            />
          </div>

          <p className="label-wide mt-5 text-smoke">
            <span className="display text-base tabular-nums text-bone">
              {String(count).padStart(3, "0")}
            </span>
            <span className="ml-3">Call time</span>
          </p>
        </div>
      </motion.div>

      {/* The rig */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COUNT }).map((_, i) => {
          // Distance from centre drives the stagger: middle out.
          const fromCentre = Math.abs(i - (COUNT - 1) / 2);
          const isEdge = i === 0;
          return (
            <motion.div
              key={i}
              className="relative h-full flex-1 bg-ink"
              initial={{ y: 0 }}
              animate={lifting ? { y: "-101%" } : { y: 0 }}
              transition={{
                duration: 0.95,
                ease: EASE_IN_OUT,
                delay: lifting && !reduced ? fromCentre * 0.07 : 0,
              }}
              // The outermost column settles last, so it owns completion.
              onAnimationComplete={isEdge && lifting ? onComplete : undefined}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-violet/40 to-transparent"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
