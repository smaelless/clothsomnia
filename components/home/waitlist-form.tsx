"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE LIST — a WhatsApp number, and nothing else.
 *
 * One field. Not a name, not an email, not a size: every extra box on a form
 * like this costs sign-ups, and the only thing actually needed to send someone
 * a message before the drop is the number to send it to.
 *
 * The promise it makes has to be kept, so it is written narrowly: a message
 * before the drop, with a code. No number is named here — the code is created
 * in the admin, and copy that quotes a percentage the shop cannot honour is
 * worse than copy that says nothing.
 */
export function WaitlistForm() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "already">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as
        | { ok: true; already: boolean }
        | { ok: false; error: string };

      if (!data.ok) {
        setError(data.error);
        setState("idle");
        return;
      }
      setState(data.already ? "already" : "done");
    } catch {
      setError("Ma kayn ta réseau. 3awd jarreb.");
      setState("idle");
    }
  }

  if (state === "done" || state === "already") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="flex items-start gap-4 rounded-3xl border border-lime/40 bg-lime/10 p-6"
      >
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-lime">
          <Check className="size-4 text-ink" strokeWidth={3} />
        </span>
        <div>
          <p className="display text-2xl leading-tight">
            {state === "already" ? "Rak déjà f'liste." : "Rak f'liste."}
          </p>
          <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-silver">
            Ghadi tousslek message f&apos;WhatsApp qbel 27 September, m3a l&apos;code dialek.
            Qbel kolchi. <span className="text-smoke">On te prévient avant tout le monde.</span>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="waitlist-phone" className="label mb-3 block text-smoke">
        Numéro WhatsApp
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="waitlist-phone"
          name="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError(null);
          }}
          /* tel + numeric brings up the phone keypad instead of the full
             keyboard, which is most of the difference on a phone. */
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="06 12 34 56 78"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "waitlist-error" : undefined}
          className={cn(
            "w-full rounded-full border bg-transparent px-6 py-4 text-base text-bone outline-none transition-colors placeholder:text-smoke/60",
            error ? "border-magenta" : "border-bone/20 focus:border-lime",
          )}
        />

        <button
          type="submit"
          disabled={state === "sending"}
          className="label shrink-0 rounded-full bg-lime px-8 py-4 text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "sending" ? "Sift…" : "Zidni f'liste"}
        </button>
      </div>

      {error && (
        <p id="waitlist-error" role="alert" className="label mt-3 text-magenta">
          {error}
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-smoke">
        Ghir numéro. Bla spam, bla compte, bla walou.{" "}
        <span className="text-smoke/70">Juste un message, avant le drop.</span>
      </p>
    </form>
  );
}
