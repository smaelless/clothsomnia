"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Plate } from "@/components/ui/plate";
import { EASE_OUT, inView } from "@/lib/motion";
import { FRAMES, type Frame } from "@/lib/worlds";
import { cn } from "@/lib/utils";

type Variant = "cinema" | "strip" | "split" | "stack";

const VARIANTS: { id: Variant; name: string; idea: string }[] = [
  {
    id: "cinema",
    name: "A — Cinema",
    idea: "Each frame fills the screen edge to edge. You scroll through one image at a time, like frames of a film. Boldest, most immersive, longest page.",
  },
  {
    id: "strip",
    name: "B — Filmstrip",
    idea: "The section pins and the images travel sideways as you scroll down. Unexpected, cinematic, and it keeps the whole book in one screen of height.",
  },
  {
    id: "split",
    name: "C — Split",
    idea: "Captions hold still on one side while the images scroll past on the other. Reads like a magazine spread. Calm and expensive.",
  },
  {
    id: "stack",
    name: "D — Stack",
    idea: "Frames overlap as you scroll, each one sliding up over the last and pinning briefly. Physical, tactile, feels like handling prints.",
  },
];

export function LabClient() {
  const [variant, setVariant] = useState<Variant>("cinema");

  return (
    <>
      <div className="sticky top-24 z-40 mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="glass flex flex-wrap gap-2 rounded-full p-2">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              className={cn(
                "label rounded-full px-5 py-3 transition-colors duration-300",
                variant === v.id ? "bg-lime text-ink" : "text-silver hover:text-bone",
              )}
            >
              {v.name}
            </button>
          ))}
        </div>
        <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-smoke">
          {VARIANTS.find((v) => v.id === variant)?.idea}
        </p>
      </div>

      <div className="mt-10">
        {variant === "cinema" && <Cinema />}
        {variant === "strip" && <Strip />}
        {variant === "split" && <Split />}
        {variant === "stack" && <Stack />}
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- A — Cinema */
function Cinema() {
  return (
    <section aria-label="Lookbook">
      {FRAMES.map((frame, i) => (
        <CinemaFrame key={frame.id} frame={frame} index={i} />
      ))}
    </section>
  );
}

function CinemaFrame({ frame, index }: { frame: Frame; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <figure ref={ref} className="relative h-[86svh] overflow-hidden">
      <motion.div style={reduced ? undefined : { y }} className="absolute inset-0 scale-[1.16]">
        <Plate seed={frame.id} src={frame.src} alt={frame.caption} sizes="100vw" className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      <figcaption className="absolute bottom-10 left-0 w-full px-4 md:px-10">
        <span className="label-wide text-lime">{frame.meta}</span>
        <p className="display mt-4 max-w-[16ch] text-[clamp(2rem,6vw,5rem)] leading-[0.95]">
          {frame.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------- B — Filmstrip */
function Strip() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);

  return (
    <section ref={ref} aria-label="Lookbook" className="relative h-[420svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div style={reduced ? undefined : { x }} className="flex gap-6 px-6 will-change-transform">
          {FRAMES.map((frame) => (
            <figure key={frame.id} className="w-[min(72vw,420px)] shrink-0">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Plate seed={frame.id} src={frame.src} alt={frame.caption} sizes="420px" className="h-full w-full" />
              </div>
              <figcaption className="mt-4 flex items-baseline gap-3">
                <span className="label-wide text-smoke">{frame.meta}</span>
                <span className="display text-lg">{frame.caption}</span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ C — Split */
function Split() {
  return (
    <section aria-label="Lookbook" className="mx-auto max-w-[1600px] px-4 md:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-40 lg:h-fit">
          <p className="label-wide text-lime">Chapter 1 — Dreams</p>
          <p className="display mt-6 text-giant leading-[0.9]">
            The night
            <span className="block font-light italic text-silver">changes shape</span>
          </p>
          <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-silver">
            One hoodie, two colourways, front and back. The curved panel does something
            different from every angle — that is the whole reason the book exists.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {FRAMES.map((frame, i) => (
            <motion.figure
              key={frame.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className={cn(i % 3 === 1 && "lg:ml-16", i % 3 === 2 && "lg:mr-16")}
            >
              <div className={cn("relative overflow-hidden", i % 4 === 0 ? "aspect-[16/9]" : "aspect-[4/5]")}>
                <Plate seed={frame.id} src={frame.src} alt={frame.caption} sizes="55vw" className="h-full w-full" />
              </div>
              <figcaption className="mt-3 flex items-baseline gap-3">
                <span className="label-wide text-smoke">{frame.meta}</span>
                <span className="display text-lg">{frame.caption}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ D — Stack */
function Stack() {
  return (
    <section aria-label="Lookbook" className="relative">
      {FRAMES.map((frame, i) => (
        <div key={frame.id} className="sticky top-0 h-svh" style={{ zIndex: i }}>
          <div className="relative h-full overflow-hidden border-t border-bone/10">
            <Plate seed={frame.id} src={frame.src} alt={frame.caption} sizes="100vw" className="h-full w-full" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
            <figcaption className="absolute bottom-12 left-0 w-full px-4 md:px-10">
              <span className="label-wide text-lime">{frame.meta}</span>
              <p className="display mt-3 text-[clamp(1.8rem,5vw,4rem)] leading-[0.95]">{frame.caption}</p>
            </figcaption>
          </div>
        </div>
      ))}
    </section>
  );
}
