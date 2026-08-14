"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Plate } from "@/components/ui/plate";
import { ActionButton } from "@/components/ui/magnetic";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { EASE_OUT, inView } from "@/lib/motion";
import { HOME_FRAMES, type Frame } from "@/lib/worlds";
import { cn } from "@/lib/utils";

/**
 * LOOKBOOK
 *
 * Aligned to a twelve column grid. The rhythm comes from scale — full-width
 * detail bands cutting between columns of portraits — rather than from tilting
 * or overlapping, which read as noise at this size.
 *
 * Captions sit under their frames instead of on top of them: an overlay looks
 * good in a mockup and hides the garment in practice, which is the one thing
 * this page exists to show.
 */
export function LookbookGallery({
  frames = HOME_FRAMES,
  heading = true,
}: {
  frames?: Frame[];
  heading?: boolean;
}) {
  return (
    <section className="relative pb-14 pt-6 md:pb-20 md:pt-8" aria-label="Lookbook">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        {heading && (
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel index="02" className="mb-8">
                Lookbook — Chapter 1
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

        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5",
            heading && "mt-10 md:mt-14",
          )}
        >
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
  /**
   * The image drifts inside its frame rather than the frame moving on the page.
   * Moving the frames themselves breaks the grid alignment that makes this
   * layout read as considered.
   */
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.figure
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: reduced ? 0 : (index % 3) * 0.06 }}
      className={cn("group relative", frame.span)}
    >
      <Link href="/lookbook" className="block" data-cursor="Open frame" aria-label={frame.caption}>
        <div className={cn("relative overflow-hidden bg-charcoal", frame.ratio)}>
          {/* Oversized so the drift never exposes an edge. */}
          <motion.div
            style={reduced ? undefined : { y }}
            className="absolute inset-0 scale-[1.12]"
          >
            <Plate
              seed={frame.id}
              src={frame.src}
              alt={frame.caption}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 55vw"
              className="h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </motion.div>
        </div>

        <figcaption className="mt-4 flex items-baseline gap-4">
          <span className="label-wide shrink-0 text-smoke">{frame.meta}</span>
          <span className="display text-lg leading-tight text-bone transition-colors duration-500 group-hover:text-lime md:text-xl">
            {frame.caption}
          </span>
        </figcaption>
      </Link>
    </motion.figure>
  );
}
