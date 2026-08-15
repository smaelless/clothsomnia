import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isConfigured, notifyTelegram, saveOrder, validateOrder } from "@/lib/orders";
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
  // what is left can be minutes old by the time someone finishes the form.
  const stock = await remainingStock();

  const result = validateOrder(body as never, stock);
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
