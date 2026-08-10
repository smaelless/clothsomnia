"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Minus, Plus, Ruler, Truck, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ActionButton } from "@/components/ui/magnetic";
import { Plate } from "@/components/ui/plate";
import { CATEGORY_LABEL, type Product } from "@/lib/catalog";
import { EASE_OUT } from "@/lib/motion";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

const SIZE_GUIDE = [
  { size: "XS", chest: "86–91", waist: "71–76", length: "68" },
  { size: "S", chest: "91–97", waist: "76–81", length: "70" },
  { size: "M", chest: "97–102", waist: "81–86", length: "72" },
  { size: "L", chest: "102–107", waist: "86–91", length: "74" },
  { size: "XL", chest: "107–112", waist: "91–97", length: "76" },
  { size: "XXL", chest: "112–117", waist: "97–102", length: "78" },
];

/**
 * PRODUCT DETAIL
 *
 * The editorial spread and the commerce system in one component. Used at full
 * scale on /product/[slug] and in `compact` mode as the homepage teaser, so
 * the two can never drift apart.
 */
export function ProductDetail({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { add, toggleWish, isWished } = useStore();
  const reduced = useReducedMotion();

  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [frame, setFrame] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [error, setError] = useState(false);

  const wished = isWished(product.slug);
  const gallery = [
    { seed: product.slug, variant: "figure" as const, label: "Full length" },
    { seed: `${product.slug}-alt`, variant: "field" as const, label: "Fabric" },
    { seed: `${product.slug}-back`, variant: "figure" as const, label: "Back" },
    { seed: `${product.slug}-detail`, variant: "field" as const, label: "Detail" },
  ];

  function addToBag() {
    if (!size) {
      setError(true);
      return;
    }
    setError(false);
    add(product.slug, size, color, qty);
  }

  return (
    <div
      className={cn(
        "grid gap-10 lg:gap-16",
        compact ? "lg:grid-cols-[1.05fr_1fr]" : "lg:grid-cols-[1.15fr_1fr]",
      )}
    >
      {/* ---------- Gallery ---------- */}
      <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
        {/* Thumbs */}
        <ul className="flex shrink-0 gap-3 md:flex-col">
          {gallery.map((g, i) => (
            <li key={g.seed}>
              <button
                type="button"
                onClick={() => setFrame(i)}
                aria-label={`View ${g.label}`}
                aria-current={frame === i}
                className={cn(
                  "relative block w-16 overflow-hidden transition-opacity duration-300 md:w-20",
                  frame === i ? "opacity-100" : "opacity-45 hover:opacity-80",
                )}
              >
                <Plate
                  seed={g.seed}
                  tone={product.tone}
                  variant={g.variant}
                  alt=""
                  sizes="80px"
                  className="aspect-[3/4] w-full"
                />
                {frame === i && (
                  <motion.span
                    layoutId={`thumb-${product.slug}`}
                    className="absolute inset-0 border border-lime"
                    transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Main frame */}
        <div className="relative flex-1 overflow-hidden bg-charcoal">
          <div className="relative aspect-[4/5] w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={frame}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <Plate
                  seed={gallery[frame].seed}
                  tone={product.tone}
                  variant={gallery[frame].variant}
                  alt={`${product.name} — ${gallery[frame].label}`}
                  priority={!compact}
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>

            <span className="label-wide absolute bottom-5 left-5 z-10 text-silver">
              {gallery[frame].label} — {String(frame + 1).padStart(2, "0")}/
              {String(gallery.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Commerce ---------- */}
      <div className={cn("flex flex-col", !compact && "lg:sticky lg:top-28 lg:self-start")}>
        <p className="label-wide text-lime">{CATEGORY_LABEL[product.category]}</p>

        <h1
          className={cn(
            "display mt-5 leading-[0.95]",
            compact ? "text-[clamp(2rem,4vw,3.25rem)]" : "text-huge",
          )}
        >
          {product.name}
        </h1>

        <p className="mt-4 text-base text-silver">{product.line}</p>

        <div className="mt-6 flex items-baseline gap-4">
          <span className="display text-3xl">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="label text-smoke line-through">{formatPrice(product.compareAt)}</span>
          )}
          <span className="label-wide text-smoke">Incl. VAT</span>
        </div>

        {/* Colour */}
        <fieldset className="mt-10">
          <legend className="label mb-4 text-smoke">
            Colour — <span className="text-bone">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-pressed={color === c.name}
                aria-label={`Colour ${c.name}`}
                className={cn(
                  "group relative grid size-11 place-items-center rounded-full transition-transform duration-300 hover:scale-105",
                )}
              >
                <span
                  className="size-7 rounded-full ring-1 ring-inset ring-bone/25"
                  style={{ backgroundColor: c.hex }}
                />
                {color === c.name && (
                  <motion.span
                    layoutId={`swatch-${product.slug}`}
                    className="absolute inset-0 rounded-full border border-lime"
                    transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
                  />
                )}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Size */}
        <fieldset className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <legend className="label text-smoke">
              Size {size && <span className="text-bone">— {size}</span>}
            </legend>
            <button
              type="button"
              onClick={() => setGuideOpen((v) => !v)}
              aria-expanded={guideOpen}
              className="label -my-2 flex min-h-11 items-center gap-2 py-2 text-silver underline-offset-4 transition-colors hover:text-lime hover:underline"
            >
              <Ruler className="size-3.5" strokeWidth={1.5} />
              Size guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const out = product.soldOut?.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={out}
                  onClick={() => {
                    setSize(s);
                    setError(false);
                  }}
                  aria-pressed={size === s}
                  className={cn(
                    "label relative min-w-14 rounded-full border px-4 py-3.5 transition-all duration-300",
                    out
                      ? "cursor-not-allowed border-bone/8 text-smoke/45 line-through"
                      : size === s
                        ? "border-lime bg-lime text-ink"
                        : "border-bone/20 text-silver hover:border-bone/60 hover:text-bone",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="label mt-4 text-magenta"
              >
                Choose a size first.
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {guideOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="mt-6 overflow-x-auto rounded-2xl border border-bone/12 p-1">
                  <table className="w-full min-w-[22rem] border-collapse text-left">
                    <caption className="label-wide px-4 py-3 text-left text-smoke">
                      Measurements in cm, garment flat
                    </caption>
                    <thead>
                      <tr>
                        {["Size", "Chest", "Waist", "Length"].map((h) => (
                          <th key={h} scope="col" className="label px-4 py-3 text-smoke">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_GUIDE.map((row) => (
                        <tr key={row.size} className="border-t border-bone/10">
                          <th scope="row" className="label px-4 py-3 text-bone">
                            {row.size}
                          </th>
                          <td className="px-4 py-3 text-sm text-silver">{row.chest}</td>
                          <td className="px-4 py-3 text-sm text-silver">{row.waist}</td>
                          <td className="px-4 py-3 text-sm text-silver">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </fieldset>

        {/* Quantity + add */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-bone/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="grid size-12 place-items-center rounded-full text-silver transition-colors hover:text-lime"
            >
              <Minus className="size-4" strokeWidth={2} />
            </button>
            <span aria-live="polite" className="label w-8 text-center tabular-nums">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label="Increase quantity"
              className="grid size-12 place-items-center rounded-full text-silver transition-colors hover:text-lime"
            >
              <Plus className="size-4" strokeWidth={2} />
            </button>
          </div>

          <ActionButton onClick={addToBag} className="flex-1 min-w-[12rem]">
            Add to bag
          </ActionButton>

          <button
            type="button"
            onClick={() => toggleWish(product.slug)}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-full border transition-colors duration-300",
              wished
                ? "border-magenta text-magenta"
                : "border-bone/20 text-silver hover:border-bone/60 hover:text-bone",
            )}
          >
            <Heart className={cn("size-5", wished && "fill-magenta")} strokeWidth={1.5} />
          </button>
        </div>

        {/* Service notes */}
        <ul className="mt-8 grid gap-3 border-t border-bone/10 pt-8">
          <li className="flex items-start gap-3 text-sm text-silver">
            <Truck className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={1.5} />
            Free shipping anywhere in Morocco. Dispatched within 24 hours, tracked door to door.
          </li>
          <li className="flex items-start gap-3 text-sm text-silver">
            <Undo2 className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={1.5} />
            30 days to change your mind. Returns are free and printed labels are included.
          </li>
        </ul>

        {/* Description */}
        <div className="mt-10 border-t border-bone/10 pt-8">
          <p className="text-base leading-relaxed text-silver">{product.description}</p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="label-wide mb-3 text-smoke">Details</dt>
              <dd>
                <ul className="space-y-2">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3 text-sm text-silver">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-lime" />
                      {d}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="space-y-6">
              <div>
                <dt className="label-wide mb-3 text-smoke">Fit</dt>
                <dd className="text-sm leading-relaxed text-silver">{product.fit}</dd>
              </div>
              <div>
                <dt className="label-wide mb-3 text-smoke">Composition</dt>
                <dd className="text-sm leading-relaxed text-silver">{product.composition}</dd>
              </div>
            </div>
          </dl>
        </div>

        {compact && (
          <Link
            href={`/product/${product.slug}`}
            className="label mt-10 inline-flex w-fit items-center gap-2 border-b border-lime/40 pb-2 text-lime transition-colors hover:border-lime"
          >
            Open the full product page
          </Link>
        )}
      </div>
    </div>
  );
}
