"use client";

import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/wordmark";
import { ScrollDrift } from "@/components/ui/marquee";

const STATEMENT =
  "We do not make clothes for the daytime. We make them for the hour when the shops are shut, the group chat has gone quiet, and you are still very much awake. Insomnia is not a problem here. It is a dress code.";

/**
 * MANIFESTO — the statement lights up word by word as it passes.
 * Each word's opacity is bound to scroll position, so reading it feels like
 * something is being switched on rather than played back.
 */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section className="relative overflow-hidden border-y border-bone/10 py-24 md:py-40">
      <div aria-hidden className="bloom left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 bg-violet/12" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionLabel index="02" className="mb-12">
          Manifesto
        </SectionLabel>

        <div ref={ref}>
          <p className="display max-w-[22ch] text-huge leading-[1.02] md:max-w-[20ch]">
            {words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1.6) / words.length]}
                reduced={Boolean(reduced)}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>

        <div className="mt-16 grid gap-8 border-t border-bone/10 pt-8 sm:grid-cols-3">
          {[
            { k: "Founded", v: "00:00, Rotterdam" },
            { k: "Produced", v: "Portugal & Japan" },
            { k: "Released", v: "Four chapters a year" },
          ].map((item) => (
            <div key={item.k}>
              <p className="label-wide text-smoke">{item.k}</p>
              <p className="display mt-3 text-2xl">{item.v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drifting ghost type — depth behind the statement */}
      <ScrollDrift distance={200} className="pointer-events-none mt-16 select-none">
        <span className="display whitespace-nowrap text-[clamp(4rem,16vw,14rem)] leading-none text-bone/[0.045]">
          UNIFORM FOR THE WIDE-AWAKE — UNIFORM FOR THE WIDE-AWAKE —
        </span>
      </ScrollDrift>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={reduced ? undefined : { opacity }}>{children}</motion.span>
    </span>
  );
}
