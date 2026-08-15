import "server-only";
import { createClient } from "@supabase/supabase-js";
import { PINE, SIZES_ALL, STOCK_PER_SIZE, WINE } from "./catalog";
import { HOLDS_STOCK, type Order, type Status } from "./order-status";

/**
 * LIVE STOCK — the single count both the shop and the admin read.
 *
 * The catalogue's STOCK map is a constant: fifty per size, forever. That was
 * fine while nothing could be bought, but it means the product page would keep
 * offering a size after the fiftieth had gone and the order API would keep
 * accepting it. The real number is the run size minus what has been ordered,
 * and it can only be known by asking the database.
 *
 * Keyed `${colour}|${size}`, matching the catalogue's own STOCK map so the two
 * are interchangeable.
 */

export type StockMap = Record<string, number>;

/** Every size at full run — used when Supabase is not configured. */
export function fullRun(): StockMap {
  const map: StockMap = {};
  for (const colour of [PINE, WINE]) {
    for (const size of SIZES_ALL) map[`${colour.name}|${size}`] = STOCK_PER_SIZE;
  }
  return map;
}

/** How many pieces each colour/size combination has committed to orders. */
export function soldFrom(orders: Pick<Order, "status" | "items">[]): StockMap {
  const sold: StockMap = {};
  for (const order of orders) {
    if (!HOLDS_STOCK.includes(order.status)) continue;
    for (const item of order.items ?? []) {
      const key = `${item.colour}|${item.size}`;
      sold[key] = (sold[key] ?? 0) + item.qty;
    }
  }
  return sold;
}

/**
 * Remaining stock, per colour and size.
 *
 * If Supabase is unreachable this returns the full run rather than zero. That
 * is the deliberate choice: a database blip should not make the whole drop look
 * sold out to every visitor. The order API re-checks against the same numbers
 * before anything is saved, so the worst case is a size that accepts an order
 * it should have refused — recoverable, unlike a shop that says it has nothing.
 */
export async function remainingStock(): Promise<StockMap> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return fullRun();

  let rows: { status: Status; items: Order["items"] }[] = [];
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase.from("orders").select("status, items");
    if (error) throw new Error(error.message);
    rows = (data ?? []) as typeof rows;
  } catch (err) {
    console.error("[stock] could not read orders, showing the full run", err);
    return fullRun();
  }

  const sold = soldFrom(rows);
  const remaining = fullRun();
  for (const key of Object.keys(remaining)) {
    remaining[key] = Math.max(0, remaining[key] - (sold[key] ?? 0));
  }
  return remaining;
}
