import { NextResponse } from "next/server";
import { priceMap } from "@/lib/offers-data";

/**
 * GET /api/pricing — what everything costs right now.
 *
 * The bag and the checkout run in the browser and cannot read the database, so
 * they read this. It carries only what is already visible on any product page:
 * list price, current price, and the badge. Coupons are not here, and must
 * never be — this endpoint is public.
 */
export const revalidate = 30;

export async function GET() {
  const map = await priceMap();
  return NextResponse.json(map, {
    headers: {
      // Short, because an admin who switches a discount on expects to see it.
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}
