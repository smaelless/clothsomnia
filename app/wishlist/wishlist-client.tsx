"use client";

import Link from "next/link";
import { ActionButton } from "@/components/ui/magnetic";
import { ProductCard } from "@/components/ui/product-card";
import { SectionLabel } from "@/components/ui/wordmark";
import { getProduct, type Product } from "@/lib/catalog";
import { useStore } from "@/providers/store";

/**
 * WISHLIST
 *
 * Reads the same store the heart icons write to. Renders after mount only —
 * the list lives in localStorage, so the server has no idea what is in it and
 * rendering it during hydration would mismatch.
 */
export function WishlistClient() {
  const { wishlist } = useStore();

  const saved = wishlist
    .map(getProduct)
    .filter((p): p is Product => Boolean(p));

  return (
    <section className="py-12 md:py-16" aria-label="Wishlist">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionLabel className="mb-10">
          {saved.length} {saved.length === 1 ? "piece saved" : "pieces saved"}
        </SectionLabel>

        {saved.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border-t border-bone/10 py-14">
            <p className="display max-w-[18ch] text-huge leading-[0.95]">
              Nothing saved yet.
            </p>
            <p className="max-w-[46ch] text-base leading-relaxed text-silver">
              Tap the heart on any piece and it waits here. Your list stays on this device —
              no account, no email, nothing to sign up for.
            </p>
            <ActionButton href="/collections/new">See the drop</ActionButton>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 border-t border-bone/10 pt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saved.map((product, i) => (
                <ProductCard key={product.slug} product={product} index={i} />
              ))}
            </div>

            <p className="mt-10 text-sm text-smoke">
              Saved on this device only.{" "}
              <Link href="/collections/new" className="text-lime underline-offset-4 hover:underline">
                Keep looking
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </section>
  );
}
