import { WHATSAPP_COMMUNITY } from "./policies";

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
  { label: "New Drop", href: "/collections/new", note: "Chapter 1" },
  { label: "Lookbook", href: "/lookbook", note: "12 frames" },
  { label: "Wishlist", href: "/wishlist", note: "Saved" },
  { label: "About", href: "/about", note: "The sleepless" },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Chapter 1", href: "/collections/new" },
      { label: "Dreams Hoodie", href: "/product/dreams-hoodie" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns & exchanges", href: "/returns" },
      { label: "Size guide", href: "/product/dreams-hoodie" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "About", href: "/about" },
      { label: "The after-hours list", href: "/about" },
    ],
  },
];

/**
 * Only accounts that exist.
 *
 * These were four links to the logged-out homepages of Instagram, TikTok,
 * Pinterest and YouTube — a visitor clicking "Instagram" in the footer landed
 * on Instagram's front door, not on Clothsomnia. A social link that goes
 * nowhere is worse than no social link, so the ones without an account are
 * gone until there is something to point at.
 */
export const SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/clothsomnia/" },
  { label: "WhatsApp", href: WHATSAPP_COMMUNITY, note: "Community" },
];
