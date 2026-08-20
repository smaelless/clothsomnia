"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/motion";

/**
 * OPENING — the hero, reduced to its type.
 *
 * The full Hero carries a three-plate collage, an orbiting label ring and a
 * button through to the drop. None of that belongs on a page whose whole job
 * is to say the name and the date: the collage competes with the lookbook
 * further down, the ring points at nothing, and a call to action leads to a
 * shop that has nothing to collect yet.
 *
 * What is left is the part that says who this is — the eyebrow, the headline
 * and the line under it — with the same reveal and the same scroll parallax,
 * so the opening still reads as Clothsomnia rather than as a stripped page.
 *
 * The full version is untouched at components/home/hero.tsx and still on the
 * principal homepage in app/_backup/home-principal.tsx.
 */

/* Broken across three lines so the stagger reads as a build, and so the payoff
   word lands alone on the last line in the italic silver treatment. */
const HEADLINE = ["T'LBESS WHAT", "THEY'LL", "REMEMBER"];

export function Opening() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const yHaze = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-16 pt-6 md:pb-24 md:pt-8"
      aria-label="Clothsomnia — Chapter 1"
    >
      {/* Atmosphere. Restrained: at full strength these wash the whole page
          and it reads as a gradient rather than a dark room with light in it. */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: yHaze }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bloom left-[-14%] top-[-8%] size-[38rem] bg-pine/25 animate-drift" />
        <div className="bloom right-[-18%] top-[26%] size-[30rem] bg-wine/20 animate-drift [animation-delay:-8s]" />
      </motion.div>

      <motion.div
        style={reduced ? undefined : { y, opacity: fade }}
        className="relative mx-auto flex max-w-[1600px] flex-col justify-start px-4 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="label mb-8 flex items-start gap-3 text-lime"
        >
          <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-lime animate-flicker" />
          {/* Held on one line from sm up — the type scales with the viewport so
              it always fits. Below sm there is no size that keeps 57 characters
              on one line and still readable, so it wraps there. */}
          <span className="whitespace-normal text-[clamp(8px,0.82vw,11px)] leading-[1.7] tracking-[0.16em] sm:whitespace-nowrap">
            It&apos;s not necessary tlbess qadek iwatik, sometimes khassek
          </span>
        </motion.p>

        <h1 className="display text-mega">
          {HEADLINE.map((line, i) => (
            <span key={line} className="clip-line">
              <motion.span
                className={i === 2 ? "block italic font-light text-silver" : "block"}
                initial={{ y: "112%", rotate: 2 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.25, ease: EASE_OUT, delay: 0.25 + i * 0.11 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.8 }}
          className="mt-10 max-w-[40ch] text-base leading-relaxed text-silver md:mt-9 md:text-lg"
        >
          Kolchi kaylbes. Machi kolchi kay3ref ykhtar.
        </motion.p>
      </motion.div>
    </section>
  );
}
