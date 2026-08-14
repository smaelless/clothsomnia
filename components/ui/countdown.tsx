"use client";

import { useEffect, useState } from "react";

/** Chapter 1 goes live at midnight, 27 September. */
export const LAUNCH_AT = new Date("2026-09-27T00:00:00+01:00");

function remaining(to: Date) {
  const ms = to.getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/**
 * COUNTDOWN to the drop.
 *
 * Renders nothing on the server and on first paint — the remaining time
 * differs between server and client, and rendering it during hydration would
 * mismatch. Once launched it disappears on its own rather than sitting at zero.
 */
export function Countdown({ className }: { className?: string }) {
  const [left, setLeft] = useState<ReturnType<typeof remaining>>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setLeft(remaining(LAUNCH_AT));
    const id = window.setInterval(() => setLeft(remaining(LAUNCH_AT)), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!ready || !left) return null;

  const cells = [
    { v: left.days, l: "days" },
    { v: left.hours, l: "hrs" },
    { v: left.minutes, l: "min" },
    { v: left.seconds, l: "sec" },
  ];

  return (
    <div className={className}>
      <p className="label-wide mb-5 text-lime">Chapter 1 drops 27 September</p>
      <div className="flex items-end justify-center gap-5 sm:gap-8">
        {cells.map((c) => (
          <div key={c.l} className="text-center">
            <span className="display block text-[clamp(2rem,7vw,4rem)] leading-none tabular-nums text-bone">
              {String(c.v).padStart(2, "0")}
            </span>
            <span className="label-wide mt-3 block text-smoke">{c.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
