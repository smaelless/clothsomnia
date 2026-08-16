"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Plate } from "@/components/ui/plate";
import { ActionButton } from "@/components/ui/magnetic";
import { drawerSlide, EASE_OUT, overlayFade } from "@/lib/motion";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { PRELAUNCH_LABEL, unitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

/**
 * BAG — a drawer that behaves like a garment bag: it slides, it weighs
 * something, and it tells you exactly where you stand.
 */
export function BagDrawer() {
  const { overlay, closeOverlay, detailedLines, subtotal, discount, setQty, remove, count } =
    useStore();
  const open = overlay === "bag";
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useFocusTrap(panelRef, open);


  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            key="bag-scrim"
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={closeOverlay}
            className="fixed inset-0 z-[80] cursor-default bg-ink/75 backdrop-blur-sm"
            variants={overlayFade}
            initial="hidden"
            animate="show"
            exit="exit"
          />

          <motion.aside
            key="bag"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[86] flex w-full max-w-[30rem] flex-col border-l border-bone/12 bg-charcoal"
            variants={reduced ? overlayFade : drawerSlide}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Head */}
            <div className="flex items-center justify-between border-b border-bone/10 px-5 py-5">
              <div>
                <h2 className="display text-2xl">Your bag</h2>
                <p className="label-wide mt-2 text-smoke">
                  {count} {count === 1 ? "piece" : "pieces"} — held for 60 minutes
                </p>
              </div>
              <button
                type="button"
                onClick={closeOverlay}
                aria-label="Close bag"
                className="group grid size-11 place-items-center rounded-full border border-bone/15 text-silver transition-colors hover:border-lime hover:text-lime"
              >
                <X className="size-5 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
              </button>
            </div>

            {/* Shipping — free nationwide, so this reassures rather than
                dangling a spend threshold the store no longer has. */}
            <div className="flex items-center gap-3 border-b border-bone/10 px-5 py-4">
              <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-lime" />
              <p className="label text-lime">Free shipping — anywhere in Morocco</p>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto">
              {detailedLines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
                  <p className="display text-3xl leading-tight">Nothing in here yet.</p>
                  <p className="max-w-[24ch] text-sm text-smoke">
                    The night is long and the drop is live. Start somewhere.
                  </p>
                  <ActionButton href="/collections/new" tone="outline">
                    See tonight&apos;s drop
                  </ActionButton>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {detailedLines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout={!reduced}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                        className="flex gap-4 border-b border-bone/10 p-5"
                      >
                        <Link href={`/product/${line.slug}`} className="shrink-0">
                          <Plate
                            seed={line.slug}
                            tone={line.product.tone}
                            alt=""
                            sizes="96px"
                            className="h-32 w-24"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <Link
                              href={`/product/${line.slug}`}
                              className="display truncate text-lg transition-colors hover:text-lime"
                            >
                              {line.product.name}
                            </Link>
                            <span className="label shrink-0 text-bone">
                              {formatPrice(unitPrice(line.product.price) * line.qty)}
                            </span>
                          </div>

                          <p className="label-wide mt-2 text-smoke">
                            {line.color} — Size {line.size}
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                            <div className="flex items-center rounded-full border border-bone/15">
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.qty - 1)}
                                aria-label={`Decrease quantity of ${line.product.name}`}
                                className="grid size-9 place-items-center rounded-full text-silver transition-colors hover:text-lime"
                              >
                                <Minus className="size-3.5" strokeWidth={2} />
                              </button>
                              <span
                                aria-live="polite"
                                className="label w-6 text-center tabular-nums text-bone"
                              >
                                {line.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.qty + 1)}
                                disabled={line.qty >= 10}
                                aria-label={`Increase quantity of ${line.product.name}`}
                                className="grid size-9 place-items-center rounded-full text-silver transition-colors hover:text-lime disabled:opacity-30"
                              >
                                <Plus className="size-3.5" strokeWidth={2} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => remove(line.id)}
                              className="label text-smoke underline-offset-4 transition-colors hover:text-magenta hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Foot */}
            {detailedLines.length > 0 && (
              <div className="border-t border-bone/12 bg-ink/60 p-5">
                {discount > 0 && (
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="label text-lime">{PRELAUNCH_LABEL} off before the drop</span>
                    <span className="label text-lime">−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="label text-smoke">Subtotal</span>
                  <span className="display text-3xl">{formatPrice(subtotal)}</span>
                </div>
                <p className="label-wide mt-3 text-smoke">
                  {discount > 0 ? "Free delivery — you pay in cash" : "Free delivery across Morocco"}
                </p>
                <ActionButton className="mt-5 w-full" href="/checkout" onClick={closeOverlay}>
                  Checkout — cash on delivery
                </ActionButton>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="label mt-4 w-full py-2 text-smoke transition-colors hover:text-bone"
                >
                  Keep looking
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
