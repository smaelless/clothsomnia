import Link from "next/link";
import type { Status } from "@/lib/order-status";
import { cn } from "@/lib/utils";

/** Small shared pieces, so every admin screen reads the same way. */

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-bone/12 bg-charcoal/60 p-5 md:p-6", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h2 className="label-wide text-smoke">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-bone/12 bg-charcoal/60 p-5">
      <p className="label-wide text-smoke">{label}</p>
      <p
        className={cn(
          "display mt-3 text-3xl leading-none tabular-nums md:text-4xl",
          accent && "text-lime",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-smoke">{hint}</p>}
    </div>
  );
}

/**
 * Status colours carry meaning: lime is done, magenta is dead, and pending is
 * deliberately the loudest thing on a list because it is the only one that
 * needs someone to pick up a phone.
 */
const STATUS_STYLE: Record<Status, string> = {
  pending: "border-lime/50 bg-lime/15 text-lime",
  confirmed: "border-silver/40 bg-silver/10 text-silver",
  shipped: "border-cobalt/60 bg-cobalt/20 text-silver",
  delivered: "border-pine/70 bg-pine/30 text-cream",
  cancelled: "border-magenta/40 bg-magenta/10 text-magenta",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "label inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[0.65rem]",
        STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
  );
}

export function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-bone/15 px-6 py-16 text-center">
      <p className="display text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-smoke">{copy}</p>
    </div>
  );
}

/**
 * Shown instead of a stack trace when the Supabase keys are missing. Somebody
 * hitting this needs to know which variable to set, not what threw.
 */
export function NotConfigured() {
  return (
    <div className="rounded-3xl border border-magenta/40 p-6">
      <h2 className="display text-2xl">The database is not connected.</h2>
      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-silver">
        Set <code className="text-lime">SUPABASE_URL</code> and{" "}
        <code className="text-lime">SUPABASE_SERVICE_ROLE_KEY</code> in your environment. Until then
        orders cannot be read or written, and the storefront checkout returns an error too.
      </p>
    </div>
  );
}

/** Dates read as "14 Aug, 21:40" — the year is noise inside a single drop. */
export function when(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderLink({ reference }: { reference: string }) {
  return (
    <Link
      href={`/admin/orders/${reference}`}
      className="label tabular-nums text-bone underline-offset-4 hover:text-lime hover:underline"
    >
      {reference}
    </Link>
  );
}
