import { createClient } from "@supabase/supabase-js";
import { getProduct } from "./catalog";
import { priceOf, type PriceMap } from "./offers";
import type { StockMap } from "./stock";

/**
 * ORDER PIPELINE — server only.
 *
 * Nothing here may run in the browser: it holds the Supabase service key,
 * which bypasses row level security. The orders table has RLS on and no
 * policies, so this key is the only way in — and it never leaves the server.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type OrderLineInput = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

export type OrderInput = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: OrderLineInput[];
  coupon?: string;
};

/** A coupon the server has already checked. Never taken from the request. */
export type AppliedCoupon = { id: string; code: string; discount: number };

export type ValidationResult =
  | { ok: true; value: NormalisedOrder }
  | { ok: false; errors: Record<string, string> };

export type NormalisedOrder = {
  reference: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  note: string | null;
  items: {
    slug: string;
    name: string;
    colour: string;
    size: string;
    qty: number;
    /** List price, kept so the saving is still legible in a year. */
    listPrice: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  itemCount: number;
  /** The bag at list price. */
  fullSubtotal: number;
  /** What the item-level offers took off. */
  discount: number;
  /** Subtotal after item offers, before any coupon. */
  subtotal: number;
  couponCode: string | null;
  couponDiscount: number;
  shipping: number;
  total: number;
};

/**
 * Moroccan mobile numbers: 06/07 + 8 digits locally, or +212 with the leading
 * zero dropped. Spaces, dashes and dots are tolerated and stripped.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s.\-()]/g, "");
  const local = digits.match(/^0([67]\d{8})$/);
  if (local) return `+212${local[1]}`;
  const intl = digits.match(/^\+?212([67]\d{8})$/);
  if (intl) return `+212${intl[1]}`;
  return null;
}

/** CLS-XXXXX, uppercase, no ambiguous characters. */
function makeReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY3479";
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CLS-${out}`;
}

/**
 * Everything is re-derived from the catalogue rather than trusted from the
 * request: a client could otherwise post its own prices.
 *
 * `stock` is the live remaining count, passed in rather than read here so this
 * function stays synchronous and testable. It used to consult the catalogue's
 * constant map, which said fifty of everything for ever — meaning a size could
 * be oversold indefinitely and no one would find out until the pieces ran out
 * in the flat.
 */
export function validateOrder(
  input: OrderInput,
  stock: StockMap,
  prices: PriceMap,
  coupon: AppliedCoupon | null = null,
): ValidationResult {
  const errors: Record<string, string> = {};

  const fullName = (input.fullName ?? "").trim();
  if (fullName.length < 3) errors.fullName = "Please enter your full name.";

  const phone = normalisePhone(input.phone ?? "");
  if (!phone) errors.phone = "Enter a Moroccan mobile number, e.g. 06 12 34 56 78.";

  const city = (input.city ?? "").trim();
  if (city.length < 2) errors.city = "Which city should we deliver to?";

  const address = (input.address ?? "").trim();
  if (address.length < 10) errors.address = "Add a full address — street, building, and any landmark.";

  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) errors.items = "Your bag is empty.";

  const lines: NormalisedOrder["items"] = [];
  // Two lines can name the same colour and size. Counting them together stops
  // a bag of 5 + 5 slipping past a check that only ever saw one line at a time.
  const claimed = new Map<string, number>();

  for (const line of items) {
    const product = getProduct(line.slug);
    if (!product) {
      errors.items = "One of the pieces is no longer available.";
      break;
    }

    // The colour and size have to belong to the piece being bought — otherwise
    // a crafted request could book stock against a colourway it never ordered.
    const colour = product.colors.find((c) => c.name === line.color);
    if (!colour) {
      errors.items = `${product.name} does not come in ${line.color}.`;
      break;
    }
    if (!product.sizes.includes(line.size)) {
      errors.items = `${product.name} does not come in size ${line.size}.`;
      break;
    }

    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 10) {
      errors.items = "Quantity must be between 1 and 10.";
      break;
    }

    const key = `${colour.name}|${line.size}`;
    const available = (stock[key] ?? 0) - (claimed.get(key) ?? 0);
    if (available <= 0) {
      errors.items = `${product.name} in ${colour.name}, size ${line.size} just sold out.`;
      break;
    }
    if (qty > available) {
      errors.items = `Only ${available} left in ${line.size}.`;
      break;
    }
    claimed.set(key, (claimed.get(key) ?? 0) + qty);
    // Priced here, on the server, at the moment of the order, from the offers
    // in the database. Whatever the browser thought the discount was is
    // irrelevant — and a product with no offer falls back to list price rather
    // than to whatever a missing map entry would imply.
    const paid = priceOf(prices, product.slug, product.price).price;
    lines.push({
      slug: product.slug,
      name: product.name,
      colour: colour.name,
      size: line.size,
      qty,
      listPrice: product.price,
      unitPrice: paid,
      lineTotal: paid * qty,
    });
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const fullSubtotal = lines.reduce((sum, l) => sum + l.listPrice * l.qty, 0);
  const shipping = 0; // Free across Morocco.

  return {
    ok: true,
    value: {
      reference: makeReference(),
      fullName,
      phone: phone!,
      city,
      address,
      note: (input.note ?? "").trim() || null,
      items: lines,
      itemCount: lines.reduce((n, l) => n + l.qty, 0),
      fullSubtotal,
      discount: fullSubtotal - subtotal,
      subtotal,
      couponCode: coupon?.code ?? null,
      // Clamped again here even though checkCoupon already clamps it: this is
      // the last point before money is written down.
      couponDiscount: Math.min(coupon?.discount ?? 0, subtotal),
      shipping,
      total: subtotal - Math.min(coupon?.discount ?? 0, subtotal) + shipping,
    },
  };
}

export function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export async function saveOrder(order: NormalisedOrder): Promise<{ id: string }> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("orders")
    .insert({
      reference: order.reference,
      full_name: order.fullName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      note: order.note,
      items: order.items,
      item_count: order.itemCount,
      full_subtotal: order.fullSubtotal,
      discount: order.discount,
      subtotal: order.subtotal,
      coupon_code: order.couponCode,
      coupon_discount: order.couponDiscount,
      shipping: order.shipping,
      total: order.total,
      currency: "MAD",
      payment_method: "cod",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) throw new Error(`Could not save the order: ${error.message}`);
  return { id: data.id as string };
}

/**
 * Telegram notification. Deliberately best-effort: if the bot is misconfigured
 * or Telegram is down, the customer's order is already safely in the database
 * and must not fail because a message did not send.
 */
export async function notifyTelegram(order: NormalisedOrder): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const dh = (c: number) => `${Math.round(c / 100)} DH`;
  const lines = order.items
    .map((l) => `• ${l.name} — ${l.colour}, ${l.size} ×${l.qty} — ${dh(l.lineTotal)}`)
    .join("\n");

  const text = [
    `🖤 *New order* ${order.reference}`,
    "",
    lines,
    "",
    order.discount > 0 ? `~${dh(order.fullSubtotal)}~ — ${dh(order.discount)} off` : null,
    order.couponDiscount > 0
      ? `🎟 ${order.couponCode} — ${dh(order.couponDiscount)} off`
      : null,
    `*Total:* ${dh(order.total)} — cash on delivery`,
    "",
    `👤 ${order.fullName}`,
    `📞 ${order.phone}`,
    `📍 ${order.city} — ${order.address}`,
    order.note ? `📝 ${order.note}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    });

    if (res.ok) return true;

    // Telegram explains itself in the body. Swallowing that made a failure
    // impossible to diagnose, so surface it — the customer still succeeds.
    const detail = await res.text().catch(() => "");
    console.error(`[telegram] ${res.status} ${detail}`);

    // Markdown is strict: one stray *, _, [ or ` in a customer's name or
    // address rejects the whole message. Retry as plain text so a notification
    // is never lost to punctuation someone typed into a form.
    const retry = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!retry.ok) {
      console.error(`[telegram] plain-text retry also failed: ${await retry.text().catch(() => "")}`);
    }
    return retry.ok;
  } catch (err) {
    console.error("[telegram] request threw", err);
    return false;
  }
}
