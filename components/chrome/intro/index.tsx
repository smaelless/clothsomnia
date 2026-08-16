"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { INTRO_ENTERED_KEY as ENTERED_KEY } from "@/lib/intro";
import { IntroDoor } from "./intro-door";

/**
 * INTRO
 *
 * One screen: the loading count and the way in, on the same panel. Shown once
 * per session, and only until someone presses Enter.
 *
 * Reduced motion skips it entirely. Insisting on an animated door for a
 * visitor who asked for less motion is the least defensible place to do it, and
 * the music still starts on their first interaction with the site.
 */
export function Intro({ force = false }: { force?: boolean }) {
  const reduced = useReducedMotion();
  // Rendered on the server and on first paint so the page never shows through
  // before the door has decided whether to run.
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  // Stable, so the door's exit timer is not restarted by an unrelated render.
  const hide = useCallback(() => setVisible(false), []);

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
     * In development it runs on every load so it can actually be worked on;
     * gating it to once per session made it look deleted.
     */
    if (process.env.NODE_ENV !== "production") {
      setVisible(true);
      return;
    }

    /*
     * Marked when they press Enter, not when the screen appears. Someone who
     * closed the tab on the door has not been in yet, and should meet it again
     * rather than land inside a site whose music never started.
     */
    let entered = false;
    try {
      entered = window.sessionStorage.getItem(ENTERED_KEY) === "1";
    } catch {
      /* storage blocked — treat as a first visit */
    }
    if (entered) setVisible(false);
  }, [force, reduced]);

  if (!visible) return null;

  return (
    <IntroDoor
      leaving={leaving}
      onEnter={() => {
        setLeaving(true);
        try {
          window.sessionStorage.setItem(ENTERED_KEY, "1");
        } catch {
          /* non-fatal — the worst case is seeing the door twice */
        }
      }}
      onExited={hide}
    />
  );
}
