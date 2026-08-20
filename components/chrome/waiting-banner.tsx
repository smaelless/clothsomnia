"use client";

import { useEffect, useState } from "react";
import { LAUNCH_AT } from "@/lib/pricing";
import { Marquee } from "@/components/ui/marquee";

/**
 * THE BANNER — what stands where the header used to.
 *
 * The waiting page has nothing to navigate to, so the announcement bar and the
 * nav both came off it and this took their place: one line, the only fact that
 * matters, at a size that cannot be missed.
 *
 * The number is counted, not typed. Written by hand it would be right for one
 * day and quietly wrong for every day after — the kind of mistake nobody
 * reports, they just stop believing the rest of the page.
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
      ? null
      : days === 0
        ? "Today — Clothsomnia, inchaAllah"
        : `${days} ${days === 1 ? "day" : "days"} to the Clothsomnia, inchaAllah`;

  return (
    <header className="relative z-50 border-b border-bone/10 bg-ink">
      <div className="relative overflow-hidden py-5 md:py-7">
        {/* A light travelling along the bottom rule — the runway rig, still on */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-lime/70 to-transparent animate-sweep"
        />

        {/*
          Held on one line and scrolled, rather than wrapped. At this size the
          sentence is wider than a phone, and a headline that breaks across
          three ragged lines reads as a mistake — moving, it reads as a sign.
        */}
        <Marquee duration={30}>
          <span className="display flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 text-[clamp(1.75rem,5.5vw,3.5rem)] leading-none">
            {line ?? "Clothsomnia"}
            <span aria-hidden className="text-lime">✦</span>
          </span>
        </Marquee>
      </div>
    </header>
  );
}
