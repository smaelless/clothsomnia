"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Intro } from "@/components/chrome/intro";
import { Plate } from "@/components/ui/plate";
import { Wordmark } from "@/components/ui/wordmark";
import { INTRO_META, INTRO_VARIANT, INTRO_VARIANTS, type IntroVariant } from "@/lib/intro";
import { cn } from "@/lib/utils";

const TONES = ["violet", "magenta", "cobalt", "lime"] as const;

/**
 * INTRO LAB — an internal comparison page.
 * Each card replays its sequence over the real site chrome, so what you see is
 * exactly what a first-time visitor gets.
 */
export function IntroLabClient() {
  // Bumping the token remounts <Intro>, which restarts the sequence.
  const [playing, setPlaying] = useState<{ variant: IntroVariant; token: number } | null>(null);

  return (
    <>
      {playing && (
        <Intro key={`${playing.variant}-${playing.token}`} variant={playing.variant} force />
      )}

      <header className="border-b border-bone/10 px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1600px]">
          <p className="label-wide mb-8 text-lime">Internal — Intro Lab</p>
          <h1 className="display text-giant">
            Pick the opening
            <span className="block font-light italic text-silver">sequence</span>
          </h1>
          <p className="mt-8 max-w-[56ch] text-base leading-relaxed text-silver md:text-lg">
            Four completely different first impressions. Hit play on any card to watch it run over
            the live site. When you have chosen, tell me which one — or set it yourself in{" "}
            <code className="rounded bg-charcoal px-2 py-1 text-sm text-lime">lib/intro.ts</code>.
          </p>
          <p className="label mt-6 text-smoke">
            Currently live on the site:{" "}
            <span className="text-lime">{INTRO_META[INTRO_VARIANT].name}</span>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        {INTRO_VARIANTS.map((variant, i) => {
          const meta = INTRO_META[variant];
          const isLive = variant === INTRO_VARIANT;
          return (
            <article
              key={variant}
              className={cn(
                "group relative overflow-hidden border bg-charcoal/40 p-6 transition-colors md:p-8",
                isLive ? "border-lime/50" : "border-bone/12 hover:border-bone/30",
              )}
            >
              <div aria-hidden className="absolute inset-0 -z-10 opacity-30">
                <Plate
                  seed={`intro-${variant}`}
                  tone={TONES[i % TONES.length]}
                  variant="field"
                  alt=""
                  sizes="50vw"
                  className="h-full w-full"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label-wide text-smoke">
                    Option {String(i + 1).padStart(2, "0")} — {meta.duration}
                  </p>
                  <h2 className="display mt-4 text-4xl">{meta.name}</h2>
                </div>
                {isLive && <span className="label rounded-full bg-lime px-3 py-2 text-ink">Live</span>}
              </div>

              <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-silver">{meta.idea}</p>
              <p className="mt-4 text-sm italic text-smoke">{meta.feel}</p>

              <button
                type="button"
                onClick={() => setPlaying({ variant, token: Date.now() })}
                className="group/btn mt-8 inline-flex items-center gap-3 rounded-full border border-bone/25 px-6 py-4 transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink"
              >
                <Play className="size-4 transition-transform duration-400 group-hover/btn:scale-110" strokeWidth={1.5} />
                <span className="label">Play sequence</span>
              </button>

              <p className="label-wide mt-6 text-smoke">
                Set with: INTRO_VARIANT = &quot;{variant}&quot;
              </p>
            </article>
          );
        })}
      </div>

      <div className="border-t border-bone/10 px-4 py-16 text-center md:px-8">
        <Wordmark className="text-[clamp(2rem,6vw,4rem)]" />
        <p className="label-wide mt-6 text-smoke">
          Reduced motion skips every one of these automatically
        </p>
      </div>
    </>
  );
}
