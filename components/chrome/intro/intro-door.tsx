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

/**
 * How long the curtain takes to clear once someone is in: the column travel
 * plus the stagger on the outermost pair, plus a frame's grace.
 */
export const EXIT_MS = 1250;

/**
 * Eight columns that lift off the stage, middle out.
 *
 * Used twice on this screen: once as the rig that opens over the wordmark, and
 * once as the black the whole door is painted on — which is what lifts when
 * somebody presses Enter. Reusing it means leaving looks like arriving, in
 * reverse, instead of a fade that nobody registers as an animation at all.
 */
function Rig({
  lifted,
  reduced,
  className,
}: {
  lifted: boolean;
  reduced: boolean;
  className?: string;
}) {
  return (
    <div className={cn("absolute inset-0 flex", className)}>
      {Array.from({ length: COUNT }).map((_, i) => {
        // Distance from centre drives the stagger: middle out.
        const fromCentre = Math.abs(i - (COUNT - 1) / 2);
        return (
          <motion.div
            key={i}
            className="relative h-full flex-1 bg-ink"
            initial={{ y: 0 }}
            animate={lifted ? { y: "-101%" } : { y: 0 }}
            transition={{
              duration: 0.95,
              ease: EASE_IN_OUT,
              delay: lifted && !reduced ? fromCentre * 0.07 : 0,
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
  );
}

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

    // Late enough that the name has been read before anything moves. The rig
    // lifting is the second beat, not the first.
    const lift = window.setTimeout(() => setLifting(true), 900);

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
    <div
      /*
       * Transparent. The black is the backdrop rig below, so that pressing
       * Enter lifts the door away column by column and the shop is uncovered
       * rather than faded through. A panel with its own background could only
       * ever dissolve, which is what read as no transition at all.
       */
      className={cn("fixed inset-0 z-[95]", leaving && "pointer-events-none")}
    >
      {/* The door itself — this is what leaves */}
      <Rig lifted={leaving} reduced={Boolean(reduced)} className="z-0" />
      {/* The whole panel is the target once it is ready. Someone reaching for
          anything on this screen means the same thing, and a missed tap on a
          door reads as a broken site. */}
      {/*
        Never disabled. It was ignored until the count reached 100, which meant
        a press during the opening did nothing at all — and a door that does
        nothing when you push it is a broken site, not a patient one. Pressing
        early simply lets you in early.
      */}
      <button
        type="button"
        onClick={enter}
        aria-label="Enter Clothsomnia"
        className="absolute inset-0 z-50 cursor-pointer"
      >
        <span className="sr-only">Enter</span>
      </button>

      {/* Above the rig, so the name is legible from the first frame and the
          columns move behind it rather than uncovering it. On the way out it
          goes first and quickly, so the curtain lifts on an empty stage. */}
      <motion.div
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-0 z-40 grid place-items-center px-6"
      >
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

          {/* The working half of the screen arrives after the rig has moved,
              so the opening beat is the name alone. */}
          <motion.div
            className="flex flex-col items-center"
            animate={{ opacity: lifting ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div className="mt-9 h-px w-[min(320px,72vw)] bg-bone/15">
              <motion.div
                className="h-full bg-lime"
                animate={{ width: `${count}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>

            {/* One slot, two states. The counter counts, then steps aside for
                the button in the same place, so the layout never jumps. */}
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
          </motion.div>
        </div>
      </motion.div>

      {/* The opening rig, over the working half until it lifts */}
      <Rig lifted={lifting} reduced={Boolean(reduced)} className="z-30" />

      {/* The track, named in the corner throughout — and away with the rest */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -16 : 0 }}
        transition={
          leaving
            ? { duration: 0.3, ease: EASE_OUT }
            : { delay: 1.1, duration: 0.7, ease: EASE_OUT }
        }
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
    </div>
  );
}
