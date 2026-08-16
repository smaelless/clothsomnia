/**
 * PRICING — the pre-launch offer.
 *
 * Fifteen percent off for anyone who orders before Chapter 1 opens. One module
 * so the shop, the bag, the order API and the Telegram message all quote the
 * same number: a discount that lives in two places is a discount that will
 * eventually disagree with itself, and the half a customer sees is not the half
 * that decides what they pay.
 *
 * Client-safe on purpose — the bag needs it in the browser — but the browser's
 * answer is never trusted. validateOrder recomputes every price on the server
 * before an order is saved.
 */

/** Chapter 1 opens. Morocco is UTC+1. */
export const LAUNCH_AT = new Date("2026-09-27T00:00:00+01:00");

export const PRELAUNCH_RATE = 0.15;

/** "15%", for copy — so the number in the sentence cannot drift from the maths. */
export const PRELAUNCH_LABEL = `${Math.round(PRELAUNCH_RATE * 100)}%`;

export function isPreLaunch(now: number = Date.now()): boolean {
  return now < LAUNCH_AT.getTime();
}

/**
 * Rounded to whole dirhams. 319 less 15% is 271,15 — a price nobody can pay in
 * cash at their front door, and one the site would round to "271 DH" on screen
 * while the courier asked for something else. Rounded here instead, once, so
 * the displayed price is the price.
 */
export function preLaunchPrice(price: number): number {
  return Math.round((price * (1 - PRELAUNCH_RATE)) / 100) * 100;
}

/** What a piece costs right now. */
export function unitPrice(price: number, now?: number): number {
  return isPreLaunch(now) ? preLaunchPrice(price) : price;
}
