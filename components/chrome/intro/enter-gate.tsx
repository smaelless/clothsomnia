"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Equaliser } from "@/components/chrome/soundtrack";
import { Wordmark } from "@/components/ui/wordmark";
import { SOUNDTRACK, startSoundtrack } from "@/lib/soundtrack";
import { cn } from "@/lib/utils";

/**
 * THE DOOR
 *
 * The loading sequence ends here rather than dissolving straight into the site,
 * and the visitor comes in by choice.
 *
 * It exists because of the one thing no site can do: no browser will let a page
 * make a sound before the visitor has touched it. Rather than hide that
 * behind a silent wait for someone to happen to scroll, the gesture becomes
 * the way in — one press opens the site and starts the music in the same
 * motion, and nothing about it reads as a technical concession.
 */
/** How long the door takes to fade out of the way. */
export const EXIT_MS = 550;

export function EnterGate({
  leaving,
  onEnter,
  onExited,
}: {
  leaving: boolean;
  onEnter: () => void;
  onExited: () => void;
}) {
  /*
   * Unmounted on a timer, not on the animation's completion callback.
   *
   * The callback did not fire reliably, and the failure mode was the worst
   * available: a full-screen panel left sitting over the site at full opacity,
   * with the shop underneath it and no way to reach it. A timer cannot fail
   * that way — it fires whether or not the animation ever ran.
   */
  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(onExited, EXIT_MS);
    return () => window.clearTimeout(id);
  }, [leaving, onExited]);

  function enter() {
    // Synchronous, inside the click's own task. Safari grants sound only to
    // code running there, so this cannot be deferred behind the exit animation.
    startSoundtrack();
    onEnter();
  }

  return (
    <motion.div
      /*
       * initial={false} — no fade in. This sits *underneath* the loading
       * sequence and is already fully painted when the slats lift, so what they
       * reveal is the door. Fading it in afterwards showed the site for a beat
       * in between, which read as two loading screens back to back.
       */
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-0 z-[95] grid place-items-center bg-ink px-6",
        leaving && "pointer-events-none",
      )}
    >
      {/* The whole panel is the target. Someone reaching for anything on this
          screen means the same thing, and a missed tap on a door is a visitor
          who thinks the site is broken. */}
      <button
        type="button"
        onClick={enter}
        className="group absolute inset-0 cursor-pointer"
        aria-label="Enter Clothsomnia"
      >
        <span className="sr-only">Enter</span>
      </button>

      <div className="pointer-events-none relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Wordmark className="text-[clamp(2.25rem,9vw,5.5rem)]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="label-wide mt-6 text-smoke"
        >
          Chapter 1 — Dreams
        </motion.p>

        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          /* Looks and behaves like the button it is; the real hit area is the
             panel behind it, which is why this is a span. */
          className="label mt-12 inline-flex items-center gap-3 rounded-full bg-bone px-9 py-5 text-ink transition-transform duration-500 group-hover:scale-[1.03]"
        >
          Enter
          <span aria-hidden className="text-base leading-none">
            →
          </span>
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 flex items-center gap-3 text-smoke"
        >
          <Equaliser playing={false} className="text-lime" />
          <span className="label text-[9px] tracking-[0.16em]">
            Sound on — {SOUNDTRACK.title} by {SOUNDTRACK.artist}
          </span>
        </motion.span>
      </div>
    </motion.div>
  );
}
