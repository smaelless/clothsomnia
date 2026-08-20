"use client";

import { useEffect, useState } from "react";
import { LAUNCH_AT } from "@/lib/pricing";
import { Marquee } from "@/components/ui/marquee";

/**
 * THE BANNER — what stands where the header used to.
 *
 * The waiting page has nothing to navigate to, so the announcement bar and the
 * nav both came off it and this took their place: the only fact that matters,
 * at a size that cannot be missed, moving so it reads as a sign rather than a
 * heading.
 *
 * Two rows travelling in opposite directions. One row at this weight sits
 * there; two disagreeing about which way the world is going does not.
 *
 * On speed: the first version ran 30s over a 563px cycle — about 19px a
 * second, which is genuinely moving and completely invisible. Type this large
 * needs to cover ground before the eye accepts it as motion at all.
 */
export function WaitingBanner() {
  // Rendered only after mount. The remaining days differ between server and
  // client, so printing them during hydration would mismatch.
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const tick = () =>
      setDays(Math.max(Math.ceil((LAUNCH_AT.getTime() - Date.now()) / 86400000), 0));
    tick();
    // Hourly: enough to roll over near midnight without a timer that never rests.
    const id = window.setInterval(tick, 3600000);
    return () => window.clearInterval(id);
  }, []);

  const line =
    days === null
      ? "Clothsomnia"
      : days === 0
        ? "Today — Clothsomnia, inchaAllah"
        : `${days} ${days === 1 ? "day" : "days"} to the Clothsomnia, inchaAllah`;

  return (
    <header className="relative z-50 overflow-hidden border-b border-bone/10 bg-ink">
      {/* A light travelling along the bottom rule — the runway rig, still on */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-lime/70 to-transparent animate-sweep"
      />

      <div className="py-4 md:py-6">
        <Marquee duration={13}>
          <span className="display flex shrink-0 items-center gap-6 whitespace-nowrap pr-6 text-[clamp(1.6rem,5vw,3.25rem)] leading-none text-bone">
            {line}
            <span aria-hidden className="text-lime">✦</span>
          </span>
        </Marquee>

        {/* The counter-row: smaller, dimmer, and going the other way, so the
            band has depth instead of a single sliding line. */}
        <Marquee duration={19} reverse className="mt-1.5 md:mt-2.5">
          <span className="label flex shrink-0 items-center gap-5 whitespace-nowrap pr-5 text-[10px] tracking-[0.3em] text-smoke">
            27 SEPTEMBER
            <span aria-hidden className="text-lime/50">✦</span>
            CHAPTER 1 — DREAMS
            <span aria-hidden className="text-lime/50">✦</span>
            PAS DE PANIC
            <span aria-hidden className="text-lime/50">✦</span>
            50 PIÈCES PAR TAILLE
            <span aria-hidden className="text-lime/50">✦</span>
          </span>
        </Marquee>
      </div>
    </header>
  );
}
