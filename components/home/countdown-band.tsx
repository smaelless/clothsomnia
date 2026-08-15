import { Countdown } from "@/components/ui/countdown";
import { Marquee } from "@/components/ui/marquee";

/**
 * COUNTDOWN BAND
 *
 * Sits directly under the hero, because until the drop lands this is the most
 * useful thing the homepage can tell someone: not what the brand is, but when
 * they can have it.
 */
export function CountdownBand() {
  return (
    <section
      className="relative overflow-hidden border-y border-bone/10 py-12 md:py-16"
      aria-label="Time until the drop"
    >
      <div aria-hidden className="bloom left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 bg-pine/20" />

      {/* Ghost type behind the board, moving at its own pace */}
      <Marquee
        duration={54}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none opacity-[0.045]"
      >
        <span className="display whitespace-nowrap pr-10 text-[clamp(4rem,15vw,13rem)] leading-none">
          27 SEPTEMBER — 00:00 — 27 SEPTEMBER — 00:00 —
        </span>
      </Marquee>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        <Countdown />

        <p className="mx-auto mt-8 max-w-[44ch] text-center text-sm leading-relaxed text-smoke">
          Fifty pieces per size, per colour. Nothing restocked. The list gets in first.
        </p>
      </div>
    </section>
  );
}
