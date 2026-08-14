import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductCard } from "@/components/ui/product-card";
import { CATEGORY_LABEL, PRODUCTS, getProduct, relatedTo } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

/**
 * Both the colourway slugs and the shared product page. `dreams-hoodie` is the
 * URL every card actually links to, and it was missing here — the colourway
 * slugs were generated but the page people land on was not.
 */
export function generateStaticParams() {
  const slugs = new Set(PRODUCTS.flatMap((p) => [p.slug, p.pdpSlug]));
  return Array.from(slugs, (slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: `${product.line}. ${formatPrice(product.price)}.`,
    openGraph: { title: `${product.name} — Clothsomnia`, description: product.line },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedTo(product, 4);

  // Commerce pages earn their structured data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: CATEGORY_LABEL[product.category],
    brand: { "@type": "Brand", name: "Clothsomnia" },
    offers: {
      "@type": "Offer",
      price: (product.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1600px] px-4 pt-8 md:px-8">
        <ol className="flex flex-wrap items-center gap-2">
          {[
            { label: "Home", href: "/" },
            // The category worlds no longer exist as pages — this pointed at
            // /collections/unisex, which is a 404. The drop is the real parent.
            { label: "Chapter 1", href: "/collections/new" },
          ].map((crumb) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                className="label -my-2 inline-flex min-h-11 items-center py-2 text-smoke transition-colors hover:text-lime"
              >
                {crumb.label}
              </Link>
              <span aria-hidden className="text-smoke">
                /
              </span>
            </li>
          ))}
          <li>
            <span aria-current="page" className="label text-silver">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
        <ProductDetail product={product} />
      </div>

      {/* Related */}
      <section className="border-t border-bone/10 py-20" aria-label="Other colourways">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-huge">Also in</h2>
            <Link
              href="/collections/new"
              className="label inline-flex min-h-11 items-center border-b border-lime/40 pb-2 text-lime transition-colors hover:border-lime"
            >
              See the drop
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed current={product.slug} />
    </>
  );
}
