import { Plate } from "@/components/ui/plate";
import { SplitLines } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/wordmark";
import type { Tone } from "@/lib/catalog";

/**
 * Shared opening frame for interior pages — keeps every route inside the same
 * world without repeating the homepage hero's weight.
 */
export function PageHero({
  label,
  lines,
  copy,
  tone = "violet",
  seed,
  meta,
}: {
  label: string;
  lines: string[];
  copy: string;
  tone?: Tone;
  seed: string;
  meta?: { k: string; v: string }[];
}) {
  return (
    <header className="relative overflow-hidden border-b border-bone/10 pb-10 pt-10 md:pb-14 md:pt-14">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-55">
        <Plate seed={seed} tone={tone} variant="field" alt="" sizes="100vw" className="h-full w-full" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/80 via-ink/50 to-ink"
      />

      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <SectionLabel className="mb-8">{label}</SectionLabel>

        <SplitLines
          as="h1"
          lines={lines}
          className="display text-giant"
          lineClassName="[&:nth-child(even)]:italic [&:nth-child(even)]:font-light [&:nth-child(even)]:text-silver"
        />

        <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-silver md:text-lg">{copy}</p>

        {meta && (
          <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6 border-t border-bone/10 pt-8">
            {meta.map((m) => (
              <div key={m.k}>
                <dt className="label-wide text-smoke">{m.k}</dt>
                <dd className="display mt-2 text-xl">{m.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
