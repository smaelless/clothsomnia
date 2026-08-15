/**
 * SHIPPING, RETURNS AND CONTACT
 *
 * Every customer-facing commitment lives here, in one file, so it can be
 * checked and changed without hunting through pages.
 *
 * Anything left as an empty string is simply not rendered. That is deliberate:
 * a shipping page that invents a delivery time is worse than one that stays
 * quiet, because the first thing it does is set an expectation you did not
 * agree to. Fill these in before launch.
 */

export const CONTACT = {
  /** International format, e.g. "+212600000000". Used for the WhatsApp link. */
  whatsapp: "",
  /** Shown as written, e.g. "06 12 34 56 78". */
  phoneDisplay: "",
  email: "",
  /** Handle without the @. */
  instagram: "",
  /** e.g. "Every day, 10:00 — 20:00". */
  hours: "",
};

export const SHIPPING = {
  /** Free everywhere in Morocco — this one is already decided. */
  freeNationwide: true,
  /** e.g. "2 to 4 working days". Leave empty until you know. */
  deliveryTime: "",
  /** e.g. "Within 24 hours of your confirmation call". */
  dispatchTime: "",
  /** Anywhere you cannot deliver. */
  exclusions: "",
  /** Do orders ship outside Morocco? */
  international: false,
};

export const RETURNS = {
  /** e.g. "7 days from delivery". Leave empty until you decide. */
  window: "",
  /** Who pays the return courier: "us" | "customer" | "" */
  whoPays: "" as "us" | "customer" | "",
  /** e.g. "Unworn, with tags, in the original bag." */
  condition: "Unworn, unwashed, with the tags still on.",
  /** Exchanges for a different size? */
  exchanges: true,
};

/** True when there is at least one way for a customer to reach you. */
export const hasContact = Boolean(
  CONTACT.whatsapp || CONTACT.phoneDisplay || CONTACT.email || CONTACT.instagram,
);
