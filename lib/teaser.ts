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
  "Built to be noticed.",
  "Wear the difference.",
  "Look expensive. Feel untouchable.",
  "Rare by design.",
];

/**
 * The campaign shots. A plate picks one by hashing its seed, so a given
 * product always shows the same photograph while the set stays varied.
 */
export const CAMPAIGN_IMAGES = [
  "/campaign/shot-01.jpg",
  "/campaign/shot-02.jpg",
  "/campaign/shot-03.jpg",
  "/campaign/shot-04.jpg",
  "/campaign/shot-05.jpg",
  "/campaign/shot-06.jpg",
  "/campaign/shot-07.jpg",
  "/campaign/shot-08.jpg",
  "/campaign/shot-09.jpg",
  "/campaign/shot-10.jpg",
  "/campaign/shot-11.jpg",
];
