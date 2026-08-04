"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { EASE_OUT } from "@/lib/motion";
import type { Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Sort = "featured" | "low" | "high";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price — low" },
  { id: "high", label: "Price — high" },
];

/** The shopping surface for every collection route. */
export function ProductGrid({
  products,
  emptyLabel = "this world",
}: {
  products: Product[];
  emptyLabel?: string;
}) {
  const [sort, setSort] = useState<Sort>("featured");
  const reduced = useReducedMotion();

  const sorted = useMemo(() => {
    const copy = [...products];
    if (sort === "low") copy.sort((a, b) => a.price - b.price);
    if (sort === "high") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [products, sort]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bone/10 pb-5">
          <p className="label text-smoke" aria-live="polite">
            {sorted.length} {sorted.length === 1 ? "piece" : "pieces"}
          </p>

          <div className="flex items-center gap-1">
            <span className="label-wide mr-2 text-smoke">Sort</span>
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSort(s.id)}
                aria-pressed={sort === s.id}
                className={cn(
                  "label relative rounded-full px-4 py-2.5 transition-colors duration-300",
                  sort === s.id ? "text-ink" : "text-smoke hover:text-bone",
                )}
              >
                {sort === s.id && (
                  <motion.span
                    layoutId="sort-pill"
                    className="absolute inset-0 rounded-full bg-lime"
                    transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                  />
                )}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {sorted.length === 0 ? (
          <p className="py-24 text-center text-base text-smoke">
            Nothing in {emptyLabel} yet. The next chapter is already being cut.
          </p>
        ) : (
          <motion.div
            layout={!reduced}
            className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {sorted.map((product, i) => (
                <motion.div
                  key={product.slug}
                  layout={!reduced}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: reduced ? 0 : Math.min(i, 8) * 0.04 }}
                >
                  <ProductCard product={product} index={i} priority={i < 3} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
