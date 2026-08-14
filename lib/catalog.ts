/**
 * Clothsomnia catalog — CHAPTER 1: DREAMS
 *
 * One hoodie, two colourways. The two appear as separate cards in the grid,
 * but both link to a single product page where colour is a selector — so the
 * shopper browses colours and buys a product.
 */

export type Tone = "pine" | "wine" | "cream" | "violet" | "cobalt" | "magenta" | "lime" | "silver" | "navy";

export type CategoryId = "unisex" | "men" | "girls" | "sport" | "school";

export type ColorOption = {
  name: string;
  hex: string;
  /** Gallery for this colourway: front, back, both-models. */
  images: [string, string, string];
};

export type Product = {
  slug: string;
  /** Where the card links. Both colourways point at the shared product page. */
  pdpSlug: string;
  name: string;
  /** Colourway label shown on the card. Empty on the merged product page entry. */
  colourway?: string;
  line: string;
  price: number; // minor units — centimes
  compareAt?: number;
  category: CategoryId;
  tone: Tone;
  badge?: string;
  colors: ColorOption[];
  sizes: string[];
  soldOut?: string[];
  description: string;
  details: string[];
  fit: string;
  composition: string;
};

export const PINE: ColorOption = {
  name: "Pine",
  hex: "#1F4C46",
  images: ["/chapter1/pine-front.jpg", "/chapter1/pine-back.jpg", "/chapter1/pine-pair.jpg"],
};

export const WINE: ColorOption = {
  name: "Wine",
  hex: "#5C1F2B",
  images: ["/chapter1/wine-front.jpg", "/chapter1/wine-three.jpg", "/chapter1/wine-full.jpg"],
};

const PRICE = 31900; // 319,00 MAD
const SIZES = ["S", "M", "L"];

const DESCRIPTION =
  "A heavyweight oversized hoodie built around one curved seam. The cream panel sweeps from the shoulder through the sleeve and down the side, so the shape reads different from every angle — the front is calm, the back is the whole idea. Boxy through the body, dropped at the shoulder, ribbed hard at the cuff and hem so the volume holds instead of collapsing.";

const DETAILS = [
  "Heavyweight brushed fleece, soft inside, dense enough to hold its shape",
  "Curved colour-block panel, shoulder through sleeve to hem",
  "Dropped shoulder, boxy oversized body",
  "Kangaroo pocket cut into the panel, not stitched on top",
  "Ribbed cuffs and hem in the body colour",
];

const FIT = "Oversized and unisex. True to size for the intended volume; size down for a closer fit.";
const COMPOSITION = "Heavyweight cotton-blend brushed fleece. Chapter 1 production run.";

/** The single product page — carries both colourways. */
const DREAMS_HOODIE: Product = {
  slug: "dreams-hoodie",
  pdpSlug: "dreams-hoodie",
  name: "Dreams Hoodie",
  line: "Chapter 1 — the one that started it",
  price: PRICE,
  category: "unisex",
  tone: "pine",
  badge: "Chapter 1",
  colors: [PINE, WINE],
  sizes: SIZES,
  description: DESCRIPTION,
  details: DETAILS,
  fit: FIT,
  composition: COMPOSITION,
};

/** The two cards shown in every grid. */
export const PRODUCTS: Product[] = [
  {
    ...DREAMS_HOODIE,
    slug: "dreams-hoodie-pine",
    colourway: "Pine",
    tone: "pine",
    colors: [PINE],
    line: "Deep pine green on cream",
  },
  {
    ...DREAMS_HOODIE,
    slug: "dreams-hoodie-wine",
    colourway: "Wine",
    tone: "wine",
    colors: [WINE],
    line: "Burgundy on cream",
  },
];

/** Everything getProduct can resolve, including the merged product page. */
const ALL: Product[] = [DREAMS_HOODIE, ...PRODUCTS];

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  unisex: "Unisex",
  men: "Men",
  girls: "Girls",
  sport: "Sport",
  school: "School",
};

/** 50 pieces per size, per colourway. */
export const STOCK_PER_SIZE = 50;

export function getProduct(slug: string): Product | undefined {
  return ALL.find((p) => p.slug === slug);
}

export function productsIn(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export const NEW_DROP: Product[] = PRODUCTS;

export function relatedTo(product: Product, count = 4): Product[] {
  return PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.line, p.colourway ?? "", p.category, ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  ).slice(0, 6);
}
