/**
 * Clothsomnia catalog.
 * Static, typed, and shaped like a real commerce payload so this layer can be
 * swapped for a Shopify / commerce API response without touching the UI.
 */

export type Tone = "violet" | "cobalt" | "magenta" | "lime" | "silver" | "navy";

export type CategoryId = "unisex" | "men" | "girls" | "sport" | "school";

export type ColorOption = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  /** Editorial one-liner shown under the name on the card. */
  line: string;
  price: number; // minor units
  compareAt?: number;
  category: CategoryId;
  tone: Tone;
  badge?: string;
  colors: ColorOption[];
  sizes: string[];
  /** Sizes with no stock — rendered struck-through, not hidden. */
  soldOut?: string[];
  description: string;
  details: string[];
  fit: string;
  composition: string;
};

const VOID: ColorOption = { name: "Void", hex: "#0B0C10" };
const ASH: ColorOption = { name: "Ash", hex: "#3A3D46" };
const BONE: ColorOption = { name: "Bone", hex: "#EDEAE4" };
const ULTRA: ColorOption = { name: "Ultraviolet", hex: "#7C3BFF" };
const COBALT: ColorOption = { name: "Cobalt", hex: "#1B3BFF" };
const SIGNAL: ColorOption = { name: "Signal", hex: "#FF2FA0" };
const ACID: ColorOption = { name: "Acid", hex: "#C6FF3D" };
const SILVER: ColorOption = { name: "Silver", hex: "#C9D2E3" };
const MIDNIGHT: ColorOption = { name: "Midnight", hex: "#0A1030" };

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];

export const PRODUCTS: Product[] = [
  {
    slug: "nocturne-trench",
    name: "Nocturne Trench",
    line: "Weatherproof shell for the long way home",
    price: 48000,
    category: "unisex",
    tone: "violet",
    badge: "Tonight's drop",
    colors: [VOID, ULTRA, ASH],
    sizes: APPAREL,
    soldOut: ["XS"],
    description:
      "Cut long and loose enough to move like weather. A bonded technical shell with a storm placket that seals to the throat, and a dropped shoulder that lets the whole thing swing when you walk fast. Designed for the walk between the last place and the next one.",
    details: [
      "Bonded 3-layer technical shell, fully taped seams",
      "Storm placket with concealed magnetic closure",
      "Dropped shoulder, oversized volume through the body",
      "Reflective interior facing — visible only in motion",
    ],
    fit: "Oversized. Sized to layer. Take your usual size for volume, one down for a cleaner line.",
    composition: "72% recycled polyamide, 28% polyurethane membrane. Made in Portugal.",
  },
  {
    slug: "static-hoodie",
    name: "Static Hoodie",
    line: "Heavyweight fleece, distorted print",
    price: 16500,
    category: "unisex",
    tone: "silver",
    badge: "Bestseller",
    colors: [VOID, ASH, SIGNAL],
    sizes: APPAREL,
    description:
      "660gsm loopback fleece, garment-dyed until the black goes soft. The chest graphic is a screen-burn of the wordmark, printed slightly out of register on purpose — no two land the same way.",
    details: [
      "660gsm Japanese loopback cotton fleece",
      "Garment-dyed and enzyme-washed for a broken-in hand",
      "Off-register discharge print — each piece varies",
      "Double-lined hood, ribbed cuff and hem",
    ],
    fit: "Boxy, true to size. Cropped slightly at the hem.",
    composition: "100% organic cotton. Woven in Japan, cut and sewn in Portugal.",
  },
  {
    slug: "three-am-cargo",
    name: "3AM Cargo",
    line: "Eleven pockets. No explanation.",
    price: 21000,
    category: "men",
    tone: "lime",
    colors: [VOID, ASH, MIDNIGHT],
    sizes: ["28", "30", "32", "34", "36", "38"],
    soldOut: ["38"],
    description:
      "A wide-leg cargo built on a military pattern and then argued with. Pockets sit where you actually reach, the hem breaks hard over the shoe, and a drawcord at the ankle lets you shut the whole silhouette down in one pull.",
    details: [
      "Ripstop cotton twill, garment-washed",
      "Eleven pockets — six accessible while seated",
      "Articulated knee, gusseted crotch",
      "Ankle drawcord with cord lock",
    ],
    fit: "Wide leg, mid rise. Take your true waist.",
    composition: "98% organic cotton ripstop, 2% elastane.",
  },
  {
    slug: "dream-armor-bomber",
    name: "Dream Armor Bomber",
    line: "Quilted, iridescent, faintly ridiculous",
    price: 39500,
    compareAt: 45000,
    category: "unisex",
    tone: "cobalt",
    badge: "Archive price",
    colors: [MIDNIGHT, ULTRA, SILVER],
    sizes: APPAREL,
    description:
      "Channel-quilted and coated in a dichroic film that shifts violet to cobalt depending on where the light is standing. Padded enough to feel like protection. Light enough to forget you're wearing it.",
    details: [
      "Dichroic-coated nylon, colour shifts with angle",
      "Channel quilting with recycled down-alternative fill",
      "Ribbed collar, cuff and hem in tonal knit",
      "Two-way zip with moulded pulls",
    ],
    fit: "Relaxed, slightly cropped. True to size.",
    composition: "Shell 100% recycled nylon. Fill 100% recycled polyester.",
  },
  {
    slug: "late-light-slip",
    name: "Late Light Slip",
    line: "Bias-cut satin that catches every streetlamp",
    price: 24000,
    category: "girls",
    tone: "magenta",
    badge: "Tonight's drop",
    colors: [VOID, SIGNAL, SILVER],
    sizes: APPAREL,
    soldOut: ["XXL"],
    description:
      "Cut on the true bias so it falls without arguing. The satin is heavy — it moves in one piece rather than fluttering — and the adjustable strap means you can wear it at the shoulder or let it drop.",
    details: [
      "True bias cut, heavyweight satin",
      "Adjustable slider straps",
      "French seams throughout, no visible finish",
      "Side split to mid-thigh",
    ],
    fit: "Close through the body, fluid below the hip. Size up for a looser drape.",
    composition: "100% cupro satin. OEKO-TEX certified.",
  },
  {
    slug: "afterhours-coat",
    name: "Afterhours Coat",
    line: "Tailoring with the lights off",
    price: 62000,
    category: "men",
    tone: "navy",
    colors: [MIDNIGHT, VOID, ASH],
    sizes: APPAREL,
    description:
      "A double-faced wool overcoat with no lining, no padding, and nothing to hide behind. Hand-finished edges, a single closure, and a lapel wide enough to matter. The most serious thing we make.",
    details: [
      "Double-faced Italian wool, unlined construction",
      "Hand-finished edge seams",
      "Single horn closure, concealed inner hook",
      "Full-length, breaks at the ankle",
    ],
    fit: "Straight, generous. Room for a knit underneath.",
    composition: "88% virgin wool, 12% cashmere. Milled in Biella.",
  },
  {
    slug: "pulse-track-set",
    name: "Pulse Track Set",
    line: "Warm-up gear for a race nobody called",
    price: 18500,
    category: "sport",
    tone: "lime",
    badge: "Set",
    colors: [VOID, ACID, COBALT],
    sizes: APPAREL,
    description:
      "Full tricot set — jacket and pant, sold together. Piping runs acid lime down the outseam and stops short of the ankle, which is the sort of thing you only notice on the second look.",
    details: [
      "Recycled tricot with a dry hand",
      "Contrast piping, outseam to mid-calf",
      "Zip pockets, both pieces",
      "Sold as a set — jacket and pant",
    ],
    fit: "Relaxed athletic. True to size.",
    composition: "100% recycled polyester tricot.",
  },
  {
    slug: "sleepwalk-knit",
    name: "Sleepwalk Knit",
    line: "Merino, oversized, unreasonably soft",
    price: 19500,
    category: "unisex",
    tone: "silver",
    colors: [BONE, ASH, MIDNIGHT],
    sizes: APPAREL,
    description:
      "A 7-gauge merino crew knit big enough to disappear into. Shoulders sit halfway down the arm, the body skims, and the sleeves are long on purpose so you can pull them over your hands.",
    details: [
      "7-gauge extra-fine merino",
      "Drop shoulder, extended sleeve",
      "Fully fashioned — knitted to shape, not cut",
      "Mulesing-free wool",
    ],
    fit: "Oversized. Size down for a standard fit.",
    composition: "100% extra-fine merino wool.",
  },
  {
    slug: "halo-pleat-skirt",
    name: "Halo Pleat Skirt",
    line: "Permanent pleats, impermanent plans",
    price: 16000,
    category: "girls",
    tone: "violet",
    colors: [VOID, ULTRA, SILVER],
    sizes: APPAREL,
    description:
      "Heat-set micro-pleats that hold their shape through everything. The waistband sits high and flat, and the hem lands just below the knee — long enough to swing, short enough to move in.",
    details: [
      "Permanent heat-set micro-pleat",
      "High flat waistband, concealed zip",
      "Below-knee length",
      "Machine washable — pleats do not drop",
    ],
    fit: "High waist, full sweep. True to size.",
    composition: "100% recycled polyester.",
  },
  {
    slug: "blackout-denim",
    name: "Blackout Denim",
    line: "Raw, rigid, dyed twice",
    price: 23000,
    category: "men",
    tone: "cobalt",
    colors: [VOID, MIDNIGHT, ASH],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "14oz Japanese selvedge, overdyed black on black so the fade comes up grey instead of blue. Rigid at first — it will take about three weeks to become yours, and then it will only be yours.",
    details: [
      "14oz Japanese selvedge denim",
      "Overdyed twice — black warp, black weft",
      "Straight leg, mid rise",
      "Raw. Expect shrinkage on first wash.",
    ],
    fit: "Straight. Size up one if you prefer room through the thigh.",
    composition: "100% cotton selvedge denim. Woven in Okayama.",
  },
  {
    slug: "velocity-windrunner",
    name: "Velocity Windrunner",
    line: "Packs into its own pocket",
    price: 17500,
    category: "sport",
    tone: "magenta",
    colors: [VOID, SIGNAL, SILVER],
    sizes: APPAREL,
    description:
      "A 90-gram ripstop shell that folds down to the size of a fist. Fully seam-sealed, reflective across the shoulder blades, and cut long at the back so it stays put when you're moving.",
    details: [
      "90g/m² ripstop, seam-sealed",
      "Packs into its own left-hand pocket",
      "Reflective shoulder panel",
      "Dropped back hem",
    ],
    fit: "Athletic, layerable. True to size.",
    composition: "100% recycled ripstop nylon, PFC-free DWR.",
  },
  {
    slug: "recess-oxford",
    name: "Recess Oxford",
    line: "The uniform shirt, quietly rebuilt",
    price: 12000,
    category: "school",
    tone: "silver",
    colors: [BONE, SILVER, MIDNIGHT],
    sizes: APPAREL,
    description:
      "Oxford cloth, unlined collar, and a slightly longer body so it works tucked or out. Built to survive a full week and a wash, which is more than most uniform shirts can say.",
    details: [
      "Heavyweight oxford cloth, sanforised",
      "Unlined soft collar, no fusing",
      "Extended body — wears tucked or loose",
      "Reinforced side gussets",
    ],
    fit: "Relaxed. True to size.",
    composition: "100% organic cotton oxford.",
  },
  {
    slug: "detention-blazer",
    name: "Detention Blazer",
    line: "Structured shoulder, zero obedience",
    price: 28500,
    category: "school",
    tone: "violet",
    badge: "New",
    colors: [MIDNIGHT, VOID, ULTRA],
    sizes: APPAREL,
    description:
      "A schoolwear silhouette with the volume turned up — wider shoulder, longer body, and an interior lining printed with the manifesto in full. Nobody sees it but you, which is the point.",
    details: [
      "Structured shoulder, half-canvas front",
      "Printed manifesto lining",
      "Three-patch pocket configuration",
      "Tonal horn buttons",
    ],
    fit: "Long and squared. Take your usual size.",
    composition: "Shell 62% wool, 38% recycled polyester. Lining 100% viscose.",
  },
  {
    slug: "second-wind-legging",
    name: "Second Wind Legging",
    line: "Compression that behaves",
    price: 9500,
    category: "sport",
    tone: "cobalt",
    colors: [VOID, MIDNIGHT, ULTRA],
    sizes: APPAREL,
    description:
      "High-rise, squat-proof, and bonded rather than stitched down the outseam so there's nothing to rub. The waistband holds without digging — the only thing we tested more than the fabric.",
    details: [
      "Four-way stretch, opaque under load",
      "Bonded outseam — no stitching against the skin",
      "Hidden waistband pocket",
      "High rise, full length",
    ],
    fit: "Compressive. True to size.",
    composition: "76% recycled polyamide, 24% elastane.",
  },
  {
    slug: "curfew-cardigan",
    name: "Curfew Cardigan",
    line: "Grandpa knit, night shift",
    price: 21500,
    category: "unisex",
    tone: "navy",
    colors: [MIDNIGHT, ASH, BONE],
    sizes: APPAREL,
    description:
      "Chunky 5-gauge with a shawl collar heavy enough to stand up on its own. Deep patch pockets, real horn buttons, and enough length to sit down in without it riding up.",
    details: [
      "5-gauge lambswool, chunky hand",
      "Shawl collar, doubled and pressed",
      "Deep patch pockets",
      "Genuine horn buttons",
    ],
    fit: "Oversized, long. Size down for a closer fit.",
    composition: "100% lambswool.",
  },
  {
    slug: "moonlit-mesh-top",
    name: "Moonlit Mesh Top",
    line: "Second skin with a light leak",
    price: 11500,
    category: "girls",
    tone: "magenta",
    colors: [VOID, SIGNAL, ULTRA],
    sizes: APPAREL,
    description:
      "A fine-gauge mesh long sleeve that reads solid at distance and translucent up close. Layer it, or don't. Cut long in the sleeve with a thumbhole finish.",
    details: [
      "Fine-gauge power mesh",
      "Thumbhole cuff",
      "Bonded neckline, no visible seam",
      "Layering piece — semi-sheer",
    ],
    fit: "Body-skimming. True to size.",
    composition: "88% recycled polyamide, 12% elastane.",
  },
];

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  unisex: "Unisex",
  men: "Men",
  girls: "Girls",
  sport: "Sport",
  school: "School",
};

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsIn(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** The 8 pieces surfaced in the homepage drop. */
export const NEW_DROP: Product[] = [
  "nocturne-trench",
  "static-hoodie",
  "late-light-slip",
  "dream-armor-bomber",
  "three-am-cargo",
  "halo-pleat-skirt",
  "pulse-track-set",
  "sleepwalk-knit",
]
  .map((s) => getProduct(s))
  .filter((p): p is Product => Boolean(p));

export function relatedTo(product: Product, count = 4): Product[] {
  const sameWorld = PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  );
  const rest = PRODUCTS.filter((p) => p.slug !== product.slug && p.category !== product.category);
  return [...sameWorld, ...rest].slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.line, p.category, CATEGORY_LABEL[p.category], ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  ).slice(0, 6);
}
