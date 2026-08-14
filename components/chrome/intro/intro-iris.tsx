"use client";

import { motion } from "framer-motion";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import type { IntroProps } from "./types";

const HOLD = 0.95;

/**
 * IRIS CLOSE — a camera aperture collapsing to a point.
 * The black overlay's clip-path shrinks to nothing, so the page is not revealed
 * by something sliding away but by the darkness itself contracting.
 */
export function IntroIris({ onComplete }: IntroProps) {
  return (
    <div className="fixed inset-0 z-[100]">
      {/* Expanding ring — the aperture edge catching light */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 z-20 aspect-square w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet/50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 0.55, 2.4], opacity: [0, 0.9, 0] }}
        transition={{ duration: HOLD + 1, times: [0, 0.45, 1], ease: EASE_OUT }}
      />

      <motion.div
        className="absolute inset-0 z-10 bg-ink"
        initial={{ clipPath: "circle(150% at 50% 50%)" }}
        animate={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{ duration: 0.95, ease: EASE_IN_OUT, delay: HOLD }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          className="absolute inset-0 grid place-items-center px-6 text-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.25] }}
          transition={{ duration: HOLD + 0.55, times: [0, 0.35, 0.7, 1], ease: EASE_OUT }}
        >
          <div>
            <Wordmark className="text-[clamp(2.5rem,10vw,8rem)]" />
            <p className="label-wide mt-6 text-smoke">Morocco — 00:00</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
