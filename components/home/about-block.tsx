"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ActionButton } from "@/components/ui/magnetic";
import { Plate } from "@/components/ui/plate";
import { SplitLines, SplitWords } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { inView, EASE_OUT } from "@/lib/motion";

const FACTS = [
  { k: "01", label: "Cut in", value: "Portugal" },
  { k: "02", label: "Chapters", value: "Four a year" },
  { k: "03", label: "Restocks", value: "Never" },
  { k: "04", label: "Open", value: "All hours" },
];

export function AboutBlock() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section ref={ref} className="relative py-24 md:py-32" aria-label="About Clothsomnia">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Plate column */}
        <div className="relative">
          <motion.div style={reduced ? undefined : { y }}>
            <motion.div
              initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
              whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={inView}
              transition={{ duration: 1.3, ease: EASE_OUT }}
            >
              <Plate
                seed="about-portrait"
                tone="navy"
                alt="Clothsomnia studio, after hours"
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="aspect-[4/5] w-full"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
            className="glass absolute -bottom-8 -right-4 w-[15rem] rounded-2xl p-5 md:-right-8 md:w-[18rem]"
          >
            <p className="label-wide mb-3 text-lime">Studio hours</p>
            <p className="display text-3xl leading-none">22:00 — 06:00</p>
            <p className="mt-3 text-sm text-smoke">
              Rotterdam. The lights stay on because somebody is always still working.
            </p>
          </motion.div>
        </div>

        {/* Copy column */}
        <div className="lg:pt-10">
          <SectionLabel index="08" className="mb-8">
            About
          </SectionLabel>

          <SplitLines
            lines={["Clothing for", "the sleepless"]}
            className="display text-giant"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <SplitWords
            text="Clothsomnia started as a joke about never going to bed and turned into a wardrobe. We design for the expressive, the restless, and the ones who only really come alive once the day is officially over."
            className="mt-10 max-w-[46ch] text-lg leading-relaxed text-silver"
          />

          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-smoke">
            Everything is made in small runs, in factories we have actually visited, from fabrics
            chosen because of how they behave under artificial light. Nothing is restocked. If it
            is gone, it is gone, and the next chapter is already being cut.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-bone/12 bg-bone/10 sm:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.k} className="bg-ink p-5">
                <dt className="label-wide text-smoke">{fact.label}</dt>
                <dd className="display mt-3 text-xl leading-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ActionButton href="/about" tone="outline">
              Read the whole story
            </ActionButton>
          </div>
        </div>
      </div>
    </section>
  );
}
