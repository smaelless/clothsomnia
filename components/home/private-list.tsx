"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Marquee } from "@/components/ui/marquee";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * PRIVATE LIST — access, not a newsletter.
 * Client-side validation only; wire `onSubmit` to your ESP when there is one.
 */
export function PrivateList() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const reduced = useReducedMotion();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setState("error");
      return;
    }
    setState("done");
  }

  return (
    <section className="relative overflow-hidden border-t border-bone/10 py-24 md:py-32" aria-label="Private list">
      <div aria-hidden className="bloom left-1/2 top-0 size-[44rem] -translate-x-1/2 bg-violet/20" />

      {/* Ghost type band */}
      <Marquee duration={46} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none opacity-[0.05]">
        <span className="display whitespace-nowrap pr-10 text-[clamp(5rem,18vw,16rem)] leading-none">
          AFTER HOURS LIST — AFTER HOURS LIST —
        </span>
      </Marquee>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel index="07" className="mb-8 justify-center">
            Access
          </SectionLabel>

          <SplitLines
            lines={["Join the", "after-hours list"]}
            className="display text-giant"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <p className="mx-auto mt-8 max-w-[46ch] text-base leading-relaxed text-silver">
            Drops go to the list first, at midnight, before anything is announced anywhere else.
            No campaigns, no discount codes, no reminders that we exist. Just the door code.
          </p>

          <div className="mx-auto mt-12 max-w-xl">
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div
                  key="done"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="glass flex items-center justify-center gap-4 rounded-full px-8 py-6"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-lime">
                    <Check className="size-4 text-ink" strokeWidth={3} />
                  </span>
                  <p className="label text-left text-bone">
                    You&apos;re on the list. Watch your inbox at 00:00.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={false}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <label htmlFor="list-email" className="sr-only">
                    Email address
                  </label>
                  <div
                    className={cn(
                      "flex flex-col gap-3 rounded-3xl border p-2 transition-colors sm:flex-row sm:items-center sm:rounded-full",
                      state === "error" ? "border-magenta" : "border-bone/20 focus-within:border-lime",
                    )}
                  >
                    <input
                      id="list-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="you@afterdark.com"
                      aria-invalid={state === "error"}
                      aria-describedby={state === "error" ? "list-error" : undefined}
                      className="min-w-0 flex-1 bg-transparent px-6 py-4 text-base text-bone outline-none placeholder:text-smoke"
                    />
                    <button
                      type="submit"
                      className="group relative shrink-0 overflow-hidden rounded-full bg-bone px-8 py-4 text-ink transition-colors duration-400 hover:bg-lime"
                    >
                      <span className="label block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                        Get the code
                      </span>
                      <span
                        aria-hidden
                        className="label absolute inset-0 grid translate-y-full place-items-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                      >
                        Get the code
                      </span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {state === "error" && (
                      <motion.p
                        id="list-error"
                        role="alert"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="label mt-4 pl-6 text-magenta"
                      >
                        That address doesn&apos;t look right.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-xs text-smoke">
              One email per chapter. Unsubscribe in a single click, no hard feelings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
