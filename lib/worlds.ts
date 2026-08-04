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
    tone: "violet",
    coords: "00°00′ N",
    hours: "Open all hours",
  },
  {
    id: "men",
    title: "Men",
    atmosphere: "Hard Tailoring",
    copy: "Structure with the tension left in. Wool that means it, denim that takes a month.",
    tone: "navy",
    coords: "41°23′ N",
    hours: "22:00 — 04:00",
  },
  {
    id: "girls",
    title: "Girls",
    atmosphere: "Light Leak",
    copy: "Bias cuts, pleats that hold, and fabrics that only make sense under a streetlamp.",
    tone: "magenta",
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
    tone: "cobalt",
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
    title: "Dream Armor",
    notes: ["silhouette", "late light", "no exit"],
    caption:
      "Quilted shell over nothing much. Built for the walk from the last place to the next one.",
    tone: "cobalt",
    pieces: ["dream-armor-bomber", "three-am-cargo"],
  },
  {
    id: "look-02",
    index: "02",
    title: "Static Noise",
    notes: ["motion", "static noise", "off register"],
    caption: "Print pulled out of alignment on purpose. Nothing here lines up and nothing should.",
    tone: "silver",
    pieces: ["static-hoodie", "blackout-denim"],
  },
  {
    id: "look-03",
    index: "03",
    title: "After-Hours Uniform",
    notes: ["structure", "curfew", "hard tailoring"],
    caption: "Tailoring with the lights off. The most serious thing we make, worn least seriously.",
    tone: "navy",
    pieces: ["afterhours-coat", "sleepwalk-knit"],
  },
  {
    id: "look-04",
    index: "04",
    title: "Light Leak",
    notes: ["bias cut", "streetlamp", "soft chaos"],
    caption: "Satin that moves in one piece. Every lamp it passes gets its own frame.",
    tone: "magenta",
    pieces: ["late-light-slip", "moonlit-mesh-top"],
  },
  {
    id: "look-05",
    index: "05",
    title: "Second Wind",
    notes: ["velocity", "05:00", "full speed"],
    caption: "For the hour when the night hands over to the morning and neither one admits it.",
    tone: "lime",
    pieces: ["velocity-windrunner", "pulse-track-set"],
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
  { id: "f1", caption: "After midnight", meta: "Frame 01 / 24", tone: "violet", orientation: "tall" },
  {
    id: "f2",
    caption: "Sleep never dressed this well",
    meta: "Frame 04 / 24",
    tone: "magenta",
    orientation: "landscape",
  },
  { id: "f3", caption: "Soft chaos", meta: "Frame 09 / 24", tone: "cobalt", orientation: "portrait" },
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
    tone: "navy",
    orientation: "landscape",
  },
  { id: "f6", caption: "Dress the static", meta: "Frame 22 / 24", tone: "lime", orientation: "tall" },
];
