/**
 * INTRO CONFIG
 *
 * Four self-contained opening sequences. Change `INTRO_VARIANT` below to set
 * the one the live site uses — that single line is the only edit required.
 * Compare them side by side at /intro-lab.
 */

export const INTRO_VARIANTS = ["slats", "blink", "iris", "typesweep"] as const;

export type IntroVariant = (typeof INTRO_VARIANTS)[number];

/** ← The live intro. Change this one value. */
export const INTRO_VARIANT: IntroVariant = "slats";

export const INTRO_META: Record<
  IntroVariant,
  { name: string; idea: string; feel: string; duration: string }
> = {
  slats: {
    name: "Runway Slats",
    idea: "Seven black light-bars lift off the stage one after another, the way a runway rig clears before a show.",
    feel: "Fashion week. Architectural, confident, fast.",
    duration: "≈2.2s",
  },
  blink: {
    name: "The Blink",
    idea: "The screen blinks — closes, opens, closes, opens — like an eye that will not stay shut. The literal reading of the brand name.",
    feel: "Strange, human, unmistakably Clothsomnia.",
    duration: "≈2.6s",
  },
  iris: {
    name: "Iris Close",
    idea: "A camera aperture collapses to a point, pulling the black away from the centre and leaving the hero behind it.",
    feel: "Cinematic. The first frame of a film.",
    duration: "≈1.9s",
  },
  typesweep: {
    name: "Type Split",
    idea: "An acid scan line passes over the wordmark and inverts it, then the whole screen tears down the middle and slides apart.",
    feel: "Graphic, kinetic, a little violent.",
    duration: "≈2.4s",
  },
};

export const INTRO_SESSION_KEY = "clothsomnia.intro.seen";
