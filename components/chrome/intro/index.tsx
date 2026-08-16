"use client";

import { useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Equaliser, useSoundtrackPlaying } from "@/components/chrome/soundtrack";
import { SOUNDTRACK } from "@/lib/soundtrack";
import { INTRO_ENTERED_KEY as ENTERED_KEY, INTRO_VARIANT, type IntroVariant } from "@/lib/intro";
import { EnterGate } from "./enter-gate";
import type { IntroProps } from "./types";
import { IntroBlink } from "./intro-blink";
import { IntroIris } from "./intro-iris";
import { IntroSlats } from "./intro-slats";
import { IntroTypesweep } from "./intro-typesweep";

const REGISTRY: Record<IntroVariant, ComponentType<IntroProps>> = {
  slats: IntroSlats,
  blink: IntroBlink,
  iris: IntroIris,
  typesweep: IntroTypesweep,
};

/**
 * INTRO
 *
 * Picks the configured opening sequence, shows it once per session, and gets
 * out of the way. `force` bypasses the session gate so /intro-lab can replay
 * any variant on demand.
 *
 * Reduced motion skips the sequence entirely — an intro is the least
 * defensible place to insist on animation.
 */
export function Intro({
  variant = INTRO_VARIANT,
  force = false,
}: {
  variant?: IntroVariant;
  force?: boolean;
}) {
  const reduced = useReducedMotion();
  // Render the cover on the server and on first paint so the page never flashes
  // through before the sequence has decided whether to run.
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"sequence" | "gate">("sequence");

  useEffect(() => {
    if (force) {
      setVisible(true);
      return;
    }
    if (reduced) {
      setVisible(false);
      return;
    }

    /**
     * In development the intro plays on every load, so it can actually be
     * worked on — gating it to once per session made it look deleted.
     * In production it still plays only once per session.
     */
    if (process.env.NODE_ENV !== "production") {
      setVisible(true);
      return;
    }

    /*
     * Marked when they press Enter, not when the sequence starts. Someone who
     * closed the tab on the door has not been in yet, and should meet it again
     * rather than land inside a silent site.
     */
    let entered = false;
    try {
      entered = window.sessionStorage.getItem(ENTERED_KEY) === "1";
    } catch {
      /* storage blocked — treat as a first visit */
    }
    if (entered) setVisible(false);
  }, [force, reduced]);

  /**
   * Failsafe. Every sequence ends by calling onComplete from an animation
   * callback — but rAF is frozen in a background tab, so a visitor who opens
   * the site in a tab they never focus could otherwise sit behind a black
   * screen. A timer (which still fires when throttled) guarantees the door
   * appears even if the animation never runs.
   */
  useEffect(() => {
    if (!visible || phase !== "sequence") return;
    const id = window.setTimeout(() => setPhase("gate"), 6000);
    return () => window.clearTimeout(id);
  }, [visible, phase]);

  if (!visible) return null;

  const Sequence = REGISTRY[variant];

  return (
    <AnimatePresence>
      {phase === "gate" ? (
        <EnterGate
          key="gate"
          onEnter={() => {
            setVisible(false);
            try {
              window.sessionStorage.setItem(ENTERED_KEY, "1");
            } catch {
              /* non-fatal — the worst case is seeing the door twice */
            }
          }}
        />
      ) : (
        <div key="sequence" aria-hidden role="presentation">
          {/* The sequence no longer reveals the site directly. It hands over to
              the door, so the visit begins on a press rather than on a timer. */}
          <Sequence onComplete={() => setPhase("gate")} />
          <NowPlaying />
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * The track, named in the corner of the loading screen.
 *
 * Above the sequence rather than inside it, so all four variants get it and
 * none of them has to know it exists. It fades in a beat late: arriving with
 * the curtain would make it part of the furniture, arriving just after reads
 * as the music starting.
 */
function NowPlaying() {
  const playing = useSoundtrackPlaying();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-6 z-[101] flex items-center gap-3 md:bottom-8 md:left-8"
    >
      <Equaliser playing={playing} className="text-lime" />
      <span className="leading-tight">
        <span className="label block text-[9px] tracking-[0.3em] text-smoke">Now playing</span>
        <span className="label mt-1.5 block text-[10px] tracking-[0.14em] text-bone">
          {SOUNDTRACK.title}
        </span>
        <span className="label mt-1 block text-[9px] tracking-[0.14em] text-smoke">
          {SOUNDTRACK.artist}
        </span>
      </span>
    </motion.div>
  );
}
