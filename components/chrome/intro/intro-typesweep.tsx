"use client";

import { motion } from "framer-motion";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import type { IntroProps } from "./types";

const HOLD = 1.35;

/**
 * TYPE SPLIT — a scan line inverts the wordmark, then the screen tears apart.
 *
 * Each half carries its own copy of the wordmark in a double-width box anchored
 * to the outer edge, so the two halves read as one continuous word until they
 * separate.
 */
export function IntroTypesweep({ onComplete }: IntroProps) {
  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden">
      {/* Scan line — inverts whatever it crosses */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 z-30 h-[14vh] mix-blend-difference"
        style={{ background: "linear-gradient(to bottom, transparent, #C6FF3D, transparent)" }}
        initial={{ y: "-20vh" }}
        animate={{ y: ["-20vh", "100vh"] }}
        transition={{ duration: 1.1, ease: EASE_IN_OUT, delay: 0.15 }}
      />

      <motion.div
        className="relative h-full w-1/2 overflow-hidden bg-ink"
        initial={{ x: 0 }}
        animate={{ x: "-101%" }}
        transition={{ duration: 0.85, ease: EASE_IN_OUT, delay: HOLD }}
      >
        <div className="absolute left-0 top-0 grid h-full w-[200%] place-items-center">
          <Wordmark className="whitespace-nowrap text-[clamp(2.5rem,10vw,8rem)]" />
        </div>
        <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-violet/40" />
      </motion.div>

      <motion.div
        className="relative h-full w-1/2 overflow-hidden bg-ink"
        initial={{ x: 0 }}
        animate={{ x: "101%" }}
        transition={{ duration: 0.85, ease: EASE_IN_OUT, delay: HOLD }}
        onAnimationComplete={onComplete}
      >
        <div className="absolute right-0 top-0 grid h-full w-[200%] place-items-center">
          <Wordmark className="whitespace-nowrap text-[clamp(2.5rem,10vw,8rem)]" />
        </div>
      </motion.div>

      {/* Sub-label rides the seam and leaves before the tear */}
      <motion.p
        className="label-wide absolute inset-x-0 top-[calc(50%+5rem)] z-20 text-center text-smoke"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: HOLD, times: [0, 0.55, 1], ease: EASE_OUT }}
      >
        Made for the hours that never end
      </motion.p>
    </div>
  );
}
