"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Magnetic — the element leans toward the cursor within its own bounds.
 * Pointer-driven only: keyboard users get the same element with a clean focus
 * ring and no motion, and reduced-motion disables the pull entirely.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}

type ButtonTone = "solid" | "outline" | "ghost";

const toneClass: Record<ButtonTone, string> = {
  solid: "bg-bone text-ink hover:bg-lime",
  outline: "border border-bone/30 text-bone hover:border-lime hover:text-lime",
  ghost: "text-silver hover:text-bone",
};

/**
 * The site's primary action. The label rides up and out while a duplicate
 * rises to replace it — a small, repeatable piece of the brand's motion voice.
 */
export function ActionButton({
  href,
  onClick,
  children,
  tone = "solid",
  className,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: {
  href?: string;
  onClick?: () => void;
  children: string;
  tone?: ButtonTone;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const inner = (
    <span className="relative block overflow-hidden">
      <span className="label block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="label absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );

  const classes = cn(
    "group relative inline-flex items-center justify-center rounded-full px-8 py-4 transition-colors duration-400 disabled:cursor-not-allowed disabled:opacity-40",
    toneClass[tone],
    className,
  );

  if (href) {
    return (
      <Magnetic>
        {/* onClick is forwarded here too — a link that also has to dismiss an
            overlay is common, and silently dropping the handler is a trap. */}
        <Link href={href} onClick={onClick} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      </Magnetic>
    );
  }

  return (
    <Magnetic>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={classes}
        aria-label={ariaLabel}
      >
        {inner}
      </button>
    </Magnetic>
  );
}
