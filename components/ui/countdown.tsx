"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Chapter 1 goes live at midnight, 27 September. */
export const LAUNCH_AT = new Date("2026-09-27T00:00:00+01:00");

/** The countdown fills up over the final stretch rather than from nothing. */
const WINDOW_DAYS = 60;

type Left = { days: number; hours: number; minutes: number; seconds: number };

function remaining(to: Date): Left | null {
  const ms = to.getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/**
 * COUNTDOWN — a split-flap board.
 *
 * Each digit is its own cell, and only the digits that actually change animate:
 * the seconds flip every tick, the days sit still for a day at a time. That is
 * both how a departure board behaves and the cheapest way to do it — a whole
 * re-rendered row would animate four digits a second for no reason.
 *
 * Renders nothing until mounted. The remaining time differs between server and
 * client, so rendering it during hydration would mismatch.
 */
export function Countdown({
  className,
  label = "Chapter 1 opens in",
  compact = false,
}: {
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const [left, setLeft] = useState<Left | null>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setReady(true);
    setLeft(remaining(LAUNCH_AT));
    const id = window.setInterval(() => setLeft(remaining(LAUNCH_AT)), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!ready) return null;

  // Once it lands, the board says so instead of sitting at zero.
  if (!left) {
    return (
      <div className={cn("text-center", className)}>
        <p className="label-wide text-lime">The doors are open</p>
        <p className="display mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-none">Chapter 1 is live</p>
      </div>
    );
  }

  const cells: [number, string][] = [
    [left.days, "days"],
    [left.hours, "hrs"],
    [left.minutes, "min"],
    [left.seconds, "sec"],
  ];

  const total = WINDOW_DAYS * 86400000;
  const elapsed = Math.min(Math.max(1 - (LAUNCH_AT.getTime() - Date.now()) / total, 0), 1);

  return (
    <div className={cn(compact ? "" : "text-center", className)}>
      <p className="label-wide mb-5 flex items-center gap-3 text-lime">
        <span aria-hidden className="inline-block size-1.5 rounded-full bg-lime animate-flicker" />
        {label}
      </p>

      <div
        className={cn("flex items-end gap-3 sm:gap-5", !compact && "justify-center")}
        // The row updates every second; announcing that would be hostile.
        aria-live="off"
      >
        {cells.map(([value, unit], i) => (
          <div key={unit} className="flex items-end gap-3 sm:gap-5">
            <div className="text-center">
              <div className="flex gap-1">
                {String(value)
                  .padStart(2, "0")
                  .split("")
                  .map((digit, d) => (
                    <Flap
                      key={`${unit}-${d}`}
                      digit={digit}
                      reduced={Boolean(reduced)}
                      compact={compact}
                    />
                  ))}
              </div>
              <span className="label-wide mt-3 block text-smoke">{unit}</span>
            </div>

            {i < cells.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "pb-8 font-light text-smoke/40",
                  compact ? "text-lg" : "text-2xl",
                )}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>

      {!compact && (
        <>
          <div className="mx-auto mt-9 h-px w-full max-w-[420px] bg-bone/12">
            <div
              className="h-full bg-gradient-to-r from-pine via-lime to-lime transition-[width] duration-1000 ease-linear"
              style={{ width: `${elapsed * 100}%` }}
            />
          </div>

          <p className="label-wide mt-6 text-smoke">
            27 September — <span className="text-lime">inchaAllah</span>
          </p>
        </>
      )}
    </div>
  );
}

/** One digit cell. Flips only when its own value changes. */
function Flap({
  digit,
  reduced,
  compact,
}: {
  digit: string;
  reduced: boolean;
  compact: boolean;
}) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-md border border-bone/12 bg-charcoal/70 tabular-nums",
        compact
          ? "h-9 w-6 text-xl leading-9"
          : "h-[clamp(3rem,9vw,5.5rem)] w-[clamp(2rem,6vw,3.75rem)] text-[clamp(1.75rem,5.5vw,3.5rem)] leading-[clamp(3rem,9vw,5.5rem)]",
      )}
    >
      {/* The hinge line across the middle of the flap */}
      <span aria-hidden className="absolute inset-x-0 top-1/2 z-10 h-px bg-ink/70" />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={reduced ? { opacity: 0 } : { y: "-100%" }}
          animate={reduced ? { opacity: 1 } : { y: "0%" }}
          exit={reduced ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: reduced ? 0.15 : 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="display absolute inset-0 block text-center text-bone"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
