import { NextResponse } from "next/server";
import { join } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

/**
 * POST /api/waitlist — put a WhatsApp number on the pre-launch list.
 *
 * Deliberately tiny. It takes a number, normalises it, stores it, and says
 * yes. There is nothing to authenticate and nothing to price, so the only job
 * is to be impossible to get wrong from a phone on a bad connection.
 */
export async function POST(request: Request) {
  let body: { phone?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone : "";
  const name = typeof body.name === "string" ? body.name : undefined;

  const result = await join(phone, name);

  // 200 either way: a rejected number is an answer, not a failed request.
  return NextResponse.json(result);
}
