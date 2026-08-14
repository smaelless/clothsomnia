import type { CategoryId, Tone } from "./catalog";

/** A collection "world" — each category is a place, not a filter. */
export type World = {
  id: CategoryId;
  title: string;
  /** Two-word atmospheric subtitle used on the tile. */
  atmosphere: string;
  copy: string;
  tone: Tone;
  /** Fictional coordinates — printed small on the tile, pure art direction. */
  coords: string;
  hours: string;
};

export const WORLDS: World[] = [
  {
    id: "unisex",
    title: "Unisex",
    atmosphere: "No Gate",
    copy: "The main floor. Volume, weight, and shapes that refuse to answer the question.",
    tone: "pine",
    coords: "00°00′ N",
    hours: "Open all hours",
  },
  {
    id: "men",
    title: "Men",
    atmosphere: "Hard Tailoring",
    copy: "Structure with the tension left in. Wool that means it, denim that takes a month.",
    tone: "pine",
    coords: "41°23′ N",
    hours: "22:00 — 04:00",
  },
  {
    id: "girls",
    title: "Girls",
    atmosphere: "Light Leak",
    copy: "Bias cuts, pleats that hold, and fabrics that only make sense under a streetlamp.",
    tone: "wine",
    coords: "48°51′ N",
    hours: "23:00 — 05:00",
  },
  {
    id: "sport",
    title: "Sport",
    atmosphere: "Full Speed",
    copy: "Built for movement you didn't schedule. Technical, packable, quietly fast.",
    tone: "lime",
    coords: "52°22′ N",
    hours: "05:00 — 07:00",
  },
  {
    id: "school",
    title: "School",
    atmosphere: "Soft Rebellion",
    copy: "Uniform rebuilt from the lining out. Passes inspection. Doesn't mean it.",
    tone: "cream",
    coords: "51°30′ N",
    hours: "08:00 — 15:00",
  },
];

export function getWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

/** The runway sequence — five looks, each with its own layout treatment. */
export type Look = {
  id: string;
  index: string;
  title: string;
  /** Expressive microcopy printed alongside the look. */
  notes: [string, string, string];
  caption: string;
  tone: Tone;
  /** Products worn in this look. */
  pieces: string[];
};

export const LOOKS: Look[] = [
  {
    id: "look-01",
    index: "01",
    title: "Pine",
    notes: ["curved seam", "drop shoulder", "heavyweight"],
    caption:
      "Deep pine on cream. The panel sweeps from the shoulder through the sleeve, so the shape changes with every angle you stand at.",
    tone: "pine",
    pieces: ["dreams-hoodie-pine"],
  },
  {
    id: "look-02",
    index: "02",
    title: "Wine",
    notes: ["burgundy", "oversized", "ribbed hem"],
    caption:
      "The same cut in burgundy. Warmer, louder from across a room, and the one people ask about.",
    tone: "wine",
    pieces: ["dreams-hoodie-wine"],
  },
  {
    id: "look-03",
    index: "03",
    title: "Both ways",
    notes: ["unisex", "front and back", "one cut"],
    caption:
      "Front is calm. Back is the whole idea. Cut the same for everyone — it is the volume that does the work.",
    tone: "cream",
    pieces: ["dreams-hoodie-pine", "dreams-hoodie-wine"],
  },
];

/**
 * LOOKBOOK
 *
 * Real frames, laid out on a twelve column grid. Everything is aligned — the
 * variety comes from scale and from wide detail bands cutting across the
 * portraits, not from tilting or overlapping things.
 *
 * The source photography is all portrait, so the portraits stay portrait; the
 * wide frames are genuine detail crops of the curved seam rather than
 * landscape crops that would slice off heads and hems.
 */
export type Frame = {
  id: string;
  src: string;
  caption: string;
  meta: string;
  /** Column span at lg and up. */
  span: string;
  /** Frame shape. */
  ratio: string;
};

const F = (id: string, src: string, caption: string, meta: string, span: string, ratio: string): Frame =>
  ({ id, src: `/chapter1/${src}.jpg`, caption, meta, span, ratio });

/** The full book. */
export const FRAMES: Frame[] = [
  F('f1','detail-pine-seam','The seam that does the work','01','lg:col-span-12','aspect-[16/6]'),
  F('f2','pine-front','Pine, front','02','lg:col-span-6','aspect-[2/3]'),
  F('f3','pine-back','Pine, back','03','lg:col-span-6','aspect-[2/3]'),
  F('f4','wine-three','After dark, everything sharpens','04','lg:col-span-7','aspect-[4/5]'),
  F('f5','detail-wine-seam','Cream on burgundy','05','lg:col-span-12','aspect-[16/6]'),
  F('f6','wine-full','Wine, full length','06','lg:col-span-4','aspect-[2/3]'),
  F('f7','wine-walk','The long way home','07','lg:col-span-4','aspect-[2/3]'),
  F('f8','wine-front','Wine, front','08','lg:col-span-4','aspect-[2/3]'),
  F('f9','pine-pair','Both ways, pine','09','lg:col-span-6','aspect-[4/5]'),
  F('f10','wine-pair','Both ways, wine','10','lg:col-span-6','aspect-[4/5]'),
  F('f11','detail-back-panel','The back is the whole idea','11','lg:col-span-12','aspect-[16/6]'),
  F('f12','pair-wine','Sleep can wait','12','lg:col-span-8 lg:col-start-3','aspect-[4/5]'),
];

/** A shorter cut for the homepage — the strongest six. */
export const HOME_FRAMES: Frame[] = [
  FRAMES[0], FRAMES[1], FRAMES[2], FRAMES[4], FRAMES[8], FRAMES[9],
];
