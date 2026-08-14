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

/** Lookbook gallery — mixed portrait / landscape editorial grid. */
export type Frame = {
  id: string;
  caption: string;
  meta: string;
  tone: Tone;
  orientation: "portrait" | "landscape" | "tall";
};

export const FRAMES: Frame[] = [
  { id: "f1", caption: "After midnight", meta: "Frame 01 / 24", tone: "pine", orientation: "tall" },
  {
    id: "f2",
    caption: "Sleep never dressed this well",
    meta: "Frame 04 / 24",
    tone: "wine",
    orientation: "landscape",
  },
  { id: "f3", caption: "Soft chaos", meta: "Frame 09 / 24", tone: "cream", orientation: "portrait" },
  {
    id: "f4",
    caption: "Last light / first look",
    meta: "Frame 13 / 24",
    tone: "silver",
    orientation: "portrait",
  },
  {
    id: "f5",
    caption: "Made for the hours that don't end",
    meta: "Frame 18 / 24",
    tone: "pine",
    orientation: "landscape",
  },
  { id: "f6", caption: "Dress the static", meta: "Frame 22 / 24", tone: "lime", orientation: "tall" },
];
