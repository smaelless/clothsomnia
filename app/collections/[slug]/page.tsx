import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivateList } from "@/components/home/private-list";
import { PageHero } from "@/components/ui/page-hero";
import { ProductGrid } from "@/components/collection/product-grid";
import { CATEGORY_LABEL, PRODUCTS, productsIn, type CategoryId } from "@/lib/catalog";
import { getWorld, WORLDS } from "@/lib/worlds";

type Params = { params: Promise<{ slug: string }> };

/** `new` is a curated view across every world; the rest are category worlds. */
export function generateStaticParams() {
  return [{ slug: "new" }, ...WORLDS.map((w) => ({ slug: w.id }))];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "new") {
    return {
      title: "Tonight's drop",
      description: "The after-hours collection, released at midnight and never restocked.",
    };
  }
  const world = getWorld(slug);
  if (!world) return { title: "Collection" };
  return {
    title: `${world.title} — ${world.atmosphere}`,
    description: world.copy,
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;

  if (slug === "new") {
    return (
      <>
        <PageHero
          label="Chapter 01 — After Hours"
          lines={["Tonight's drop", "in full"]}
          copy="Forty-one pieces across five worlds, released at midnight. Cut in small runs, produced in Portugal and Japan, and never restocked once a size is gone."
          tone="violet"
          seed="collection-new"
          meta={[
            { k: "Pieces", v: String(PRODUCTS.length) },
            { k: "Released", v: "00:00 CET" },
            { k: "Restock", v: "Never" },
          ]}
        />
        <ProductGrid products={PRODUCTS} />
        <PrivateList />
      </>
    );
  }

  const world = getWorld(slug);
  if (!world) notFound();

  const products = productsIn(world.id as CategoryId);

  return (
    <>
      <PageHero
        label={`World — ${world.atmosphere}`}
        lines={[world.title, "after dark"]}
        copy={world.copy}
        tone={world.tone}
        seed={`collection-${world.id}`}
        meta={[
          { k: "Pieces", v: String(products.length) },
          { k: "Coordinates", v: world.coords },
          { k: "Hours", v: world.hours },
        ]}
      />
      <ProductGrid products={products} emptyLabel={CATEGORY_LABEL[world.id]} />
      <PrivateList />
    </>
  );
}
