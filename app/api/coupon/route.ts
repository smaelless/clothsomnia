import { NextResponse } from "next/server";
import { checkCoupon } from "@/lib/offers-data";
import { priceMap } from "@/lib/offers-data";
import { priceOf } from "@/lib/offers";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * POST /api/coupon — is this code usable on this bag?
 *
 * A preview only. The checkout shows the shopper what a code is worth before
 * they commit, but the order API checks the code again from scratch when the
 * order is actually placed, so nothing here decides money.
 *
 * The subtotal is recomputed from the posted bag rather than accepted from the
 * request, because a client that could name its own subtotal could unlock a
 * minimum-spend coupon it has not met.
 */
export async function POST(request: Request) {
  let body: { code?: unknown; items?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "Malformed request." }, { status: 400 });
  }

  const code = typeof body.code === "string" ? body.code : "";
  if (!code.trim()) {
    return NextResponse.json({ ok: false, reason: "Enter a code." }, { status: 200 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const prices = await priceMap();

  let subtotal = 0;
  for (const raw of items) {
    const line = raw as { slug?: unknown; qty?: unknown };
    if (typeof line.slug !== "string") continue;
    const product = getProduct(line.slug);
    if (!product) continue;
    const qty = Math.floor(Number(line.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 10) continue;
    subtotal += priceOf(prices, product.slug, product.price).price * qty;
  }

  if (subtotal <= 0) {
    return NextResponse.json({ ok: false, reason: "Your bag is empty." }, { status: 200 });
  }

  const result = await checkCoupon(code, subtotal);

  // 200 either way: a rejected coupon is an answer, not a failed request.
  return NextResponse.json(
    result.ok
      ? { ok: true, code: result.coupon.code, discount: result.discount }
      : { ok: false, reason: result.reason },
  );
}
