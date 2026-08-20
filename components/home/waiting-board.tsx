"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Countdown } from "@/components/ui/countdown";
import { EASE_OUT } from "@/lib/motion";
import { LAUNCH_AT } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * THE BOARD — a departure hall, not a landing page.
 *
 * A drop is a departure, and the countdown was already a split-flap board, so
 * the whole page is built as the thing that board belongs to: a status line, a
 * departure time, a manifest of what is on the flight. Nothing is centred.
 * Everything hangs off one left edge and reads top to bottom like a terminal
 * display, which is what makes it look like information rather than marketing.
 *
 * The day count sits behind it all as an outlined numeral three feet tall. It
 * is the only thing on the page that changes on its own, so it is the only
 * thing given that much room.
 */

/** What is on the flight. Read as data, so it is set out as data. */
const MANIFEST: { k: string; v: string; note?: string }[] = [
  { k: "Departure", v: "27.09.2026 — 00:00", note: "Heure marocaine" },
  { k: "Chapter", v: "01 — Dreams" },
  { k: "Cargo", v: "One hoodie, jouj colours", note: "Pine / Wine" },
  { k: "Load", v: "300 pieces", note: "50 par taille, par couleur" },
  { k: "Return", v: "Ma kayn — nothing restocked" },
  { k: "Payment", v: "Cash f'yeddek", note: "Livraison free, partout f'Maghrib" },
];

export function WaitingBoard() {
  const reduced = useReducedMotion();
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () =>
      setDays(Math.max(Math.ceil((LAUNCH_AT.getTime() - Date.now()) / 86400000), 0));
    tick();
    const id = window.setInterval(tick, 3600000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden" aria-label="Departure board">
      {/*
        The day count, outlined, enormous, and behind everything. Drawn as a
        stroke rather than a fill so it frames the type instead of fighting it —
        a solid numeral this size would swallow the page.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[6vw] top-[6%] z-0 select-none leading-none"
      >
        <motion.span
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
          className="display block text-[clamp(11rem,34vw,30rem)] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(237,234,228,0.10)" }}
        >
          {days ?? ""}
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pt-10 pb-20 md:px-8 md:pt-16 md:pb-28">
        {/* ── Status line ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-bone/10 pb-5"
        >
          <span className="label-wide flex items-center gap-3 text-lime">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-lime animate-flicker" />
            Status
          </span>
          <span className="label text-bone">Cooking f&apos;le lab</span>
          <span className="label-wide ml-auto text-smoke">
            {days === null ? "—" : `T‑minus ${days}`}
          </span>
        </motion.div>

        {/* ── The headline, hanging off the left edge ── */}
        <div className="mt-12 md:mt-16">
          <Stagger
            text="PAS DE PANIC"
            reduced={Boolean(reduced)}
            className="display text-[clamp(3rem,13vw,11rem)] leading-[0.85] tracking-[-0.03em]"
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.85 }}
            className="mt-8 max-w-[44ch] text-base leading-relaxed text-silver md:text-lg"
          >
            We&apos;re cooking something big f&apos;le lab.
            <span className="block text-smoke">Coming very soon.</span>
          </motion.p>
        </div>

        {/* ── The board itself ── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 }}
          className="relative mt-16 md:mt-20"
        >
          {/* A light crossing the face of the board */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-bone/[0.06] to-transparent animate-sweep [animation-duration:6s]"
          />
          <Countdown size="large" align="left" label="L'drop kayji f" />
        </motion.div>
      </div>

      {/* ── The manifest ── */}
      <div className="relative z-10 border-t border-bone/10">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <dl>
            {MANIFEST.map((row, i) => (
              <motion.div
                key={row.k}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.06 }}
                /* A row per fact, hairline between. Reads as a schedule, which
                   is the one thing everybody already knows how to scan. */
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-bone/10 py-5 last:border-0 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline md:py-6"
              >
                <dt className="label-wide text-smoke">{row.k}</dt>
                <dd className="display text-xl text-bone md:text-2xl">{row.v}</dd>
                {row.note && (
                  <dd className="label text-[10px] tracking-[0.2em] text-smoke sm:text-right">
                    {row.note}
                  </dd>
                )}
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Word by word, out of a mask. Words rather than letters — at this size a
 *  letter stagger turns a three-word headline into an eleven-beat wait. */
function Stagger({
  text,
  reduced,
  className,
}: {
  text: string;
  reduced: boolean;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <h1 className={cn("flex flex-wrap gap-x-[0.25em]", className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={word} aria-hidden className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? { opacity: 0 } : { y: "108%", rotate: 3 }}
            animate={reduced ? { opacity: 1 } : { y: "0%", rotate: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
