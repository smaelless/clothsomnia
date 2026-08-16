/**
 * Order shapes and statuses — safe on both sides of the wire.
 *
 * Separate from admin-data because that module is "server-only": it holds the
 * Supabase service key, and the status buttons are a client component. Keeping
 * the vocabulary here lets the browser name a status without the module that
 * can read every customer's address following it into the bundle.
 */

export const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];

/** Statuses that still consume a piece of stock. A cancelled order gives it back. */
export const HOLDS_STOCK: Status[] = ["pending", "confirmed", "shipped", "delivered"];

export type OrderItem = {
  slug: string;
  name: string;
  colour: string;
  size: string;
  qty: number;
  /** List price at the time of the order. Absent on pre-discount orders. */
  listPrice?: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  created_at: string;
  updated_at: string | null;
  reference: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  note: string | null;
  admin_note: string | null;
  items: OrderItem[];
  item_count: number;
  /** Bag at list price. Null on orders placed before the offer existed. */
  full_subtotal: number | null;
  /** What the pre-launch offer took off, in centimes. */
  discount: number;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  payment_method: string;
  status: Status;
  notified_at: string | null;
};
