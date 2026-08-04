"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * CURSOR — a lagging ring that reads the element under it.
 *
 * Any element carrying `data-cursor="…"` swells the ring and prints its label
 * inside. Strictly an enhancement: fine pointers only, never rendered on touch
 * or under reduced-motion, and the native cursor is never hidden, so nobody
 * loses track of where they are.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      setLabel(target ? (target as HTMLElement).dataset.cursor ?? null : null);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden xl:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-lime/70 backdrop-blur-[2px]"
        animate={{
          width: label ? 92 : 34,
          height: label ? 92 : 34,
          backgroundColor: label ? "rgba(198,255,61,0.12)" : "rgba(198,255,61,0)",
          scale: down ? 0.86 : 1,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <motion.span
          className="label px-2 text-center text-[9px] leading-tight text-lime"
          animate={{ opacity: label ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
