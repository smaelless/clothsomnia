"use client";

import { useReducedMotion } from "framer-motion";

/**
 * TYPE FIELD — the moving wall of type behind the entire site.
 *
 * Nine rows of brand copy drifting in alternating directions at different
 * speeds, sitting between the page background and the content. It never
 * pauses: not on hover, not on touch, not between sections. Rows are
 * pointer-events-none and aria-hidden, so they are pure atmosphere and are
 * invisible to screen readers and to the cursor.
 *
 * Animation is a single transform per row, which the compositor handles on
 * its own thread — nine rows cost effectively nothing per frame.
 */

type Row = {
  text: string;
  /** seconds for one full pass */
  speed: number;
  reverse?: boolean;
  size: string;
  opacity: number;
  italic?: boolean;
};

const ROWS: Row[] = [
  { text: "LBESS QEDEK IWATIK", speed: 64, size: "clamp(3rem,9vw,8rem)", opacity: 0.10 },
  { text: "Clothsomnia", speed: 48, reverse: true, size: "clamp(2.5rem,7vw,6rem)", opacity: 0.095, italic: true },
  { text: "DREAM", speed: 78, size: "clamp(3.5rem,11vw,10rem)", opacity: 0.09 },
  { text: "Dress the static", speed: 42, reverse: true, size: "clamp(2rem,6vw,5rem)", opacity: 0.105, italic: true },
  { text: "AFTER DARK EVERYTHING SHARPENS", speed: 70, size: "clamp(3rem,9vw,8rem)", opacity: 0.085 },
  { text: "The night changes shape", speed: 55, reverse: true, size: "clamp(2.5rem,7.5vw,6.5rem)", opacity: 0.10, italic: true },
  { text: "EXCLUSIVE", speed: 88, size: "clamp(3.5rem,10vw,9rem)", opacity: 0.08 },
  { text: "Sleep never dressed this well", speed: 46, reverse: true, size: "clamp(2rem,6.5vw,5.5rem)", opacity: 0.095, italic: true },
  { text: "CLOTHSOMNIA", speed: 74, size: "clamp(3rem,9.5vw,8.5rem)", opacity: 0.085 },
];

export function TypeField() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      <div className="flex h-full w-full flex-col justify-between py-4">
        {ROWS.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div
              className={reduced ? "flex w-max" : "marquee-track"}
              style={
                reduced
                  ? undefined
                  : {
                      ["--marquee-duration" as string]: `${row.speed}s`,
                      animationDirection: row.reverse ? "reverse" : "normal",
                    }
              }
            >
              {/* Duplicated so the -50% keyframe loops seamlessly */}
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  className="display whitespace-nowrap pr-[0.4em] leading-none text-bone"
                  style={{
                    fontSize: row.size,
                    opacity: row.opacity,
                    fontStyle: row.italic ? "italic" : "normal",
                    fontWeight: row.italic ? 300 : 500,
                  }}
                >
                  {`${row.text} — ${row.text} — `}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/*
        Knock-back scrim. The rows are intentionally loud, but at this letter
        size 5% white still competes with body copy. This is the single knob
        for the whole effect: lower the alpha to make the type field louder,
        raise it to push the type further back.
      */}
      <div className="absolute inset-0 bg-ink/12" />
    </div>
  );
}
