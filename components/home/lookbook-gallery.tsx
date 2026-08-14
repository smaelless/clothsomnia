"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Plate } from "@/components/ui/plate";
import { ActionButton } from "@/components/ui/magnetic";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { EASE_OUT, inView } from "@/lib/motion";
import { FRAMES, type Frame } from "@/lib/worlds";
import { cn } from "@/lib/utils";

/**
 * LOOKBOOK — an editorial spread, not a gallery grid.
 *
 * Placement is authored per position rather than uniform, so the page reads
 * like a magazine layout. Each frame drifts at its own rate on scroll.
 */

/** Explicit placement — the asymmetry is the design, not a side effect. */
const LAYOUT = [
  "lg:col-span-5 lg:col-start-1 aspect-[3/4]",
  "lg:col-span-6 lg:col-start-7 lg:mt-28 aspect-[16/10]",
  "lg:col-span-4 lg:col-start-2 lg:-mt-16 aspect-[3/4]",
  "lg:col-span-3 lg:col-start-7 lg:mt-20 aspect-[2/3]",
  "lg:col-span-5 lg:col-start-1 lg:mt-10 aspect-[16/11]",
  "lg:col-span-4 lg:col-start-9 lg:-mt-24 aspect-[3/4]",
];

export function LookbookGallery({
  frames = FRAMES,
  heading = true,
}: {
  frames?: Frame[];
  heading?: boolean;
}) {
  return (
    <section className="relative py-24 md:py-32" aria-label="Lookbook">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        {heading && (
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel index="03" className="mb-8">
                Lookbook — 24 frames
              </SectionLabel>
              <SplitLines
                lines={["The night", "changes shape"]}
                className="display text-giant"
                lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
              />
            </div>
            <ActionButton href="/lookbook" tone="outline">
              Open the full book
            </ActionButton>
          </div>
        )}

        <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8", heading && "mt-16 md:mt-24")}>
          {frames.map((frame, i) => (
            <GalleryFrame key={frame.id} frame={frame} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryFrame({ frame, index }: { frame: Frame; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Alternating drift direction gives the spread its float.
  const y = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [40, -40] : [-30, 30]);

  return (
    <motion.figure
      ref={ref}
      style={reduced ? undefined : { y }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={inView}
      transition={{ duration: 1, ease: EASE_OUT }}
      className={cn("group relative", LAYOUT[index % LAYOUT.length])}
    >
      <Link
        href="/lookbook"
        className="block h-full"
        data-cursor="Open frame"
        aria-label={`${frame.caption} — ${frame.meta}`}
      >
        <div className="relative h-full overflow-hidden">
          <div className="h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <Plate
              seed={frame.id}
              tone={frame.tone}
              variant={index % 3 === 1 ? "field" : "figure"}
              alt={frame.caption}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 40vw"
              className="h-full w-full"
            />
          </div>

          {/* Caption — rides up on hover, always readable */}
          <figcaption className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
            <p className="label-wide mb-3 text-lime opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {frame.meta}
            </p>
            <p className="display text-2xl leading-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:text-3xl">
              {frame.caption}
            </p>
          </figcaption>
        </div>
      </Link>
    </motion.figure>
  );
}
