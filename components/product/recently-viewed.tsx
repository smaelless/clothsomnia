"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ui/product-card";
import { getProduct, type Product } from "@/lib/catalog";

const KEY = "clothsomnia.viewed.v1";
const MAX = 6;

/**
 * RECENTLY VIEWED — records the current piece, then shows the trail behind it.
 * Renders nothing until there is a real history, so a first-time visitor never
 * sees an empty shelf.
 */
export function RecentlyViewed({ current }: { current: string }) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    let history: string[] = [];
    try {
      const raw = window.localStorage.getItem(KEY);
      history = raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      history = [];
    }

    // Show the trail as it was *before* this visit, then record the visit.
    const trail = history
      .filter((s) => s !== current)
      .map(getProduct)
      .filter((p): p is Product => Boolean(p))
      .slice(0, 4);
    setItems(trail);

    const next = [current, ...history.filter((s) => s !== current)].slice(0, MAX);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the feature simply stays quiet */
    }
  }, [current]);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-bone/10 py-14" aria-label="Recently viewed">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <h2 className="display mb-12 text-huge">Where you&apos;ve been</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
