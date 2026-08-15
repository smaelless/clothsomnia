import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Per-device or internal — nothing for a crawler to index.
      disallow: ["/wishlist", "/intro-lab", "/admin", "/checkout"],
    },
    sitemap: "https://clothsomnia.com/sitemap.xml",
  };
}
