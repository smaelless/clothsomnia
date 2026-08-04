"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Plate } from "@/components/ui/plate";
import { CATEGORY_LABEL, searchProducts } from "@/lib/catalog";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

const SUGGESTED = ["Trench", "Ultraviolet", "Sport", "Satin", "Oversized", "School"];

/**
 * SEARCH — a full-height sheet that drops from the top like a lighting rig.
 * Results are live as you type; nothing is hidden behind a submit.
 */
export function SearchOverlay() {
  const { overlay, closeOverlay } = useStore();
  const open = overlay === "search";
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 460);
      return () => window.clearTimeout(id);
    }
    setQuery("");
  }, [open]);

  useEffect(() => {
    if (open) closeOverlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="scrim"
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={closeOverlay}
            className="fixed inset-0 z-[80] cursor-default bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          <motion.div
            key="search"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-[85] max-h-[92dvh] overflow-y-auto border-b border-bone/12 bg-ink/95 backdrop-blur-2xl"
            initial={reduced ? { opacity: 0 } : { y: "-100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.65, ease: EASE_IN_OUT }}
          >
            <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-8 md:px-8">
              <div className="mb-8 flex items-start justify-between gap-6">
                <label htmlFor="site-search" className="label-wide block pt-4 text-smoke">
                  Search the archive
                </label>
                <button
                  type="button"
                  onClick={closeOverlay}
                  aria-label="Close search"
                  className="group grid size-12 shrink-0 place-items-center rounded-full border border-bone/15 text-silver transition-colors hover:border-lime hover:text-lime"
                >
                  <X
                    className="size-5 transition-transform duration-500 group-hover:rotate-90"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div className="relative">
                <input
                  id="site-search"
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for tonight?"
                  autoComplete="off"
                  className="display w-full border-b border-bone/20 bg-transparent pb-5 text-[clamp(1.75rem,6vw,4.5rem)] leading-none text-bone caret-lime outline-none transition-colors placeholder:text-smoke/60 focus:border-lime"
                />
                <span className="label-wide absolute bottom-6 right-0 hidden text-smoke md:block">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </span>
              </div>

              {/* Suggestions */}
              <AnimatePresence mode="wait">
                {query.trim() === "" ? (
                  <motion.div
                    key="suggested"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className="mt-10"
                  >
                    <p className="label mb-5 text-smoke">Try</p>
                    <ul className="flex flex-wrap gap-2">
                      {SUGGESTED.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => setQuery(s)}
                            className="label rounded-full border border-bone/15 px-5 py-3 text-silver transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.ul
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    className="mt-8 grid gap-1"
                  >
                    {results.length === 0 && (
                      <li className="py-10">
                        <p className="display text-2xl text-bone">Nothing under that name.</p>
                        <p className="mt-2 text-sm text-smoke">
                          The archive is small on purpose. Try a colour, a category, or a shape.
                        </p>
                      </li>
                    )}

                    {results.map((p, i) => (
                      <motion.li
                        key={p.slug}
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.05 }}
                      >
                        <Link
                          href={`/product/${p.slug}`}
                          className="group flex items-center gap-5 border-b border-bone/10 py-4 transition-colors hover:bg-bone/[0.03]"
                        >
                          <Plate
                            seed={p.slug}
                            tone={p.tone}
                            alt=""
                            sizes="80px"
                            className="size-20 shrink-0 md:size-24"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="display block truncate text-xl text-bone transition-colors group-hover:text-lime md:text-2xl">
                              {p.name}
                            </span>
                            <span className="label-wide mt-2 block text-smoke">
                              {CATEGORY_LABEL[p.category]} — {p.line}
                            </span>
                          </span>
                          <span className="label shrink-0 text-silver">
                            {formatPrice(p.price)}
                          </span>
                          <ArrowUpRight
                            className={cn(
                              "size-5 shrink-0 text-smoke transition-all duration-400",
                              "group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime",
                            )}
                            strokeWidth={1.5}
                          />
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
