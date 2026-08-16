import { PRELAUNCH_LABEL, isPreLaunch, preLaunchPrice } from "./pricing";

/**
 * OFFERS — the shared, pure half.
 *
 * Types and arithmetic only, safe in the browser. Everything that reads the
 * database lives in offers-data.ts, because the coupon table must never be
 * reachable from the client: a coupon list the browser can fetch is a coupon
 * list every visitor can enumerate.
 */

export type OfferKind = "percent" | "amount";

export type Rule = {
  kind: OfferKind;
  /** percent: 1-90. amount: centimes. */
  value: number;
  label: string;
};

/** What a piece costs, and what it would have cost. */
export type Priced = { list: number; price: number; label: string | null };

/** slug -> price. Products with no offer are still listed, at list price. */
export type PriceMap = Record<string, Priced>;

/** Never below 1 DH, and never above the original. */
export function applyRule(price: number, rule: Rule): number {
  const off = rule.kind === "percent" ? (price * rule.value) / 100 : rule.value;
  // Rounded to whole dirhams for the same reason the pre-launch offer is:
  // this is paid in cash, at a door, by someone counting notes.
  const next = Math.round((price - off) / 100) * 100;
  return Math.min(price, Math.max(100, next));
}

/**
 * The best price among every rule that applies, including the built-in
 * pre-launch offer.
 *
 * Rules are not stacked. Two overlapping discounts that multiply are how a
 * shop accidentally sells at a quarter of list — the shopper gets whichever
 * single rule is kindest, which is both predictable and safe.
 */
export function bestPrice(list: number, rules: Rule[], now?: number): Priced {
  let price = list;
  let label: string | null = null;

  if (isPreLaunch(now)) {
    price = preLaunchPrice(list);
    label = `${PRELAUNCH_LABEL} off before the drop`;
  }

  for (const rule of rules) {
    const candidate = applyRule(list, rule);
    if (candidate < price) {
      price = candidate;
      label = rule.label;
    }
  }

  return { list, price, label: price < list ? label : null };
}

/** Look a slug up, falling back to list price when the map has not loaded. */
export function priceOf(map: PriceMap | null, slug: string, list: number): Priced {
  return map?.[slug] ?? { list, price: list, label: null };
}

/* ------------------------------------------------------------------ *
 * Coupons
 * ------------------------------------------------------------------ */

export type Coupon = {
  code: string;
  kind: OfferKind;
  value: number;
  minSubtotal: number;
};

/**
 * What a coupon takes off a subtotal that has already had item discounts
 * applied. Never more than the subtotal itself — a 500 DH coupon on a 271 DH
 * bag makes the order free, not negative.
 */
export function couponDiscount(subtotal: number, coupon: Coupon): number {
  const raw = coupon.kind === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  const rounded = Math.round(raw / 100) * 100;
  return Math.max(0, Math.min(subtotal, rounded));
}

export function normaliseCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
