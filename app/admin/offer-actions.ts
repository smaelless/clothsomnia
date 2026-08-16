"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { getProduct } from "@/lib/catalog";
import { normaliseCode, type OfferKind } from "@/lib/offers";
import {
  deleteCoupon,
  deleteProductDiscount,
  saveCoupon,
  saveProductDiscount,
} from "@/lib/offers-data";

export type OfferState = { error?: string; ok?: string };

/** Every offer page and the whole shop, since prices are on all of them. */
function refresh() {
  revalidatePath("/admin/offers");
  revalidatePath("/product/[slug]", "page");
  revalidatePath("/collections/[slug]", "page");
  revalidatePath("/");
}

function kindOf(value: unknown): OfferKind | null {
  return value === "percent" || value === "amount" ? value : null;
}

/**
 * Reads a money or percentage field.
 *
 * Percentages are capped at 90: a typo of 100 would make the piece free, and
 * 900 would be caught by the database but only after the form had accepted it.
 * Amounts are entered in dirhams and stored in centimes, like every other price.
 */
function parseValue(kind: OfferKind, raw: string): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (kind === "percent") return n > 90 ? null : Math.round(n);
  return Math.round(n) * 100;
}

/* ---------------- Product discounts ---------------- */

export async function upsertDiscount(_prev: OfferState, form: FormData): Promise<OfferState> {
  await requireAdmin();

  const kind = kindOf(form.get("kind"));
  if (!kind) return { error: "Choose a percentage or an amount." };

  const value = parseValue(kind, String(form.get("value") ?? ""));
  if (value === null) {
    return {
      error:
        kind === "percent"
          ? "Enter a percentage between 1 and 90."
          : "Enter an amount in dirhams.",
    };
  }

  const rawSlug = String(form.get("slug") ?? "");
  const slug = rawSlug === "" || rawSlug === "all" ? null : rawSlug;
  if (slug && !getProduct(slug)) return { error: "That piece is not in the catalogue." };

  const label = String(form.get("label") ?? "").trim() || "Offer";
  if (label.length > 40) return { error: "Keep the label under 40 characters." };

  // A date-only input means midnight; the offer should run through that day.
  const rawEnds = String(form.get("ends_at") ?? "").trim();
  const ends_at = rawEnds ? new Date(`${rawEnds}T23:59:59`).toISOString() : null;

  try {
    await saveProductDiscount({
      id: String(form.get("id") ?? "") || undefined,
      slug,
      kind,
      value,
      label,
      active: form.get("active") === "on",
      ends_at,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save the discount." };
  }

  refresh();
  return { ok: "Saved." };
}

export async function removeDiscount(_prev: OfferState, form: FormData): Promise<OfferState> {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!id) return { error: "Missing discount." };

  try {
    await deleteProductDiscount(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete it." };
  }

  refresh();
  return { ok: "Deleted." };
}

/* ---------------- Coupons ---------------- */

export async function upsertCoupon(_prev: OfferState, form: FormData): Promise<OfferState> {
  await requireAdmin();

  const code = normaliseCode(String(form.get("code") ?? ""));
  if (code.length < 3 || code.length > 24) {
    return { error: "Codes are between 3 and 24 characters." };
  }
  if (!/^[A-Z0-9-]+$/.test(code)) {
    // Anything else is a code someone will mistype at a checkout on a phone.
    return { error: "Use letters, numbers and dashes only." };
  }

  const kind = kindOf(form.get("kind"));
  if (!kind) return { error: "Choose a percentage or an amount." };

  const value = parseValue(kind, String(form.get("value") ?? ""));
  if (value === null) {
    return {
      error:
        kind === "percent"
          ? "Enter a percentage between 1 and 90."
          : "Enter an amount in dirhams.",
    };
  }

  const rawUses = String(form.get("max_uses") ?? "").trim();
  const max_uses = rawUses ? Math.max(1, Math.round(Number(rawUses))) : null;
  if (rawUses && !Number.isFinite(Number(rawUses))) return { error: "Uses must be a number." };

  const rawMin = String(form.get("min_subtotal") ?? "").trim();
  const min_subtotal = rawMin ? Math.max(0, Math.round(Number(rawMin))) * 100 : 0;

  const rawEnds = String(form.get("ends_at") ?? "").trim();
  const ends_at = rawEnds ? new Date(`${rawEnds}T23:59:59`).toISOString() : null;

  try {
    await saveCoupon({
      id: String(form.get("id") ?? "") || undefined,
      code,
      kind,
      value,
      active: form.get("active") === "on",
      max_uses,
      min_subtotal,
      ends_at,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save the coupon." };
  }

  refresh();
  return { ok: `${code} saved.` };
}

export async function removeCoupon(_prev: OfferState, form: FormData): Promise<OfferState> {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!id) return { error: "Missing coupon." };

  try {
    await deleteCoupon(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete it." };
  }

  refresh();
  return { ok: "Deleted." };
}
