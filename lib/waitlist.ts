import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalisePhone } from "./orders";

/**
 * THE PRE-LAUNCH LIST — server only.
 *
 * One WhatsApp number per person, so they can be told before the drop rather
 * than at the same time as everyone else. Holds the service key, so it must
 * never be imported from the browser: "server-only" turns that into a build
 * error rather than a leaked credential.
 */

export type Signup = {
  id: string;
  created_at: string;
  phone: string;
  name: string | null;
  source: string;
  notified_at: string | null;
};

let cached: SupabaseClient | null = null;

function db(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached ??= createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export function isConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export type JoinResult =
  | { ok: true; already: boolean; position: number }
  | { ok: false; error: string };

/**
 * Add a number to the list, and say where in the queue it landed.
 *
 * A number already on it is a success, not an error. Someone who signs up
 * twice has done nothing wrong, and telling them "already registered" only
 * teaches them the form is judging them — worse, it confirms to a stranger
 * which numbers are on the list.
 */
export async function join(rawPhone: string, name?: string): Promise<JoinResult> {
  const supabase = db();
  if (!supabase) return { ok: false, error: "L'liste mazal ma khddama. 3awd men b3d." };

  const phone = normalisePhone(rawPhone ?? "");
  if (!phone) {
    return { ok: false, error: "Dakhel numéro dialek — 06 12 34 56 78." };
  }

  const trimmed = (name ?? "").trim();

  const { data: inserted, error } = await supabase
    .from("waitlist")
    .insert({ phone, name: trimmed ? trimmed.slice(0, 60) : null })
    .select("created_at")
    .single();

  // 23505 is the unique violation on phone — they are already on the list.
  const already = error?.code === "23505";

  if (error && !already) {
    console.error("[waitlist] insert failed", error.message);
    return { ok: false, error: "Ma msha walou. 3awd jarreb." };
  }

  let joinedAt = inserted?.created_at as string | undefined;

  if (already) {
    const { data: existing } = await supabase
      .from("waitlist")
      .select("created_at")
      .eq("phone", phone)
      .maybeSingle();
    joinedAt = existing?.created_at as string | undefined;
  }

  return { ok: true, already, position: await positionOf(supabase, joinedAt) };
}

/**
 * How many people were on the list at or before this moment.
 *
 * Counted rather than stored: a stored number would be wrong the moment a row
 * is deleted, and the count is cheap because the table is indexed on
 * created_at. Falls back to 0, which the client reads as "do not show a
 * number" — a wrong position is worse than none.
 */
async function positionOf(supabase: SupabaseClient, joinedAt?: string): Promise<number> {
  if (!joinedAt) return 0;
  const { count, error } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true })
    .lte("created_at", joinedAt);

  if (error) {
    console.error("[waitlist] could not count the list", error.message);
    return 0;
  }
  return count ?? 0;
}

/* ------------------------------------------------------------------ *
 * Admin
 * ------------------------------------------------------------------ */

export async function listSignups(): Promise<Signup[]> {
  const supabase = db();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[waitlist] could not read the list", error.message);
    return [];
  }
  return (data ?? []) as Signup[];
}

/** Mark that the pre-drop message actually went out, or undo that. */
export async function setNotified(id: string, notified: boolean): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("waitlist")
    .update({ notified_at: notified ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) throw new Error(`Could not update that number: ${error.message}`);
}

/**
 * Marks everyone at once. Used after a broadcast, which is the only way this
 * list is realistically worked through — one at a time would be a hundred
 * clicks to record something that happened in one action.
 */
export async function markAllNotified(): Promise<number> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("waitlist")
    .update({ notified_at: new Date().toISOString() })
    .is("notified_at", null)
    .select("id");

  if (error) throw new Error(`Could not mark the list: ${error.message}`);
  return data?.length ?? 0;
}

export async function removeSignup(id: string): Promise<void> {
  const supabase = db();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("waitlist").delete().eq("id", id);
  if (error) throw new Error(`Could not remove that number: ${error.message}`);
}

/**
 * Tell the owner a number came in.
 *
 * Best effort, exactly like the order notification: the sign-up is already
 * saved by the time this runs, and a Telegram outage must never turn a
 * successful sign-up into an error on someone's phone.
 */
export async function notifyTelegram(phone: string, position: number): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = `📲 New on the list — ${phone}\nNumber ${position} f'liste.`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error(`[waitlist] telegram ${res.status} ${await res.text().catch(() => "")}`);
    }
  } catch (err) {
    console.error("[waitlist] telegram request threw", err);
  }
}
