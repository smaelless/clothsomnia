"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, type ElementType, type ReactNode } from "react";
import { fadeUp, inView, reducedVariants, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * motion.create() must not run inline in render — a fresh component identity
 * every pass would remount the subtree and kill the animation it is driving.
 */
function useMotionTag(tag: ElementType = "div") {
  return useMemo(() => motion.create(tag as ElementType), [tag]);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variants?: Variants;
};

/** Single element that rises in when scrolled into view. */
export function Reveal({ children, className, delay = 0, as, variants }: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = useMotionTag(as);

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={reduced ? reducedVariants : (variants ?? fadeUp)}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers direct <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  amount = 0.08,
  delay = 0,
  as,
}: RevealProps & { amount?: number }) {
  const Comp = useMotionTag(as);
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(amount, delay)}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  variants,
  as,
}: Omit<RevealProps, "delay">) {
  const reduced = useReducedMotion();
  const Comp = useMotionTag(as);
  return (
    <Comp className={className} variants={reduced ? reducedVariants : (variants ?? fadeUp)}>
      {children}
    </Comp>
  );
}

/**
 * Headline type that rises line-by-line out of a mask.
 * Lines are authored explicitly rather than measured — the break points are an
 * art-direction decision, not a layout accident.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger: gap = 0.09,
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={stagger(gap, delay)}
    >
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className="clip-line">
            <motion.span
              className={cn("block", lineClassName)}
              variants={{
                hidden: { y: "112%", rotate: 1.5 },
                show: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

/** Word-by-word entrance, for shorter statements that need more texture. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <motion.div initial="hidden" whileInView="show" viewport={inView} variants={stagger(0.028, delay)}>
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
