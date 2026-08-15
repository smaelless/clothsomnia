import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin";
import { allOrders, isConfigured } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

/**
 * CSV of every order — for the courier, the accountant, or a spreadsheet.
 *
 * A route handler rather than a server action because the browser has to
 * receive a file, and a server action cannot set Content-Disposition.
 */

/**
 * Excel treats a leading =, +, - or @ as a formula, which turns a customer's
 * address into code the moment someone opens the file. Prefixing an apostrophe
 * neutralises that.
 */
function cell(value: unknown): string {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const orders = await allOrders();

  const header = [
    "reference",
    "placed",
    "status",
    "name",
    "phone",
    "city",
    "address",
    "items",
    "pieces",
    "total_mad",
    "payment",
    "customer_note",
    "internal_note",
    "notified",
  ];

  const rows = orders.map((o) =>
    [
      o.reference,
      o.created_at,
      o.status,
      o.full_name,
      // Keeps +212… readable as text instead of becoming a negative number.
      o.phone,
      o.city,
      o.address.replace(/\s*\n\s*/g, ", "),
      (o.items ?? []).map((i) => `${i.name} ${i.colour}/${i.size} x${i.qty}`).join(" | "),
      o.item_count,
      (o.total / 100).toFixed(2),
      o.payment_method,
      o.note ?? "",
      o.admin_note ?? "",
      o.notified_at ?? "",
    ].map(cell).join(","),
  );

  // CRLF and a BOM, because Excel on Windows needs both to read UTF-8 properly —
  // without the BOM, every accented Moroccan city name arrives mangled.
  const csv = "﻿" + [header.join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clothsomnia-orders-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
