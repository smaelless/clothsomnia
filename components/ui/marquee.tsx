"use client";

import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CSS-driven infinite marquee. Duplicated content + a -50% keyframe means the
 * loop is seamless without a rAF tick. Pauses on hover, and reduced-motion
 * collapses it to a static, scrollable row.
 */
export function Marquee({
  children,
  duration = 40,
  reverse,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className="flex w-max">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", className)} aria-hidden>
      <div
        className="marquee-track"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/**
 * A row of type that drifts horizontally as the page scrolls past it.
 * Scroll-linked rather than time-linked, so it reads as parallax depth.
 */
export function ScrollDrift({
  children,
  distance = 160,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const x = useSpring(raw, { stiffness: 90, damping: 30, mass: 0.6 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={reduced ? undefined : { x }} className="w-max">
        {children}
      </motion.div>
    </div>
  );
}
