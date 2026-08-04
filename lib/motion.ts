import type { Transition, Variants } from "framer-motion";

/**
 * One shared motion vocabulary for the whole site.
 * Two easings only — entrances feel like a curtain settling,
 * scene changes feel like a shutter.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

export const spring: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.8 };
export const springSoft: Transition = { type: "spring", stiffness: 140, damping: 24, mass: 1 };

/** Viewport config used by every scroll reveal — fires once, slightly early. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Parent that staggers its children in. */
export const stagger = (amount = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: amount, delayChildren: delay } },
});

/** A line of type rising out of an overflow-hidden mask. */
export const lineRise: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: {
    y: "0%",
    rotate: 0,
    transition: { duration: 1.05, ease: EASE_OUT },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

/** Image plates arrive with a subtle scale settle + clip wipe. */
export const plateReveal: Variants = {
  hidden: { opacity: 0, scale: 1.08, clipPath: "inset(18% 0% 18% 0%)" },
  show: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: EASE_OUT },
  },
};

/** Reduced-motion twin: no transform, opacity only. */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

export const drawerSlide: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: { duration: 0.6, ease: EASE_IN_OUT } },
  exit: { x: "100%", transition: { duration: 0.45, ease: EASE_IN_OUT } },
};

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};
