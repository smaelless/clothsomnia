import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PRODUCTS, getProduct } from "./catalog";
import {
  bestPrice,
  couponDiscount,
  normaliseCode,
  type Coupon,
  type OfferKind,
  type PriceMap,
  type Rule,
} from "./offers";

/**
 * OFFERS — everything that touches the database.
 *
 * server-only, because this module can read the coupon table. If the client
 * could import it, every code you ever create would be one fetch away.
 */

export type ProductDiscount = {
  id: string;
  created_at: string;
  slug: string | null;
  kind: OfferKind;
  value: number;
  label: string;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export type CouponRow = {
  id: string;
  created_at: string;
  code: string;
  kind: OfferKind;
  value: number;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  max_uses: number | null;
  used_count: number;
  min_subtotal: number;
};

let cached: SupabaseClient | null = null;

function db(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached ??= createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

/** Within its window and switched on. */
function live(row: { active: boolean; starts_at: string | null; ends_at: string | null }): boolean {
  if (!row.active) return false;
  const now = Date.now();
  if (row.starts_at && Date.parse(row.starts_at) > now) return false;
  if (row.ends_at && Date.parse(row.ends_at) <= now) return false;
  return true;
}

/* ------------------------------------------------------------------ *
 * Product discounts
 * ------------------------------------------------------------------ */

export async function listProductDiscounts(): Promise<ProductDiscount[]> {
  const supabase = db();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_discounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[offers] could not read product discounts", error.message);
    return [];
  }
  return (data ?? []) as ProductDiscount[];
}

/**
 * The price of every product right now.
 *
 * Falls back to list price (plus the built-in pre-launch offer) if the
 * database cannot be reached — deliberately the same choice as stock: a blip
 * should never invent a discount, and never hide one the checkout will honour,
 * because validateOrder recomputes this anyway before saving.
 */
export async function priceMap(): Promise<PriceMap> {
  const discounts = (await listProductDiscounts()).filter(live);

  const map: PriceMap = {};
  for (const product of PRODUCTS) {
    map[product.slug] = pricedFor(product.slug, product.price, discounts);
  }

  // The shared product page slug is not in PRODUCTS but is what the bag stores.
  const shared = getProduct("dreams-hoodie");
  if (shared) map[shared.slug] = pricedFor(shared.slug, shared.price, discounts);

  return map;
}

function pricedFor(slug: string, list: number, discounts: ProductDiscount[]) {
  const rules: Rule[] = discounts
    .filter((d) => d.slug === null || d.slug === slug)
    .map((d) => ({ kind: d.kind, value: d.value, label: d.label }));
  return bestPrice(list, rules);
}

export async function saveProductDiscount(input: {
  id?: string;
  slug: string | null;
  kind: OfferKind;
  value: number;
  label: string;
  active: boolean;
  ends_at: string | null;
}): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");

  const row = {
    slug: input.slug,
    kind: input.kind,
    value: input.value,
    label: input.label,
    active: input.active,
    ends_at: input.ends_at,
    updated_at: new Date().toISOString(),
  };

  const { error } = input.id
    ? await supabase.from("product_discounts").update(row).eq("id", input.id)
    : await supabase.from("product_discounts").insert(row);

  if (error) throw new Error(`Could not save the discount: ${error.message}`);
}

export async function deleteProductDiscount(id: string): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("product_discounts").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the discount: ${error.message}`);
}

/* ------------------------------------------------------------------ *
 * Coupons
 * ------------------------------------------------------------------ */

export async function listCoupons(): Promise<CouponRow[]> {
  const supabase = db();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[offers] could not read coupons", error.message);
    return [];
  }
  return (data ?? []) as CouponRow[];
}

export type CouponCheck =
  | { ok: true; coupon: Coupon; discount: number; id: string }
  | { ok: false; reason: string };

/**
 * Is this code usable on this subtotal, right now?
 *
 * Every failure says only that the code cannot be used, never which rule it
 * broke — "expired" and "not enough in your bag" and "no such code" told apart
 * is a way to probe for real codes.
 */
export async function checkCoupon(rawCode: string, subtotal: number): Promise<CouponCheck> {
  const supabase = db();
  if (!supabase) return { ok: false, reason: "Coupons are unavailable right now." };

  const code = normaliseCode(rawCode);
  if (!code) return { ok: false, reason: "Enter a code." };

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("[offers] coupon lookup failed", error.message);
    return { ok: false, reason: "Could not check that code. Try again." };
  }

  const row = data as CouponRow | null;
  const unusable = { ok: false as const, reason: "That code is not valid." };

  if (!row || !live(row)) return unusable;
  if (row.max_uses !== null && row.used_count >= row.max_uses) return unusable;

  if (subtotal < row.min_subtotal) {
    // The one exception: this is the only failure a shopper can act on, and it
    // reveals nothing about which codes exist, because they already have one.
    return {
      ok: false,
      reason: `This code needs a bag of at least ${Math.round(row.min_subtotal / 100)} DH.`,
    };
  }

  const coupon: Coupon = {
    code: row.code,
    kind: row.kind,
    value: row.value,
    minSubtotal: row.min_subtotal,
  };

  return { ok: true, coupon, discount: couponDiscount(subtotal, coupon), id: row.id };
}

/**
 * Count a use. Called only once an order is safely saved, so a shopper who
 * types a code and abandons the checkout has not burned one of its uses.
 */
export async function recordCouponUse(id: string): Promise<void> {
  const supabase = db();
  if (!supabase) return;
  const { error } = await supabase.rpc("increment_coupon_use", { coupon_id: id });
  if (error) console.error("[offers] could not record coupon use", error.message);
}

export async function saveCoupon(input: {
  id?: string;
  code: string;
  kind: OfferKind;
  value: number;
  active: boolean;
  max_uses: number | null;
  min_subtotal: number;
  ends_at: string | null;
}): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");

  const row = {
    code: normaliseCode(input.code),
    kind: input.kind,
    value: input.value,
    active: input.active,
    max_uses: input.max_uses,
    min_subtotal: input.min_subtotal,
    ends_at: input.ends_at,
    updated_at: new Date().toISOString(),
  };

  const { error } = input.id
    ? await supabase.from("coupons").update(row).eq("id", input.id)
    : await supabase.from("coupons").insert(row);

  if (error) {
    if (error.code === "23505") throw new Error("A coupon with that code already exists.");
    throw new Error(`Could not save the coupon: ${error.message}`);
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the coupon: ${error.message}`);
}
