import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin";
import { isConfigured, listSignups } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

/**
 * CSV of the pre-launch list — for a broadcast tool, or just for keeping.
 *
 * A route handler rather than a server action because the browser has to
 * receive a file, and a server action cannot set Content-Disposition.
 */

/**
 * Excel treats a leading =, +, - or @ as a formula, which turns +212… into a
 * broken cell the moment someone opens the file. Prefixing an apostrophe
 * neutralises that and keeps the number readable as text.
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

  const rows = await listSignups();
  const header = ["phone", "name", "joined", "source", "notified"];

  const body = rows.map((r) =>
    [r.phone, r.name ?? "", r.created_at, r.source, r.notified_at ?? ""].map(cell).join(","),
  );

  // CRLF and a BOM, because Excel on Windows needs both to read UTF-8 —
  // without the BOM every accented name arrives mangled.
  const csv = "\ufeff" + [header.join(","), ...body].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="clothsomnia-waitlist-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
