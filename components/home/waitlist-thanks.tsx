"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE THANK YOU.
 *
 * The one moment on this page where somebody has actually done something, so
 * it is the one moment worth spending animation on. A seal draws itself, the
 * queue number counts up to where they landed, and the lines arrive after it.
 *
 * The number is the point. "You're on the list" is a receipt; "you are number
 * 24" is a place in a queue that somebody else is also standing in, and it is
 * the difference between being told a thing and feeling it.
 */
export function WaitlistThanks({
  position,
  already,
  light = false,
}: {
  /** Where they landed. 0 means the count failed — then no number is shown. */
  position: number;
  already: boolean;
  light?: boolean;
}) {
  const reduced = useReducedMotion();
  const shown = useCountUp(position, reduced);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Sparks. Cheap, brief, and gone — eight transforms that never repeat,
          so nothing is left running behind the message afterwards. */}
      {!reduced && <Sparks />}

      <div className="relative flex flex-col items-center gap-6 py-2 text-center sm:flex-row sm:items-start sm:gap-7 sm:text-left">
        <Seal reduced={Boolean(reduced)} light={light} />

        <div className="min-w-0">
          {position > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
              className={cn(
                "display text-[clamp(2.25rem,9vw,3.75rem)] leading-none tabular-nums",
                light ? "text-ink" : "text-bone",
              )}
            >
              <span className={light ? "text-ink/35" : "text-lime"}>#</span>
              {shown}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }}
            className={cn(
              "display mt-3 text-2xl leading-tight md:text-3xl",
              light ? "text-ink" : "text-bone",
            )}
          >
            {already ? "Rak déjà f'liste." : "Rak f'liste. Safi."}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.65 }}
            className={cn(
              "mt-4 max-w-[44ch] text-sm leading-relaxed",
              light ? "text-ink/70" : "text-silver",
            )}
          >
            Ghadi tousslek message f&apos;WhatsApp qbel 27 September, m3a l&apos;code dialek.
            Qbel kolchi.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className={cn("mt-4 text-xs", light ? "text-ink/45" : "text-smoke")}
          >
            Merci. On te prévient avant tout le monde.{" "}
            <span className={light ? "text-ink/70" : "text-silver"}>VIP access only</span>
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Counts up to the position over about a second.
 *
 * Eased, so it decelerates into the final number instead of stopping dead —
 * and it always lands exactly on `target`, because a counter that ends on 23
 * when the answer is 24 is worse than no counter.
 */
function useCountUp(target: number, reduced: boolean | null): number {
  const [n, setN] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced || target <= 0) {
      setN(target);
      return;
    }
    const started = performance.now();
    const DURATION = 1000;
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min((now - started) / DURATION, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // A background tab freezes rAF, so the number would sit at 0 until the tab
    // is looked at. A timer still fires, and simply sets the answer.
    const failsafe = window.setTimeout(() => setN(target), DURATION + 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
    };
  }, [target, reduced]);

  return n;
}

/** A ring that draws itself, then a tick inside it. */
function Seal({ reduced, light }: { reduced: boolean; light: boolean }) {
  return (
    <motion.span
      initial={reduced ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="relative grid size-16 shrink-0 place-items-center"
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 size-full" aria-hidden>
        <motion.circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          strokeWidth="2"
          className={light ? "stroke-ink" : "stroke-lime"}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          /* Starts at twelve o'clock and closes clockwise, like something
             being stamped rather than something loading. */
          style={{ rotate: -90, transformOrigin: "50% 50%" }}
        />
        <motion.path
          d="M20 33 L28 41 L45 24"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={light ? "stroke-ink" : "stroke-lime"}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.55 }}
        />
      </svg>
    </motion.span>
  );
}

/** Eight lime specks thrown outward once, then gone. */
function Sparks() {
  return (
    <span aria-hidden className="pointer-events-none absolute left-8 top-8 z-0">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute block size-1 rounded-full bg-lime"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos(angle) * 70,
              y: Math.sin(angle) * 70,
              scale: [0.6, 1, 0.4],
            }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.35 + i * 0.02 }}
          />
        );
      })}
    </span>
  );
}
