import { cn } from "@/lib/utils";

/**
 * The wordmark. Set in the display face with the two halves of the name
 * distinguished by weight — CLOTH is solid, SOMNIA drifts lighter, the way
 * the word itself falls asleep halfway through.
 */
export function Wordmark({
  className,
  showDot = true,
}: {
  className?: string;
  showDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "display inline-flex items-baseline leading-none tracking-[-0.04em]",
        className,
      )}
    >
      <span className="font-semibold">Cloth</span>
      <span className="font-light italic text-silver">somnia</span>
      {showDot && (
        <span
          aria-hidden
          className="ml-[0.12em] inline-block size-[0.14em] translate-y-[-0.06em] rounded-full bg-lime animate-flicker"
        />
      )}
    </span>
  );
}

/** Small tracked-out label used to title every section. */
export function SectionLabel({
  index,
  children,
  className,
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-smoke", className)}>
      {index && <span className="label-wide text-lime">{index}</span>}
      <span aria-hidden className="h-px w-8 bg-bone/25" />
      <span className="label text-silver">{children}</span>
    </div>
  );
}
