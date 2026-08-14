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
 * LOOKBOOK — a pinboard, not a grid.
 *
 * Frames overlap, sit at different scales, and are tacked down at slight
 * angles, the way prints get pinned to a wall while a collection is being
 * edited. Each drifts at its own rate on scroll, so the overlaps open and
 * close as the page moves, and hovering straightens a frame and lifts it clear
 * of its neighbours.
 *
 * Placement is authored per position rather than generated — the asymmetry is
 * the design, and a loop would only ever produce a rhythm.
 */

type Slot = {
  /** Grid placement and shape. */
  cls: string;
  /** Degrees off square. Small — a tilt, not a mess. */
  rot: number;
  /** Stacking, so overlaps read as deliberate layering. */
  z: number;
  /** Caption escapes the frame, which breaks the block open. */
  outside?: boolean;
};

const SLOTS: Slot[] = [
  { cls: "lg:col-span-5 lg:col-start-1 aspect-[3/4]", rot: -1.6, z: 30 },
  { cls: "lg:col-span-4 lg:col-start-6 lg:mt-32 aspect-[4/5]", rot: 1.2, z: 20, outside: true },
  { cls: "lg:col-span-3 lg:col-start-10 lg:mt-10 aspect-[2/3]", rot: -0.8, z: 40 },
  { cls: "lg:col-span-4 lg:col-start-2 lg:-mt-20 aspect-[16/11]", rot: 1.8, z: 50 },
  { cls: "lg:col-span-5 lg:col-start-6 lg:-mt-10 aspect-[3/4]", rot: -1.2, z: 25, outside: true },
  { cls: "lg:col-span-3 lg:col-start-10 lg:-mt-28 aspect-[3/4]", rot: 1.5, z: 45 },
];

export function LookbookGallery({
  frames = FRAMES,
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
                Lookbook — 12 frames
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

        {/* Row gap only on small screens — once the pinboard assembles at lg,
            the negative margins in each slot do the spacing. */}
        <div
          className={cn(
            "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-5 lg:gap-y-0",
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
  const slot = SLOTS[index % SLOTS.length];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Uneven, alternating drift — equal amounts would read as one moving block.
  const y = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [56, -56] : [-34, 34]);

  return (
    <motion.figure
      ref={ref}
      style={reduced ? { zIndex: slot.z } : { y, zIndex: slot.z }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={inView}
      transition={{ duration: 1.1, ease: EASE_OUT }}
      className={cn("group relative", slot.cls)}
    >
      <Link
        href="/lookbook"
        className="block h-full"
        data-cursor="Open frame"
        aria-label={`${frame.caption} — ${frame.meta}`}
      >
        {/* The tilt lives in CSS, not in the entrance animation: Framer owns
            the transform on the figure above (it is driving y), so an animated
            rotate there is silently dropped. A CSS variable keeps it declarative
            and lets hover straighten the frame and lift it clear. */}
        <div
          style={{ ["--rot" as string]: `${slot.rot}deg` }}
          className={cn(
            "relative h-full overflow-hidden shadow-2xl shadow-ink/60",
            "transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            "[transform:rotate(var(--rot))]",
            "group-hover:[transform:rotate(0deg)_scale(1.03)]",
          )}
        >
          <div className="h-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <Plate
              seed={frame.id}
              tone={frame.tone}
              variant={index % 3 === 1 ? "field" : "figure"}
              alt={frame.caption}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 34vw"
              className="h-full w-full"
            />
          </div>

          {/* Frame number, tacked to the corner like a contact sheet */}
          <span className="label-wide absolute left-4 top-4 z-10 text-bone/60">
            {frame.meta.replace("Frame ", "")}
          </span>

          {!slot.outside && (
            <figcaption className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <p className="display text-2xl leading-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 md:text-3xl">
                {frame.caption}
              </p>
            </figcaption>
          )}
        </div>

        {/* Captions that escape the frame entirely, so the block never reads as
            a tidy set of cards. */}
        {slot.outside && (
          <figcaption className="mt-5 max-w-[26ch]">
            <p className="display text-2xl leading-tight text-bone transition-colors duration-500 group-hover:text-lime md:text-[1.75rem]">
              {frame.caption}
            </p>
          </figcaption>
        )}
      </Link>
    </motion.figure>
  );
}
