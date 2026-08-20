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
  | { ok: true; already: boolean }
  | { ok: false; error: string };

/**
 * Add a number to the list.
 *
 * A number that is already on it is a success, not an error. Someone who signs
 * up twice has done nothing wrong, and telling them "already registered" only
 * teaches them that the form is judging them — worse, it confirms to a stranger
 * which numbers are on the list.
 */
export async function join(rawPhone: string, name?: string): Promise<JoinResult> {
  const supabase = db();
  if (!supabase) return { ok: false, error: "The list is not open yet. Try again shortly." };

  const phone = normalisePhone(rawPhone ?? "");
  if (!phone) {
    return { ok: false, error: "Dakhel numéro dialek — 06 12 34 56 78." };
  }

  const trimmed = (name ?? "").trim();

  const { error } = await supabase.from("waitlist").insert({
    phone,
    name: trimmed ? trimmed.slice(0, 60) : null,
  });

  // 23505 is the unique violation on phone — they are already on the list.
  if (error && error.code === "23505") return { ok: true, already: true };

  if (error) {
    console.error("[waitlist] insert failed", error.message);
    return { ok: false, error: "Ma msha walou. 3awd jarreb." };
  }

  return { ok: true, already: false };
}

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
