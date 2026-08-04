import type { Metadata } from "next";
import { AboutBlock } from "@/components/home/about-block";
import { PrivateList } from "@/components/home/private-list";
import { Plate } from "@/components/ui/plate";
import { SplitLines } from "@/components/ui/reveal";
import { PageHero } from "@/components/ui/page-hero";
import { SectionLabel } from "@/components/ui/wordmark";

export const metadata: Metadata = {
  title: "About",
  description:
    "Clothsomnia makes clothing for the sleepless — designed after dark in Rotterdam, produced in small runs, never restocked.",
};

const CHAPTERS = [
  {
    year: "2021",
    title: "A joke that stuck",
    copy: "Two people who could not sleep started printing shirts at 4am to have something to do. The name was meant to be temporary.",
    tone: "violet" as const,
  },
  {
    year: "2023",
    title: "First chapter",
    copy: "Twelve pieces, one night, one room above a bike shop. It sold out before the sun came up and we have never restocked anything since.",
    tone: "cobalt" as const,
  },
  {
    year: "2025",
    title: "The runway",
    copy: "We stopped calling them collections and started calling them chapters, because that is how they are made — in order, at night, one after another.",
    tone: "magenta" as const,
  },
];

const PRINCIPLES = [
  { k: "Small runs", v: "Sizes are cut in the tens, not the thousands. When a size is gone it is gone." },
  { k: "Real factories", v: "Portugal and Japan, both visited, both named on every product page." },
  { k: "Night light", v: "Every fabric is chosen for how it behaves under artificial light, not daylight." },
  { k: "No sales", v: "We do not discount. Archive pricing exists, seasonal panic does not." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About — The sleepless"
        lines={["Sleep can wait.", "The clothes cannot."]}
        copy="Clothsomnia is a fashion house that keeps the wrong hours on purpose. We design for the expressive, the restless, and everyone who only really comes alive once the day is officially over."
        tone="violet"
        seed="about-hero"
        meta={[
          { k: "Founded", v: "2021" },
          { k: "Based", v: "Rotterdam" },
          { k: "Chapters", v: "11 to date" },
        ]}
      />

      {/* Chapters */}
      <section className="py-24 md:py-32" aria-label="History">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <SectionLabel index="01" className="mb-12">
            How we got here
          </SectionLabel>

          <ul className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {CHAPTERS.map((c, i) => (
              <li key={c.year} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                <Plate
                  seed={`about-${c.year}`}
                  tone={c.tone}
                  variant="field"
                  alt=""
                  sizes="(max-width: 1024px) 92vw, 30vw"
                  className="aspect-[16/10] w-full"
                />
                <p className="label-wide mt-6 text-lime">{c.year}</p>
                <h3 className="display mt-4 text-3xl">{c.title}</h3>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-smoke">{c.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-bone/10 py-24 md:py-32" aria-label="How we work">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <SplitLines
            lines={["Four rules,", "no exceptions"]}
            className="display text-giant"
            lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:font-light [&:nth-child(2)]:text-silver"
          />

          <dl className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-bone/12 bg-bone/10 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={p.k} className="bg-ink p-8 md:p-10">
                <dt className="flex items-baseline gap-4">
                  <span className="label-wide text-smoke">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-2xl">{p.k}</span>
                </dt>
                <dd className="mt-4 max-w-[40ch] text-sm leading-relaxed text-smoke">{p.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <AboutBlock />
      <PrivateList />
    </>
  );
}
