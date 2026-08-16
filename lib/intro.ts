/**
 * INTRO CONFIG
 *
 * The opening used to be one of four interchangeable sequences, chosen here.
 * They were merged into a single screen — components/chrome/intro/intro-door —
 * that both loads and lets the visitor in, so there is nothing left to choose
 * between. The alternatives are in the history if a different opening is ever
 * wanted.
 */

/**
 * Set when the visitor presses Enter, not when the screen appears — someone who
 * closed the tab on the door has not been in yet, and should meet it again
 * rather than land inside a site whose music never started.
 */
export const INTRO_ENTERED_KEY = "clothsomnia.intro.entered";

/**
 * Will this page load show the door?
 *
 * The soundtrack needs the same answer the intro reaches, because the two
 * behave in opposite ways: when there is a door, Enter is the only thing that
 * may start the music, and nothing else on the page should. When there is no
 * door — a reduced-motion visitor, or someone who already came in this session
 * and reloaded — the music has no other way to begin, so it falls back to
 * starting on the first interaction.
 *
 * Kept here so the two cannot disagree.
 */
export function doorWillShow(reduced: boolean): boolean {
  if (reduced) return false;
  if (process.env.NODE_ENV !== "production") return true;
  try {
    return window.sessionStorage.getItem(INTRO_ENTERED_KEY) !== "1";
  } catch {
    return true;
  }
}
