"use client";

import { motion } from "framer-motion";
import { Equaliser } from "@/components/chrome/soundtrack";
import { Wordmark } from "@/components/ui/wordmark";
import { SOUNDTRACK, startSoundtrack } from "@/lib/soundtrack";

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
export function EnterGate({ onEnter }: { onEnter: () => void }) {
  function enter() {
    // Synchronous, inside the click's own task. Safari grants sound only to
    // code running there, so this cannot be deferred behind the exit animation.
    startSoundtrack();
    onEnter();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[102] grid place-items-center bg-ink px-6"
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
