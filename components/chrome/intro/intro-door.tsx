"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Equaliser } from "@/components/chrome/soundtrack";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { SOUNDTRACK, startSoundtrack } from "@/lib/soundtrack";
import { cn } from "@/lib/utils";

/**
 * THE DOOR — the loading screen and the way in, as one screen.
 *
 * These used to be two: a sequence that counted to 100 and lifted away, then a
 * separate panel that faded in asking to be pressed. However carefully the
 * handover was timed it still read as two loading screens in a row, because it
 * was two — two panels, two layouts, one replacing the other.
 *
 * Now there is one panel and one layout. The rig lifts off it, the count runs
 * under the wordmark, and when the count lands the Enter button takes the
 * counter's place. Nothing is swapped out and no second screen arrives: the
 * wordmark never moves from the moment it appears to the moment the site does.
 *
 * The press is also what starts the music, which is the only moment a browser
 * will allow it.
 */

const COUNT = 8;
const DURATION = 1700;

/** How long the panel takes to clear once someone is in. */
export const EXIT_MS = 550;

export function IntroDoor({
  leaving,
  onEnter,
  onExited,
}: {
  leaving: boolean;
  onEnter: () => void;
  onExited: () => void;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);

  const ready = count >= 100;

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
    };
    frame = requestAnimationFrame(tick);

    // The rig clears early, so the count finishes on the open stage rather than
    // behind it. One screen, one continuous moment.
    const lift = window.setTimeout(() => setLifting(true), 420);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(lift);
    };
  }, [reduced]);

  /**
   * rAF is frozen in a background tab, so a visitor who opens the site in a tab
   * they never look at would find the count stuck. A timer still fires when
   * throttled, so the door is always reachable.
   */
  useEffect(() => {
    const id = window.setTimeout(() => {
      setCount(100);
      setLifting(true);
    }, 6000);
    return () => window.clearTimeout(id);
  }, []);

  /* Unmounted on a timer rather than an animation callback: the callback did
     not fire reliably, and the failure left a full-screen panel sitting over
     the shop with no way through. */
  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(onExited, EXIT_MS);
    return () => window.clearTimeout(id);
  }, [leaving, onExited]);

  function enter() {
    if (!ready) return;
    // Synchronous, inside the click's own task — Safari grants sound only to
    // code running there, so this cannot wait for the exit animation.
    startSoundtrack();
    onEnter();
  }

  return (
    <motion.div
      // No entrance fade: this panel is the first thing painted and stays put.
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: EASE_OUT }}
      className={cn("fixed inset-0 z-[95] bg-ink", leaving && "pointer-events-none")}
    >
      {/* The whole panel is the target once it is ready. Someone reaching for
          anything on this screen means the same thing, and a missed tap on a
          door reads as a broken site. */}
      <button
        type="button"
        onClick={enter}
        disabled={!ready}
        aria-label="Enter Clothsomnia"
        className="absolute inset-0 z-20 cursor-pointer disabled:cursor-default"
      >
        <span className="sr-only">Enter</span>
      </button>

      {/* The one block of content. Nothing here is replaced — only the line
          under the rule changes, from the count to the way in. */}
      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6">
        <div className="flex w-full flex-col items-center text-center">
          <Wordmark className="text-[clamp(2.5rem,10vw,8.5rem)]" />

          <motion.p
            className="label-wide mt-7 text-lime"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
          >
            Something worth the wait
          </motion.p>

          <div className="mt-9 h-px w-[min(320px,72vw)] bg-bone/15">
            <motion.div
              className="h-full bg-lime"
              animate={{ width: `${count}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>

          {/* One slot, two states. The counter counts, then steps aside for the
              button in the same place, so the layout never jumps. */}
          <div className="mt-5 grid min-h-[4.5rem] place-items-center">
            {ready ? (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
                className="label inline-flex items-center gap-3 rounded-full bg-bone px-9 py-5 text-ink"
              >
                Enter
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </motion.span>
            ) : (
              <p className="label-wide flex items-center gap-3 text-smoke">
                <span className="display text-base tabular-nums text-bone">
                  {String(count).padStart(3, "0")}
                </span>
                <span>Call time</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* The rig, over everything until it lifts */}
      <div className="absolute inset-0 z-30 flex">
        {Array.from({ length: COUNT }).map((_, i) => {
          // Distance from centre drives the stagger: middle out.
          const fromCentre = Math.abs(i - (COUNT - 1) / 2);
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
            >
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-violet/40 to-transparent"
              />
            </motion.div>
          );
        })}
      </div>

      {/* The track, named in the corner throughout */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7, ease: EASE_OUT }}
        className="pointer-events-none absolute bottom-6 left-6 z-10 flex items-center gap-3 md:bottom-8 md:left-8"
      >
        <Equaliser playing={false} className="text-lime" />
        <span className="leading-tight text-left">
          <span className="label block text-[9px] tracking-[0.3em] text-smoke">Soundtrack</span>
          <span className="label mt-1.5 block text-[10px] tracking-[0.14em] text-bone">
            {SOUNDTRACK.title}
          </span>
          <span className="label mt-1 block text-[9px] tracking-[0.14em] text-smoke">
            {SOUNDTRACK.artist}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}
