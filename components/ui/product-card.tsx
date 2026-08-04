"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Plate } from "@/components/ui/plate";
import { EASE_OUT } from "@/lib/motion";
import type { Product } from "@/lib/catalog";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

/**
 * PRODUCT CARD
 *
 * The commerce workhorse, art-directed but never at usability's expense:
 * - hover / focus swaps to a second plate (the "back" shot)
 * - quick-add exposes the real size run inline, sold-out sizes struck through
 * - wishlist is a first-class control, reachable by keyboard
 *
 * Everything the card can do is reachable without a pointer: the quick-add
 * panel opens on focus-within, not just hover.
 */
export function ProductCard({
  product,
  index = 0,
  priority,
  className,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
  className?: string;
}) {
  const { add, toggleWish, isWished } = useStore();
  const [swapped, setSwapped] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const wished = isWished(product.slug);

  // Cards alternate their vertical offset so rows never read as a plain grid.
  const offset = index % 3 === 1 ? "md:mt-16" : index % 3 === 2 ? "md:mt-8" : "";

  function quickAdd(size: string) {
    add(product.slug, size, product.colors[0].name);
    setAdded(size);
    window.setTimeout(() => setAdded(null), 1400);
  }

  return (
    <article
      className={cn("group/card relative", offset, className)}
      onMouseEnter={() => setSwapped(true)}
      onMouseLeave={() => setSwapped(false)}
    >
      <div className="relative overflow-hidden bg-charcoal">
        <Link
          href={`/product/${product.slug}`}
          className="block focus-visible:outline-offset-[-3px]"
          onFocus={() => setSwapped(true)}
          onBlur={() => setSwapped(false)}
        >
          <div className="relative aspect-[3/4] w-full">
            {/* Base plate */}
            <Plate
              seed={product.slug}
              tone={product.tone}
              alt={`${product.name} — front`}
              priority={priority}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 26vw"
              className="absolute inset-0 h-full w-full"
            />
            {/* Swap plate — the second angle */}
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: swapped ? 1 : 0, scale: swapped ? 1 : 1.06 }}
              transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OUT }}
            >
              <Plate
                seed={`${product.slug}-alt`}
                tone={product.tone}
                variant="field"
                alt={`${product.name} — detail`}
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 26vw"
                className="h-full w-full"
              />
            </motion.div>
          </div>
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="label pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-ink/70 px-3 py-2 text-lime backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWish(product.slug)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-ink/55 backdrop-blur-sm transition-colors duration-300 hover:bg-ink/85"
        >
          <Heart
            className={cn(
              "size-4 transition-all duration-400",
              wished ? "scale-110 fill-magenta text-magenta" : "text-silver",
            )}
            strokeWidth={1.5}
          />
        </button>

        {/* Quick add — opens on hover or on keyboard focus anywhere in the card.
            Hidden on touch layouts: there is no hover to reveal it there, and
            the size run would sit below a comfortable tap target. Small screens
            go to the product page instead, where the controls are full size. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 hidden translate-y-full p-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:block",
            "group-hover/card:translate-y-0 group-focus-within/card:translate-y-0",
          )}
        >
          <div className="glass rounded-2xl p-3">
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.p
                  key="added"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="label py-2.5 text-center text-lime"
                >
                  Added — size {added}
                </motion.p>
              ) : (
                <motion.div
                  key="sizes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1"
                >
                  <span className="label-wide shrink-0 pr-1 text-smoke">Add</span>
                  <div className="flex flex-1 flex-wrap justify-end gap-1">
                    {product.sizes.map((size) => {
                      const out = product.soldOut?.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={out}
                          onClick={() => quickAdd(size)}
                          aria-label={
                            out ? `${product.name}, size ${size}, sold out` : `Add ${product.name}, size ${size}, to bag`
                          }
                          className={cn(
                            "label min-h-11 min-w-11 rounded-lg px-2 transition-colors duration-250",
                            out
                              ? "cursor-not-allowed text-smoke/50 line-through"
                              : "text-silver hover:bg-bone hover:text-ink",
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-4 pt-4">
        <div className="min-w-0">
          <h3 className="display text-xl leading-tight">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-lime">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 truncate text-sm text-smoke">{product.line}</p>

          <div className="mt-3 flex items-center gap-2">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3 rounded-full ring-1 ring-bone/25 ring-offset-2 ring-offset-ink"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="label-wide pl-1 text-smoke">
              {product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="label text-bone">{formatPrice(product.price)}</p>
          {product.compareAt && (
            <p className="label mt-1 text-smoke line-through">{formatPrice(product.compareAt)}</p>
          )}
          <p className="label-wide mt-2 text-smoke">{CATEGORY_LABEL[product.category]}</p>
        </div>
      </div>
    </article>
  );
}
