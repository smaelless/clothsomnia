"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Countdown } from "@/components/ui/countdown";
import { Marquee } from "@/components/ui/marquee";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE CLOCK, AS A STAGE.
 *
 * The board on its own is a number on a black page. What makes it read as an
 * event is everything around it moving while the digits stay still: two rings
 * turning against each other, a light crossing the face, ghost type drifting
 * behind, and the whole plane sinking as the page scrolls away from it.
 *
 * Every one of those is a transform or an opacity, which the compositor owns —
 * so the section is busy to look at and nearly free to run. Nothing here
 * animates a layout property and nothing measures the page.
 */

/** Rides the outer ring. Short words, because they pass at an angle. */
const ORBIT = ["TSENNA", "BIENTÔT", "COMING SOON", "MA BQA WALOU", "CHAPTER 01", "PATIENCE"];

/** The headline, revealed letter by letter out of a mask. */
function Letters({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <h1 className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={`${ch}-${i}`} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduced ? { opacity: 0 } : { y: "110%", rotate: 6 }}
            animate={reduced ? { opacity: 1 } : { y: "0%", rotate: 0 }}
            transition={{
              duration: 0.9,
              ease: EASE_OUT,
              // Left to right, quick enough that the word still lands as a word.
              delay: 0.35 + i * 0.035,
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export function WaitingClock() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sink = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const rise = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pb-24 pt-10 md:pb-32 md:pt-16"
      aria-label="Time until the drop"
    >
      {/* Plane 1 — atmosphere, sinking as the page leaves */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: sink }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bloom left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 bg-pine/25 animate-drift" />
        <div className="bloom right-[-12%] top-[8%] size-[26rem] bg-wine/20 animate-drift [animation-delay:-9s]" />
      </motion.div>

      {/* Plane 2 — ghost type behind the board */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: sink, opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-[46%] -z-[5] -translate-y-1/2 select-none"
      >
        <Marquee duration={26}>
          <span className="display whitespace-nowrap pr-10 text-[clamp(4rem,15vw,13rem)] leading-none text-bone opacity-[0.05]">
            TSENNA — BIENTÔT — PAS DE PANIC —
          </span>
        </Marquee>
      </motion.div>

      {/*
        Plane 3 — the rings.
        Big enough to frame the board rather than sit on it, and gone below lg,
        where there is no width to spare and they would only crowd the digits.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[52%] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      >
        <div className={cn("relative size-[46rem]", !reduced && "animate-orbit")}>
          <div className="absolute inset-0 rounded-full border border-dashed border-bone/[0.09]" />
          {ORBIT.map((word, i) => {
            const angle = (i / ORBIT.length) * 360;
            return (
              <span
                key={word}
                className="absolute left-1/2 top-1/2 origin-[0_0]"
                style={{ transform: `rotate(${angle}deg) translate(23rem)` }}
              >
                <span className="block -translate-x-1/2 -translate-y-1/2">
                  {/* Undoes the tilt inherited from its place on the ring... */}
                  <span className="block" style={{ transform: `rotate(${-angle}deg)` }}>
                    {/* ...then runs the ring's own animation in reverse, so the
                        label never tips over as the ring turns. */}
                    <span
                      className={cn(
                        "label block whitespace-nowrap text-[9px] tracking-[0.3em] text-smoke",
                        !reduced && "animate-orbit [animation-direction:reverse]",
                      )}
                    >
                      {word}
                    </span>
                  </span>
                </span>
              </span>
            );
          })}
        </div>

        {/* Inner ring, turning the other way, with one lit point on it */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone/[0.06]",
            !reduced && "animate-orbit [animation-direction:reverse] [animation-duration:70s]",
          )}
        >
          <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/70" />
        </div>
      </div>

      {/* Plane 4 — the type and the board */}
      <motion.div
        style={reduced ? undefined : { y: rise }}
        className="relative mx-auto max-w-[1600px] px-4 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
          className="label-wide mb-8 flex items-center justify-center gap-3 text-lime"
        >
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-lime animate-flicker" />
          Chapter 1 — Dreams
        </motion.p>

        <Letters
          text="Pas De Panic"
          className="display text-center text-[clamp(2.5rem,8vw,6rem)] leading-[1]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.9 }}
          className="mx-auto mt-7 mb-14 max-w-[42ch] text-center text-base leading-relaxed text-silver md:text-lg"
        >
          We&apos;re cooking something big f&apos;le lab. Coming very soon.
        </motion.p>

        {/* The board, with a light crossing its face */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.7 }}
          className="relative"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-bone/[0.07] to-transparent animate-sweep [animation-duration:5s]"
          />
          <Countdown size="large" label="L'drop kayji f" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: EASE_OUT }}
          className="mx-auto mt-14 max-w-[52ch] text-center text-sm leading-relaxed text-smoke"
        >
          Khamsin qet3a f&apos;kol taille, f&apos;kol loun. Ma kayn la restock la walou.
          <span className="mt-1 block text-smoke/70">
            50 pièces par taille. Une fois parties, c&apos;est fini.
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
}
