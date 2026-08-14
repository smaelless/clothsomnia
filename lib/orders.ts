import { createClient } from "@supabase/supabase-js";
import { getProduct, stockFor } from "./catalog";

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
};

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
    unitPrice: number;
    lineTotal: number;
  }[];
  itemCount: number;
  subtotal: number;
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
 */
export function validateOrder(input: OrderInput): ValidationResult {
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
  for (const line of items) {
    const product = getProduct(line.slug);
    if (!product) {
      errors.items = "One of the pieces is no longer available.";
      break;
    }
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 10) {
      errors.items = "Quantity must be between 1 and 10.";
      break;
    }
    const available = stockFor(line.color, line.size);
    if (available <= 0) {
      errors.items = `${product.name} in ${line.color}, size ${line.size} just sold out.`;
      break;
    }
    if (qty > available) {
      errors.items = `Only ${available} left in ${line.size}.`;
      break;
    }
    lines.push({
      slug: product.slug,
      name: product.name,
      colour: line.color,
      size: line.size,
      qty,
      unitPrice: product.price,
      lineTotal: product.price * qty,
    });
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
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
      subtotal,
      shipping,
      total: subtotal + shipping,
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
      subtotal: order.subtotal,
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
