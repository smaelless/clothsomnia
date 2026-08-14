import { ActionButton } from "@/components/ui/magnetic";
import { Plate } from "@/components/ui/plate";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[70svh] place-items-center overflow-hidden px-4 py-14">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-40">
        <Plate seed="404-frame" tone="magenta" variant="field" alt="" sizes="100vw" className="h-full w-full" />
      </div>

      <div className="relative max-w-2xl text-center">
        <p className="label-wide mb-8 text-lime">Error 404 — Lost after hours</p>
        <h1 className="display text-giant">
          This door
          <span className="block italic font-light text-silver">goes nowhere</span>
        </h1>
        <p className="mx-auto mt-8 max-w-[44ch] text-base leading-relaxed text-silver">
          The page you were looking for has either been archived, sold out, or never existed.
          It happens at this hour.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ActionButton href="/">Back to the runway</ActionButton>
          <ActionButton href="/collections/new" tone="outline">
            Tonight&apos;s drop
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
