"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  COOKIE_OPTIONS,
  checkPassword,
  clearFailures,
  isConfigured,
  makeToken,
  recordFailure,
  requireAdmin,
  throttled,
} from "@/lib/admin";
import { STATUSES, type Status, getOrder, markNotified, setAdminNote, setStatus } from "@/lib/admin-data";
import { notifyTelegram } from "@/lib/orders";

/**
 * Every admin mutation. Server actions are their own entry point — being
 * reachable does not depend on the layout that guards the pages — so each one
 * calls requireAdmin() itself.
 */

export type FormState = { error?: string; ok?: string };

/* ---------------- Session ---------------- */

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isConfigured()) {
    return { error: "ADMIN_PASSWORD is not set on the server (minimum 8 characters)." };
  }

  if (await throttled()) {
    return { error: "Too many attempts. Wait fifteen minutes and try again." };
  }

  const attempt = String(form.get("password") ?? "");
  if (!checkPassword(attempt)) {
    await recordFailure();
    // Deliberately vague: naming what was wrong helps whoever is guessing.
    return { error: "That password is not right." };
  }

  await clearFailures();
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, makeToken(), COOKIE_OPTIONS);
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ---------------- Orders ---------------- */

function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as Status);
}

export async function updateStatus(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  const status = form.get("status");
  const reference = String(form.get("reference") ?? "");

  if (!id) return { error: "Missing order." };
  if (!isStatus(status)) return { error: "Unknown status." };

  try {
    await setStatus(id, status);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update the status." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/stock");
  if (reference) revalidatePath(`/admin/orders/${reference}`);
  return { ok: `Marked ${status}.` };
}

export async function saveNote(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  const reference = String(form.get("reference") ?? "");
  const note = String(form.get("note") ?? "");

  if (!id) return { error: "Missing order." };
  if (note.length > 2000) return { error: "That note is too long." };

  try {
    await setAdminNote(id, note);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save the note." };
  }

  if (reference) revalidatePath(`/admin/orders/${reference}`);
  return { ok: "Note saved." };
}

/**
 * Re-send an order to Telegram. Exists because notifyTelegram is best-effort at
 * checkout — an order can be safely in the database while the message never
 * arrived, and without this there is no way to recover it.
 */
export async function resendNotification(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const reference = String(form.get("reference") ?? "");
  if (!reference) return { error: "Missing order." };

  const order = await getOrder(reference);
  if (!order) return { error: "That order no longer exists." };

  const sent = await notifyTelegram({
    reference: order.reference,
    fullName: order.full_name,
    phone: order.phone,
    city: order.city,
    address: order.address,
    note: order.note,
    items: order.items,
    itemCount: order.item_count,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
  });

  if (!sent) {
    return { error: "Telegram did not accept it. Check the bot token and chat id." };
  }

  await markNotified(order.id);
  revalidatePath(`/admin/orders/${reference}`);
  return { ok: "Sent to Telegram." };
}
