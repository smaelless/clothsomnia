export type NavLink = { label: string; href: string; note?: string };

/**
 * Desktop header — deliberately short. The five category worlds are one tap
 * away in the mobile menu, the footer, and the Collection Worlds section, so
 * keeping them out of the top bar buys clarity without costing reach.
 */
export const HEADER_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "New Drop", href: "/collections/new" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

/** Primary navigation — shared by the header, the mobile tunnel and the footer. */
export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/", note: "Enter" },
  { label: "New Drop", href: "/collections/new", note: "Tonight" },
  { label: "Unisex", href: "/collections/unisex", note: "No gate" },
  { label: "Men", href: "/collections/men", note: "Hard tailoring" },
  { label: "Girls", href: "/collections/girls", note: "Light leak" },
  { label: "Sport", href: "/collections/sport", note: "Full speed" },
  { label: "School", href: "/collections/school", note: "Soft rebellion" },
  { label: "Lookbook", href: "/lookbook", note: "24 frames" },
  { label: "About", href: "/about", note: "The sleepless" },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New Drop", href: "/collections/new" },
      { label: "Unisex", href: "/collections/unisex" },
      { label: "Men", href: "/collections/men" },
      { label: "Girls", href: "/collections/girls" },
      { label: "Sport", href: "/collections/sport" },
      { label: "School", href: "/collections/school" },
    ],
  },
  {
    title: "World",
    links: [
      { label: "Lookbook", href: "/lookbook" },
      { label: "About", href: "/about" },
      { label: "Runway archive", href: "/lookbook" },
      { label: "Stockists", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/about" },
      { label: "Returns & exchanges", href: "/about" },
      { label: "Size guide", href: "/about" },
      { label: "Care", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/about" },
      { label: "Privacy", href: "/about" },
      { label: "Cookies", href: "/about" },
      { label: "Accessibility", href: "/about" },
    ],
  },
];

export const SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "YouTube", href: "https://youtube.com" },
];
