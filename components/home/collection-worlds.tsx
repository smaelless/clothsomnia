"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Plate } from "@/components/ui/plate";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { EASE_OUT, inView } from "@/lib/motion";
import { WORLDS } from "@/lib/worlds";
import { cn } from "@/lib/utils";

/**
 * COLLECTION WORLDS — five portals, not five cards.
 *
 * Each category is a full-width band. Hovering one floods it with its own
 * atmosphere and sends a preview plate chasing the cursor; on touch the plate
 * is simply always present, so nothing is gated behind a hover that will never
 * happen.
 */
export function CollectionWorlds() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 26, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 200, damping: 26, mass: 0.5 });

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
  }

  const activeWorld = WORLDS.find((w) => w.id === active);

  return (
    <section className="relative border-y border-bone/10 py-24 md:py-32" aria-label="Collections">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index="02" className="mb-8">
              Five worlds
            </SectionLabel>
            <SplitLines
              lines={["Pick a door.", "None of them", "lead back."]}
              className="display text-giant"
              lineClassName="[&:nth-child(3)]:italic [&:nth-child(3)]:font-light [&:nth-child(3)]:text-silver"
            />
          </div>
          <p className="max-w-[30ch] pb-3 text-sm leading-relaxed text-smoke">
            Every category is built as its own place, with its own light and its own hours.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
        className="relative mt-16 md:mt-20"
      >
        {/* Cursor-chasing preview — desktop enhancement only */}
        <AnimatePresence>
          {activeWorld && !reduced && (
            <motion.div
              key={activeWorld.id}
              aria-hidden
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <Plate
                  seed={`world-preview-${activeWorld.id}`}
                  tone={activeWorld.tone}
                  alt=""
                  sizes="18rem"
                  className="aspect-[3/4] w-[15rem] rotate-[-4deg] shadow-2xl xl:w-[18rem]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ul>
          {WORLDS.map((world, i) => {
            const isActive = active === world.id;
            return (
              <motion.li
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.06 }}
                className="border-t border-bone/10 last:border-b"
              >
                <Link
                  href={`/collections/${world.id}`}
                  onPointerEnter={() => setActive(world.id)}
                  onFocus={() => setActive(world.id)}
                  onBlur={() => setActive(null)}
                  className="group relative block overflow-hidden"
                >
                  {/* Atmosphere flood */}
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Plate
                      seed={`world-band-${world.id}`}
                      tone={world.tone}
                      variant="field"
                      alt=""
                      sizes="100vw"
                      className="h-full w-full"
                    />
                  </div>

                  {/* Mobile always shows its world — hover is not a requirement */}
                  <div aria-hidden className="absolute inset-0 opacity-40 lg:hidden">
                    <Plate
                      seed={`world-band-${world.id}`}
                      tone={world.tone}
                      variant="field"
                      alt=""
                      sizes="100vw"
                      className="h-full w-full"
                    />
                  </div>

                  <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-4 py-8 md:px-8 md:py-12">
                    <div className="flex min-w-0 items-baseline gap-4 md:gap-8">
                      <span className="label-wide shrink-0 text-smoke">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className={cn(
                          "display text-[clamp(2.25rem,7vw,6rem)] leading-none transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          "group-hover:translate-x-3 group-focus-visible:translate-x-3",
                          isActive ? "text-lime" : "text-bone",
                        )}
                      >
                        {world.title}
                      </h3>
                      <span
                        className={cn(
                          "display hidden shrink-0 text-2xl italic font-light text-silver transition-all duration-700 md:block",
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                        )}
                      >
                        {world.atmosphere}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-6 md:gap-10">
                      <p className="hidden max-w-[26ch] text-sm leading-relaxed text-smoke xl:block">
                        {world.copy}
                      </p>
                      <div className="hidden text-right md:block">
                        <p className="label-wide text-smoke">{world.coords}</p>
                        <p className="label-wide mt-2 text-smoke">{world.hours}</p>
                      </div>
                      <ArrowUpRight
                        className={cn(
                          "size-6 shrink-0 transition-all duration-500 md:size-8",
                          isActive
                            ? "translate-x-1 -translate-y-1 text-lime"
                            : "text-smoke",
                        )}
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
