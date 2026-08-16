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
