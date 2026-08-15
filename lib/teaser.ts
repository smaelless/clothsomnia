/**
 * TEASER MODE
 *
 * The store is not launching yet, so every campaign image is blurred and
 * carries a line of copy instead of showing the product. Flip the flag to
 * false on launch day and every plate reveals its photograph — nothing else
 * needs to change.
 */
export const TEASER_MODE = true;

/** Blur strength, in px. Higher = less of the garment readable. */
export const TEASER_BLUR = 18;

/** One line per plate, assigned deterministically from the plate's seed. */
export const TEASER_CAPTIONS = [
  "Wear what they'll remember.",
  "Look like you mean it.",
  "Don't dress to fit in.",
  "Not for everyone. For you.",
  "Your new obsession.",
  "Be the reference.",
  "Wear the difference.",
  "Rare by design.",
  "Wear it once, they talk about it saison kamla.",
  "Dress like you already made it.",
  "The seam does the talking. Nta ghir lbess.",
];

