import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PINE, SIZES_ALL, STOCK_PER_SIZE, WINE } from "./catalog";
import { HOLDS_STOCK, STATUSES, type Order, type Status } from "./order-status";

/**
 * ADMIN DATA — every read and write the admin makes.
 *
 * The orders table has row level security on and no policies, so the service
 * key is the only way in. That key is read here and never crosses to the
 * browser: "server-only" makes an accidental client import a build error rather
 * than a leaked credential.
 */

export type { Order, OrderItem, Status } from "./order-status";
export { STATUSES } from "./order-status";

let cached: SupabaseClient | null = null;

function db(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export function isConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

export const PAGE_SIZE = 25;

export type OrderQuery = {
  q?: string;
  status?: Status | "all";
  page?: number;
};

export async function listOrders(
  query: OrderQuery = {},
): Promise<{ orders: Order[]; total: number; page: number; pages: number }> {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const from = (page - 1) * PAGE_SIZE;

  let request = db()
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (query.status && query.status !== "all") {
    request = request.eq("status", query.status);
  }

  const term = query.q?.trim();
  if (term) {
    // Commas separate the branches of an `or`, so a comma in the search box
    // would be read as another filter and break the query.
    const safe = term.replace(/[,()]/g, " ");
    request = request.or(
      ["reference", "full_name", "phone", "city"].map((c) => `${c}.ilike.%${safe}%`).join(","),
    );
  }

  const { data, error, count } = await request;
  if (error) throw new Error(`Could not load orders: ${error.message}`);

  const total = count ?? 0;
  return {
    orders: (data ?? []) as Order[],
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getOrder(reference: string): Promise<Order | null> {
  const { data, error } = await db()
    .from("orders")
    .select("*")
    .eq("reference", reference.toUpperCase())
    .maybeSingle();

  if (error) throw new Error(`Could not load ${reference}: ${error.message}`);
  return (data as Order) ?? null;
}

/** Every order, oldest first — used by the CSV export and the stock count. */
export async function allOrders(): Promise<Order[]> {
  const { data, error } = await db()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load orders: ${error.message}`);
  return (data ?? []) as Order[];
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

export async function setStatus(id: string, status: Status): Promise<void> {
  const { error } = await db()
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Could not update the status: ${error.message}`);
}

export async function setAdminNote(id: string, note: string): Promise<void> {
  const { error } = await db()
    .from("orders")
    .update({ admin_note: note.trim() || null, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Could not save the note: ${error.message}`);
}

export async function markNotified(id: string): Promise<void> {
  const { error } = await db()
    .from("orders")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Could not record the notification: ${error.message}`);
}

/* ------------------------------------------------------------------ *
 * Derived numbers
 * ------------------------------------------------------------------ */

export type Stats = {
  orders: number;
  units: number;
  revenue: number;
  /** Revenue actually collected — cash on delivery only lands on delivery. */
  collected: number;
  /** Money committed but not yet in hand. */
  outstanding: number;
  byStatus: Record<Status, number>;
  today: number;
  week: number;
  /** Orders whose Telegram notification never went out. */
  unnotified: number;
  averageOrder: number;
  topCities: { city: string; orders: number }[];
};

export function summarise(orders: Order[]): Stats {
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
  const cities = new Map<string, number>();

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  let units = 0;
  let revenue = 0;
  let collected = 0;
  let outstanding = 0;
  let today = 0;
  let week = 0;
  let unnotified = 0;
  let live = 0;

  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;

    const at = Date.parse(o.created_at);
    if (at >= dayAgo) today += 1;
    if (at >= weekAgo) week += 1;
    if (!o.notified_at) unnotified += 1;

    // A cancelled order is not revenue and did not sell any units, so it is
    // excluded from every total rather than quietly inflating the good news.
    if (o.status === "cancelled") continue;

    live += 1;
    units += o.item_count;
    revenue += o.total;
    if (o.status === "delivered") collected += o.total;
    else outstanding += o.total;

    const city = o.city.trim().toLowerCase();
    const label = city.charAt(0).toUpperCase() + city.slice(1);
    cities.set(label, (cities.get(label) ?? 0) + 1);
  }

  return {
    orders: orders.length,
    units,
    revenue,
    collected,
    outstanding,
    byStatus,
    today,
    week,
    unnotified,
    averageOrder: live > 0 ? Math.round(revenue / live) : 0,
    topCities: [...cities.entries()]
      .map(([city, count]) => ({ city, orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 6),
  };
}

export type StockRow = {
  colour: string;
  hex: string;
  size: string;
  sold: number;
  left: number;
  total: number;
};

/**
 * Stock is not stored — it is the run size minus what has been ordered. Keeping
 * it derived means it can never drift out of step with the orders table, and a
 * cancelled order returns its pieces automatically.
 */
export function stockLevels(orders: Order[]): StockRow[] {
  const sold = new Map<string, number>();

  for (const o of orders) {
    if (!HOLDS_STOCK.includes(o.status)) continue;
    for (const item of o.items ?? []) {
      const key = `${item.colour}|${item.size}`;
      sold.set(key, (sold.get(key) ?? 0) + item.qty);
    }
  }

  return [PINE, WINE].flatMap((colour) =>
    SIZES_ALL.map((size) => {
      const count = sold.get(`${colour.name}|${size}`) ?? 0;
      return {
        colour: colour.name,
        hex: colour.hex,
        size,
        sold: count,
        left: Math.max(0, STOCK_PER_SIZE - count),
        total: STOCK_PER_SIZE,
      };
    }),
  );
}
