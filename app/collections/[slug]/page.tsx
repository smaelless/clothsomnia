import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivateList } from "@/components/home/private-list";
import { PageHero } from "@/components/ui/page-hero";
import { ProductGrid } from "@/components/collection/product-grid";
import { PRODUCTS } from "@/lib/catalog";

type Params = { params: Promise<{ slug: string }> };

/**
 * Chapter 1 has exactly one collection. The five category worlds belonged to
 * the earlier multi-category concept and are no longer destinations, so any
 * other slug is a genuine 404 rather than an empty grid.
 */
export function generateStaticParams() {
  return [{ slug: "new" }];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== "new") return { title: "Not found" };
  return {
    title: "Chapter 1: Dreams",
    description:
      "One oversized hoodie, two colourways. 319 DH, free delivery in Morocco, cash on delivery. Drops 27 September.",
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  if (slug !== "new") notFound();

  return (
    <>
      <PageHero
        label="Chapter 1 — Dreams"
        lines={["Chapter 1", "Dreams"]}
        copy="One oversized hoodie built around a single curved seam, in pine and in wine. Fifty pieces per size, per colour. Nothing restocked."
        tone="pine"
        seed="collection-new"
        meta={[
          { k: "Colourways", v: String(PRODUCTS.length) },
          { k: "Drops", v: "27 September" },
          { k: "Restock", v: "Never" },
        ]}
      />
      <ProductGrid products={PRODUCTS} />
      <PrivateList />
    </>
  );
}
