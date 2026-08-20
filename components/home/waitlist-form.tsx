"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * THE LIST — a WhatsApp number, and nothing else.
 *
 * One field. Not a name, not an email, not a size: every extra box on a form
 * like this costs sign-ups, and the only thing needed to send someone a message
 * before the drop is the number to send it to.
 *
 * Drawn as a ruled line rather than a box, because it sits on the one pale
 * panel on the site and a bordered input there looks like a browser default. A
 * line with a word under it looks like something to fill in.
 *
 * The promise is written narrowly on purpose: a message before the drop, with a
 * code. No percentage is named — the code is created in the admin, and copy
 * quoting a number the shop cannot honour is worse than copy saying nothing.
 */
export function WaitlistForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "already">("idle");
  const [error, setError] = useState<string | null>(null);

  const light = tone === "light";

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
        className="flex items-start gap-4"
      >
        <span
          className={cn(
            "mt-1 grid size-9 shrink-0 place-items-center rounded-full",
            light ? "bg-ink" : "bg-lime",
          )}
        >
          <Check className={cn("size-4", light ? "text-cream" : "text-ink")} strokeWidth={3} />
        </span>
        <div>
          <p className={cn("display text-3xl leading-tight", light ? "text-ink" : "text-bone")}>
            {state === "already" ? "Rak déjà f'liste." : "Rak f'liste."}
          </p>
          <p
            className={cn(
              "mt-3 max-w-[44ch] text-sm leading-relaxed",
              light ? "text-ink/70" : "text-silver",
            )}
          >
            Ghadi tousslek message f&apos;WhatsApp qbel 27 September, m3a l&apos;code dialek.
            Qbel kolchi.{" "}
            <span className={light ? "text-ink/45" : "text-smoke"}>
              On te prévient avant tout le monde.
            </span>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label
        htmlFor="waitlist-phone"
        className={cn("label-wide block", light ? "text-ink/50" : "text-smoke")}
      >
        Numéro WhatsApp
      </label>

      <div
        className={cn(
          "mt-4 flex items-center gap-4 border-b-2 pb-3 transition-colors",
          error
            ? "border-magenta"
            : light
              ? "border-ink/25 focus-within:border-ink"
              : "border-bone/25 focus-within:border-lime",
        )}
      >
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
            "display w-full min-w-0 bg-transparent text-[clamp(1.5rem,5vw,2.5rem)] leading-tight outline-none",
            light
              ? "text-ink placeholder:text-ink/25"
              : "text-bone placeholder:text-bone/25",
          )}
        />

        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Zidni f'liste"
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-full transition-transform duration-300 hover:scale-105 disabled:opacity-40",
            light ? "bg-ink text-cream" : "bg-lime text-ink",
          )}
        >
          <ArrowRight className={cn("size-5", state === "sending" && "animate-pulse")} strokeWidth={2} />
        </button>
      </div>

      {error && (
        <p id="waitlist-error" role="alert" className="label mt-4 text-magenta">
          {error}
        </p>
      )}

      <p className={cn("mt-5 text-xs leading-relaxed", light ? "text-ink/50" : "text-smoke")}>
        Ghir numéro. Bla spam, bla compte, bla walou.{" "}
        <span className={light ? "text-ink/35" : "text-smoke/70"}>
          Juste un message, avant le drop.
        </span>
      </p>
    </form>
  );
}
