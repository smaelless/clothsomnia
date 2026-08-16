import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  isConfigured,
  notifyTelegram,
  saveOrder,
  validateOrder,
  type AppliedCoupon,
} from "@/lib/orders";
import { checkCoupon, priceMap, recordCouponUse } from "@/lib/offers-data";
import { remainingStock } from "@/lib/stock";

/**
 * POST /api/orders — place a cash-on-delivery order.
 *
 * Runs on the server only. Prices, stock and totals are recomputed here from
 * the catalogue; whatever the client sends for money is ignored.
 */
export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Ordering is not switched on yet. Please try again shortly." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Read at the moment of the order, not at page load — the browser's copy of
  // what is left, and of what things cost, can be minutes old by the time
  // someone finishes the form.
  const [stock, prices] = await Promise.all([remainingStock(), priceMap()]);

  // Priced first without the coupon, because a coupon's minimum and its value
  // both depend on the subtotal it is being applied to.
  const dry = validateOrder(body as never, stock, prices);
  if (!dry.ok) {
    return NextResponse.json({ errors: dry.errors }, { status: 422 });
  }

  let applied: AppliedCoupon | null = null;
  const submittedCode = (body as { coupon?: unknown }).coupon;
  if (typeof submittedCode === "string" && submittedCode.trim()) {
    const check = await checkCoupon(submittedCode, dry.value.subtotal);
    if (!check.ok) {
      // Refused rather than silently dropped: someone who typed a code and saw
      // a lower total must not be charged the higher one without being told.
      return NextResponse.json({ errors: { coupon: check.reason } }, { status: 422 });
    }
    applied = { id: check.id, code: check.coupon.code, discount: check.discount };
  }

  const result = validateOrder(body as never, stock, prices, applied);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const order = result.value;

  let id: string;
  try {
    ({ id } = await saveOrder(order));
  } catch (err) {
    console.error("[orders] save failed", err);
    return NextResponse.json(
      { error: "We could not save your order. Please try again." },
      { status: 500 },
    );
  }

  // Counted only now the order is safely saved, so a shopper who types a code
  // and then abandons the checkout has not burned one of its uses.
  if (applied) await recordCouponUse(applied.id);

  // The order is safe at this point. A failed notification is recorded, never
  // surfaced to the customer as a failure.
  const notified = await notifyTelegram(order);
  if (notified) {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false } },
      );
      await supabase
        .from("orders")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", id);
    } catch (err) {
      console.error("[orders] could not stamp notified_at", err);
    }
  } else {
    console.warn(`[orders] ${order.reference} saved but Telegram did not notify`);
  }

  return NextResponse.json({
    reference: order.reference,
    total: order.total,
    itemCount: order.itemCount,
  });
}
