"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Plate } from "@/components/ui/plate";
import { Wordmark } from "@/components/ui/wordmark";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { PRIMARY_NAV, SOCIALS } from "@/lib/nav";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { cn } from "@/lib/utils";
import { useStore } from "@/providers/store";

const TONES = ["violet", "cobalt", "magenta", "lime", "silver", "navy"] as const;

/**
 * MOBILE MENU — "the backstage tunnel".
 *
 * The panel wipes down, the links arrive in sequence on a receding Z axis, and
 * the plate behind them re-composes for whichever link is active. Closing runs
 * the same move in reverse rather than a plain fade.
 */
export function MobileMenu() {
  const { overlay, closeOverlay } = useStore();
  const open = overlay === "menu";
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string>(PRIMARY_NAV[1].href);

  useFocusTrap(panelRef, open);

  // Navigating away closes the tunnel.
  useEffect(() => {
    if (open) closeOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const activeIndex = Math.max(
    PRIMARY_NAV.findIndex((l) => l.href === hovered),
    0,
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tunnel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          className="fixed inset-0 z-[90] flex flex-col bg-ink"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          animate={reduced ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)" }}
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.75, ease: EASE_IN_OUT }}
        >
          {/* Atmosphere — recomposes per link */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-45">
            <AnimatePresence mode="wait">
              <motion.div
                key={hovered}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <Plate
                  seed={`tunnel-${hovered}`}
                  tone={TONES[activeIndex % TONES.length]}
                  variant="field"
                  alt=""
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bar */}
          <div className="relative z-10 flex h-24 shrink-0 items-center justify-between px-4 md:px-8">
            <Wordmark className="text-3xl" />
            <button
              type="button"
              onClick={closeOverlay}
              aria-label="Close menu"
              className="group grid size-12 place-items-center rounded-full border border-bone/15 text-silver transition-colors hover:border-lime hover:text-lime"
            >
              <X
                className="size-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90"
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Links — the tunnel itself */}
          <nav
            aria-label="Menu"
            className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8"
            style={{ perspective: 900 }}
          >
            <ul className="flex flex-col justify-center py-4">
              {PRIMARY_NAV.map((link, i) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, y: 44, rotateX: -35, z: -80 }}
                    animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0, z: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: EASE_OUT,
                      delay: reduced ? 0 : 0.28 + i * 0.055,
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="border-b border-bone/10"
                  >
                    <Link
                      href={link.href}
                      onPointerEnter={() => setHovered(link.href)}
                      onFocus={() => setHovered(link.href)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline justify-between gap-4 py-3 md:py-4"
                    >
                      <span className="flex items-baseline gap-3 md:gap-5">
                        <span className="label-wide w-6 shrink-0 text-smoke">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "display text-[clamp(2rem,8vw,4.5rem)] leading-[0.95] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3",
                            active ? "text-lime" : "text-bone group-hover:text-lime",
                          )}
                        >
                          {link.label}
                        </span>
                      </span>
                      <span className="label-wide hidden shrink-0 pb-2 text-smoke transition-colors group-hover:text-silver sm:block">
                        {link.note}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Foot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.85, duration: 0.6 }}
            className="relative z-10 shrink-0 px-4 pb-8 pt-4 md:px-8"
          >
            <div className="rule mb-5" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="label text-smoke transition-colors hover:text-lime"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="label-wide text-smoke">Open all hours</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
