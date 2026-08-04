"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ui/magnetic";
import { ProductCard } from "@/components/ui/product-card";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { CATEGORY_LABEL, NEW_DROP, type CategoryId } from "@/lib/catalog";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const FILTERS: ("all" | CategoryId)[] = ["all", "unisex", "men", "girls", "sport", "school"];

/**
 * NEW DROP — the section that has to actually sell.
 *
 * Art direction stays (staggered card offsets, plate swaps, magnetic buttons)
 * but every commerce affordance is present and unobstructed: filter, price,
 * colours, size run, quick add, wishlist.
 */
export function NewDrop() {
  const [filter, setFilter] = useState<"all" | CategoryId>("all");
  const reduced = useReducedMotion();

  const products = useMemo(
    () => (filter === "all" ? NEW_DROP : NEW_DROP.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section className="relative py-24 md:py-32" aria-label="Tonight's drop">
      <div aria-hidden className="bloom right-[-10%] top-[10%] size-[36rem] bg-cobalt/15" />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-8">
          <div>
            <SectionLabel index="05" className="mb-8">
              Tonight&apos;s drop
            </SectionLabel>
            <SplitLines
              lines={["Live now,", "gone by morning"]}
              className="display text-giant"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
            />
          </div>

          <div className="flex flex-col items-start gap-6 pb-2">
            <p className="max-w-[34ch] text-sm leading-relaxed text-smoke">
              Eight pieces released at midnight. Sizes are cut in small runs and are not restocked.
            </p>
            <ActionButton href="/collections/new" tone="outline">
              View all 41 pieces
            </ActionButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-12 flex flex-wrap items-center gap-2 border-y border-bone/10 py-4">
          <span className="label-wide mr-3 text-smoke">Filter</span>
          {FILTERS.map((f) => {
            const activeFilter = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={activeFilter}
                className={cn(
                  "label relative rounded-full px-4 py-2.5 transition-colors duration-300",
                  activeFilter ? "text-ink" : "text-smoke hover:text-bone",
                )}
              >
                {activeFilter && (
                  <motion.span
                    layoutId="drop-filter"
                    className="absolute inset-0 rounded-full bg-lime"
                    transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT }}
                  />
                )}
                <span className="relative">
                  {f === "all" ? "Everything" : CATEGORY_LABEL[f]}
                </span>
              </button>
            );
          })}
          <span className="label-wide ml-auto text-smoke" aria-live="polite">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          layout={!reduced}
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                layout={!reduced}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: reduced ? 0 : i * 0.05 }}
              >
                <ProductCard product={product} index={i} priority={i < 2} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {products.length === 0 && (
          <p className="py-20 text-center text-sm text-smoke">
            Nothing from that world made tonight&apos;s cut. Try another.
          </p>
        )}
      </div>
    </section>
  );
}
