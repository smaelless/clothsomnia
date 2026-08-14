"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Plate } from "@/components/ui/plate";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { getProduct } from "@/lib/catalog";
import { EASE_OUT, inView } from "@/lib/motion";
import { LOOKS, type Look } from "@/lib/worlds";
import { cn, formatPrice } from "@/lib/utils";

/**
 * RUNWAY — five looks walked one after another.
 *
 * Layouts alternate side to side so the eye has to travel, which is what gives
 * the sequence its walking rhythm. The look number is set enormous behind the
 * plate and drifts against it as you scroll.
 */
export function Runway() {
  return (
    <section className="relative pb-14 pt-8 md:pb-20 md:pt-10" aria-label="Runway sequence">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="01" className="mb-8">
              The sequence
            </SectionLabel>
            <SplitLines
              lines={["Five looks,", "one long night"]}
              className="display text-giant"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light"
            />
          </div>
          <p className="max-w-[32ch] pb-3 text-sm leading-relaxed text-smoke">
            Walked in order, top to bottom. Every piece is shoppable from where it stands.
          </p>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        {LOOKS.map((look, i) => (
          <LookRow key={look.id} look={look} index={i} />
        ))}
      </div>
    </section>
  );
}

function LookRow({ look, index }: { look: Look; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const flipped = index % 2 === 1;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yPlate = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const yNumber = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const xNotes = useTransform(scrollYProgress, [0, 1], flipped ? ["-6%", "6%"] : ["6%", "-6%"]);

  const pieces = look.pieces.map(getProduct).filter(Boolean);

  return (
    <article
      ref={ref}
      className={cn(
        "relative border-t border-bone/10 py-14 md:py-20",
        // Every other look is inset from the opposite edge — never a plain column.
        flipped ? "md:pl-[8vw]" : "md:pr-[8vw]",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-[1600px] items-center gap-8 px-4 md:gap-10 md:px-8",
          "md:grid-cols-[1.1fr_1fr]",
          flipped && "md:[&>*:first-child]:order-2",
        )}
      >
        {/* Plate */}
        <div className="relative">
          <motion.span
            aria-hidden
            style={reduced ? undefined : { y: yNumber }}
            className={cn(
              "display pointer-events-none absolute z-10 select-none text-[clamp(6rem,18vw,16rem)] leading-none text-bone/[0.08]",
              flipped ? "-right-2 -top-10 md:-right-10" : "-left-2 -top-10 md:-left-10",
            )}
          >
            {look.index}
          </motion.span>

          <motion.div
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
            whileInView={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={inView}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            className="relative overflow-hidden"
            data-cursor="View look"
          >
            <motion.div style={reduced ? undefined : { y: yPlate }} className="scale-110">
              <Plate
                seed={look.id}
                tone={look.tone}
                alt={`Look ${look.index} — ${look.title}`}
                sizes="(max-width: 768px) 92vw, 52vw"
                className={cn(
                  "w-full",
                  // Alternating crops keep the rhythm from settling
                  index % 3 === 0
                    ? "aspect-[4/5]"
                    : index % 3 === 1
                      ? "aspect-[16/11]"
                      : "aspect-[3/4]",
                )}
              />
            </motion.div>
          </motion.div>

          {/* Notes rail */}
          <motion.ul
            style={reduced ? undefined : { x: xNotes }}
            className={cn(
              "absolute z-10 flex gap-3 md:flex-col md:gap-2",
              flipped ? "-bottom-4 left-4 md:-left-16 md:bottom-8" : "-bottom-4 right-4 md:-right-16 md:bottom-8",
            )}
          >
            {look.notes.map((note, n) => (
              <motion.li
                key={note}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 + n * 0.09 }}
                className="label-wide whitespace-nowrap rounded-full bg-ink/80 px-3 py-2 text-silver backdrop-blur-sm"
              >
                {note}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Copy */}
        <div className={cn("relative", flipped && "md:text-right")}>
          <p className="label-wide mb-5 text-lime">Look {look.index}</p>

          <SplitLines
            lines={[look.title]}
            as="h3"
            className="display text-huge"
          />

          <p
            className={cn(
              "mt-6 max-w-[38ch] text-base leading-relaxed text-silver",
              flipped && "md:ml-auto",
            )}
          >
            {look.caption}
          </p>

          {/* Shoppable pieces */}
          <ul className={cn("mt-8 space-y-px", flipped && "md:ml-auto md:max-w-md")}>
            {pieces.map((p) => (
              <li key={p!.slug}>
                <Link
                  href={`/product/${p!.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-bone/10 py-4 transition-colors hover:border-lime/40"
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="size-2 rounded-full transition-transform duration-400 group-hover:scale-150"
                      style={{ backgroundColor: p!.colors[0].hex }}
                    />
                    <span className="text-sm text-bone transition-colors group-hover:text-lime">
                      {p!.name}
                    </span>
                  </span>
                  <span className="label text-smoke transition-colors group-hover:text-silver">
                    {formatPrice(p!.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
