import { Countdown } from "@/components/ui/countdown";
import { Marquee } from "@/components/ui/marquee";
import { Plate } from "@/components/ui/plate";
import { SplitLines } from "@/components/ui/reveal";

/**
 * THE WAITING PAGE
 *
 * A holding page for the run-up to 27 September: the clock, the hoodie out of
 * focus, and the lines. Nothing to buy, nothing to browse — the product pages
 * still exist and still work, they are simply not what the front door is for
 * while there is nothing to collect yet.
 *
 * The real homepage is parked at app/_backup/home-launch.tsx. Copy it back over
 * this file on drop day; every component it needs is still in the tree.
 */

/** Kept few and far apart. A wall of blurred photographs stops being a tease. */
const FRAMES = [
  { src: "/chapter1/pine-front.jpg", line: "Wear it once, they talk about it saison kamla.", ratio: "aspect-[3/4]" },
  { src: "/chapter1/wine-three.jpg", line: "Ila 3reftini, 3reftini.", ratio: "aspect-[4/5]" },
  { src: "/chapter1/detail-pine-seam.jpg", line: "The seam does the talking. Nta ghir lbess.", ratio: "aspect-[16/10]" },
  { src: "/chapter1/wine-full.jpg", line: "Dress like you already made it.", ratio: "aspect-[3/4]" },
];

export default function WaitingPage() {
  return (
    <>
      {/* The clock — the only thing anyone is here for */}
      <section className="relative overflow-hidden py-16 md:py-24" aria-label="Time until the drop">
        <div
          aria-hidden
          className="bloom left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 bg-pine/20"
        />

        <Marquee
          duration={54}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none opacity-[0.045]"
        >
          <span className="display whitespace-nowrap pr-10 text-[clamp(4rem,15vw,13rem)] leading-none">
            27 SEPTEMBER — 00:00 — 27 SEPTEMBER — 00:00 —
          </span>
        </Marquee>

        <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
          <p className="label-wide mb-10 text-center text-lime">
            It&apos;s not necessary tlbess qadek iwatik, sometimes khassek
          </p>

          <SplitLines
            lines={["T'lbess what", "they'll remember"]}
            className="display mb-12 text-center text-mega"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <Countdown />

          <p className="mx-auto mt-10 max-w-[46ch] text-center text-sm leading-relaxed text-smoke">
            Kolchi kaylbes. Machi kolchi kay3ref ykhtar. Fifty pieces per size, per colour.
            Nothing restocked.
          </p>
        </div>
      </section>

      {/* Out of focus on purpose */}
      <section className="py-6 md:py-10" aria-label="Chapter 1, out of focus">
        <div className="mx-auto grid max-w-[1100px] gap-16 px-4 md:gap-24 md:px-8">
          {FRAMES.map((frame, i) => (
            <figure
              key={frame.src}
              /* Alternating, and never full width: a centred column of
                 identical blocks reads as a catalogue, which is the one thing
                 this page must not look like. */
              className={
                i % 2 === 0
                  ? "md:ml-0 md:mr-auto md:w-[68%]"
                  : "md:ml-auto md:mr-0 md:w-[58%]"
              }
            >
              <Plate
                seed={frame.src}
                src={frame.src}
                tone={i % 2 === 0 ? "pine" : "wine"}
                alt=""
                /* The line lives under the frame, not burnt across it. */
                caption={null}
                priority={i === 0}
                sizes="(max-width: 768px) 92vw, 60vw"
                className={`w-full ${frame.ratio}`}
              />
              <figcaption className="display mt-6 max-w-[24ch] text-2xl leading-tight md:text-3xl">
                {frame.line}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* The last word */}
      <section className="border-t border-bone/10 py-20 md:py-28" aria-label="Chapter 1">
        <div className="mx-auto max-w-[1600px] px-4 text-center md:px-8">
          <p className="display text-giant leading-[0.9]">
            Kolchi kaylbes.
            <span className="block italic font-light text-silver">
              Machi kolchi kay3ref ykhtar.
            </span>
          </p>
          <p className="label-wide mt-10 text-lime">Chapter 1 — Dreams — 27 September</p>
        </div>
      </section>
    </>
  );
}
