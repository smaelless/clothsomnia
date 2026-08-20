"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Plate } from "@/components/ui/plate";
import { ActionButton } from "@/components/ui/magnetic";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { HOME_FRAMES, type Frame } from "@/lib/worlds";
import { cn } from "@/lib/utils";

/**
 * LOOKBOOK — the stack.
 *
 * Every frame pins to the top of the viewport and the next one slides up over
 * it, so scrolling feels like dealing prints onto a pile rather than moving
 * down a page. The effect is pure CSS sticky positioning with an ascending
 * z-index — no scroll listener, nothing to keep in sync, and it costs nothing
 * per frame.
 *
 * Note: this relies on no ancestor being a scroll container. `overflow-x:
 * hidden` on body would kill it silently, which is why globals.css uses
 * `clip` instead.
 */
export function LookbookGallery({
  frames = HOME_FRAMES,
  heading = true,
}: {
  frames?: Frame[];
  heading?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative pb-14 pt-6 md:pt-8" aria-label="Lookbook">
      {heading && (
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
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
        </div>
      )}

      {/*
        Reduced motion gets a plain stacked list: sticky pinning is disorienting
        for anyone who asked for less movement, and the frames read fine in
        sequence.
      */}
      <div className={cn("relative", heading && "mt-10 md:mt-14")}>
        {frames.map((frame, i) => (
          <StackFrame key={frame.id} frame={frame} index={i} reduced={Boolean(reduced)} />
        ))}
      </div>
    </section>
  );
}

function StackFrame({
  frame,
  index,
  reduced,
}: {
  frame: Frame;
  index: number;
  reduced: boolean;
}) {
  return (
    <div
      className={cn(reduced ? "relative mb-4 h-[70svh]" : "sticky top-0 h-svh")}
      style={{ zIndex: index + 1 }}
    >
      <Link
        href="/lookbook"
        className="group relative block h-full overflow-hidden border-t border-bone/10"
        data-cursor="Open frame"
        aria-label={frame.caption}
      >
        <Plate
          seed={frame.id}
          src={frame.src}
          alt={frame.caption}
          /* The frame prints its own caption below; without this each
             photograph carried two — a random teaser line burnt into the
             image and the deliberate one under it. */
          caption={null}
          priority={index === 0}
          sizes="100vw"
          className="h-full w-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />

        {/* Keeps the caption legible over whatever the frame happens to be. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
        />

        <motion.figcaption
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-45% 0px -35% 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 bottom-0 px-4 pb-12 md:px-10 md:pb-16"
        >
          <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-8">
            <div>
              <span className="label-wide text-lime">{frame.meta}</span>
              <p className="display mt-4 max-w-[15ch] text-[clamp(2rem,6vw,5rem)] leading-[0.92]">
                {frame.caption}
              </p>
            </div>
            <span className="label-wide hidden shrink-0 pb-3 text-smoke md:block">
              Chapter 1 — Dreams
            </span>
          </div>
        </motion.figcaption>
      </Link>
    </div>
  );
}
