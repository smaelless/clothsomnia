"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { markAllNotified, removeSignup, setNotified } from "@/lib/waitlist";

/**
 * Every change the admin can make to the list. Server actions are their own
 * entry point — being reachable does not depend on the page that guards them —
 * so each calls requireAdmin() itself.
 */

export type ListState = { error?: string; ok?: string };

export async function toggleNotified(_prev: ListState, form: FormData): Promise<ListState> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  const notified = form.get("notified") === "1";
  if (!id) return { error: "Missing number." };

  try {
    await setNotified(id, notified);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update that number." };
  }

  revalidatePath("/admin/waitlist");
  return { ok: notified ? "Marked as told." : "Marked as not told." };
}

export async function markEveryone(_prev: ListState): Promise<ListState> {
  await requireAdmin();

  try {
    const n = await markAllNotified();
    revalidatePath("/admin/waitlist");
    return { ok: n === 0 ? "Everyone was already marked." : `Marked ${n}.` };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not mark the list." };
  }
}

export async function deleteSignup(_prev: ListState, form: FormData): Promise<ListState> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  if (!id) return { error: "Missing number." };

  try {
    await removeSignup(id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not remove that number." };
  }

  revalidatePath("/admin/waitlist");
  return { ok: "Removed." };
}
