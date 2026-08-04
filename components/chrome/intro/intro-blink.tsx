"use client";

import { motion } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";
import { Wordmark } from "@/components/ui/wordmark";
import type { IntroProps } from "./types";

const DURATION = 2.6;
/** open → blink shut → open for good */
const TIMES = [0, 0.34, 0.52, 0.62, 1];

/**
 * THE BLINK — the brand name, taken literally.
 * Two lids part, snap shut once, then open and stay open.
 */
export function IntroBlink({ onComplete }: IntroProps) {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Copy lives on the closed lid and is gone by the second blink */}
      <motion.div
        className="absolute inset-0 z-20 grid place-items-center px-6 text-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 0, 0, 0, 0] }}
        transition={{ duration: DURATION, times: TIMES }}
      >
        <div>
          <Wordmark className="text-[clamp(2.5rem,10vw,8rem)]" />
          <p className="label-wide mt-6 text-lime">Still awake?</p>
        </div>
      </motion.div>

      {/* Upper lid */}
      <motion.div
        className="absolute inset-x-0 top-0 z-10 h-1/2 bg-ink"
        initial={{ y: "0%" }}
        animate={{ y: ["0%", "-100%", "-100%", "0%", "-100%"] }}
        transition={{ duration: DURATION, times: TIMES, ease: EASE_IN_OUT }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime/70 to-transparent"
        />
      </motion.div>

      {/* Lower lid */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-ink"
        initial={{ y: "0%" }}
        animate={{ y: ["0%", "100%", "100%", "0%", "100%"] }}
        transition={{ duration: DURATION, times: TIMES, ease: EASE_IN_OUT }}
        onAnimationComplete={onComplete}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/70 to-transparent"
        />
      </motion.div>
    </div>
  );
}
