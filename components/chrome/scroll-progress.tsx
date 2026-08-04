"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline that tracks how far into the night you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-violet via-magenta to-lime"
    />
  );
}
