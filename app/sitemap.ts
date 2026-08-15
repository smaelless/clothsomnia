import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/catalog";

const BASE = "https://clothsomnia.com";

/**
 * Only the pages worth indexing. The wishlist is per-device and the intro lab
 * is internal, so neither belongs here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE}/collections/new`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${BASE}/lookbook`, lastModified: now, priority: 0.6 },
    { url: `${BASE}/about`, lastModified: now, priority: 0.5 },
    { url: `${BASE}/shipping`, lastModified: now, priority: 0.4 },
    { url: `${BASE}/returns`, lastModified: now, priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, priority: 0.4 },
    // Both colourways share one product page, so de-duplicate before listing —
    // a sitemap that repeats a URL is a sitemap search engines distrust.
    ...Array.from(new Set(PRODUCTS.map((p) => p.pdpSlug))).map((slug) => ({
      url: `${BASE}/product/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
