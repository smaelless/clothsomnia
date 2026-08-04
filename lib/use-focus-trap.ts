"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab inside an open overlay and returns focus to whatever opened it.
 * Every overlay in the site (menu, search, bag) uses this — a modal you can
 * tab out of is a modal that is broken for keyboard users.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const opener = document.activeElement as HTMLElement | null;

    /**
     * Overlay children mount behind an enter animation, and in dev React
     * double-invokes effects, which can cancel a single queued frame. So we
     * retry for a few frames until focus actually lands rather than assuming
     * one rAF is enough.
     */
    let raf = 0;
    let attempts = 0;
    const focusFirst = () => {
      if (container.contains(document.activeElement)) return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      nodes[0]?.focus();
      if (!container.contains(document.activeElement) && attempts++ < 12) {
        raf = requestAnimationFrame(focusFirst);
      }
    };
    raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null,
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [ref, active]);
}
