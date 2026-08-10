"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useReducedMotion } from "framer-motion";
import { INTRO_SESSION_KEY, INTRO_VARIANT, type IntroVariant } from "@/lib/intro";
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

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {
      /* storage blocked — treat as a first visit */
    }
    if (seen) {
      setVisible(false);
      return;
    }
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* non-fatal */
    }
  }, [force, reduced]);

  /**
   * Failsafe. Every sequence ends by calling onComplete from an animation
   * callback — but rAF is frozen in a background tab, so a visitor who opens
   * the site in a tab they never focus could otherwise sit behind a black
   * screen. A timer (which still fires when throttled) guarantees the reveal.
   */
  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(id);
  }, [visible]);

  if (!visible) return null;

  const Sequence = REGISTRY[variant];

  return (
    <div aria-hidden role="presentation">
      <Sequence onComplete={() => setVisible(false)} />
    </div>
  );
}
