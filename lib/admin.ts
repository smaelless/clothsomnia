import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * ADMIN AUTHENTICATION — server only.
 *
 * One password, held in ADMIN_PASSWORD, exchanged for a signed cookie. There is
 * no user table because there is one person: adding accounts would mean adding
 * password resets, and a reset flow is a second way in.
 *
 * The signing secret is derived from the password itself, so changing the
 * password logs every existing session out — which is the behaviour you want
 * from a password change, and it means one environment variable instead of two.
 */

export const ADMIN_COOKIE = "cls_admin";

/** Sessions last a week — long enough to stop being annoying, short enough to expire. */
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function password(): string | null {
  const raw = process.env.ADMIN_PASSWORD;
  // A short password here would be worse than none, because it looks protected.
  return raw && raw.length >= 8 ? raw : null;
}

export function isConfigured(): boolean {
  return password() !== null;
}

function secret(): string {
  const pw = password();
  if (!pw) throw new Error("ADMIN_PASSWORD is not set (minimum 8 characters).");
  return createHmac("sha256", "clothsomnia/admin/v1").update(pw).digest("hex");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Constant-time comparison, safe when the two strings differ in length. */
function sameString(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // Still burn a comparison so the length is not leaked by how fast we return.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export function checkPassword(attempt: string): boolean {
  const pw = password();
  if (!pw) return false;
  return sameString(attempt, pw);
}

export function makeToken(): string {
  const expires = String(Date.now() + SESSION_MS);
  return `${expires}.${sign(expires)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return sameString(signature, sign(expires));
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MS / 1000,
  // Vercel terminates TLS, so this is only relaxed for local http development.
  secure: process.env.NODE_ENV === "production",
};

export async function isSignedIn(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

/**
 * The gate. Every admin page and every server action calls this — the layout
 * check alone is not enough, because a server action is its own entry point and
 * can be invoked without ever rendering the layout that guards it.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Login throttling
 *
 * In memory, so it resets on deploy and is per-instance. That is a real
 * limitation, but a single shared password with an 8-character minimum and a
 * few attempts per window is a wall no one is walking through casually, and
 * the alternative is a database round trip on every login attempt.
 * ------------------------------------------------------------------ */

const ATTEMPTS = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function throttled(): Promise<boolean> {
  const record = ATTEMPTS.get(await clientKey());
  return Boolean(record && record.until > Date.now() && record.count >= MAX_ATTEMPTS);
}

export async function recordFailure(): Promise<void> {
  const key = await clientKey();
  const now = Date.now();
  const record = ATTEMPTS.get(key);
  if (!record || record.until < now) {
    ATTEMPTS.set(key, { count: 1, until: now + WINDOW_MS });
    return;
  }
  record.count += 1;
}

export async function clearFailures(): Promise<void> {
  ATTEMPTS.delete(await clientKey());
}
