"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { STATUSES, type Status } from "@/lib/order-status";
import { cn } from "@/lib/utils";

const TABS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })),
];

export function OrderFilters({ q, status }: { q: string; status: Status | "all" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [term, setTerm] = useState(q);

  // Keep the box in step when the filters change from anywhere else — a status
  // tab, the back button, a link from the dashboard.
  useEffect(() => setTerm(q), [q]);

  function href(next: { q?: string; status?: Status | "all" }) {
    const sp = new URLSearchParams(params.toString());
    const value = next.q ?? term;
    if (value) sp.set("q", value);
    else sp.delete("q");

    const nextStatus = next.status ?? status;
    if (nextStatus === "all") sp.delete("status");
    else sp.set("status", nextStatus);

    // Any change to the filters invalidates the page number.
    sp.delete("page");
    const query = sp.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  }

  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(href({}));
        }}
        className="relative w-full lg:max-w-sm"
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-smoke"
          strokeWidth={1.75}
        />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Reference, name, phone, city"
          aria-label="Search orders"
          className="w-full rounded-full border border-bone/20 bg-transparent py-3 pr-11 pl-11 text-sm text-bone outline-none transition-colors placeholder:text-smoke/70 focus:border-lime"
        />
        {term && (
          <Link
            href={href({ q: "" })}
            onClick={() => setTerm("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-smoke hover:text-bone"
          >
            <X className="size-4" strokeWidth={1.75} />
          </Link>
        )}
      </form>

      <div className="flex flex-wrap items-center gap-1">
        {TABS.map((tab) => (
          <Link
            key={tab.value}
            href={href({ status: tab.value })}
            aria-current={tab.value === status ? "true" : undefined}
            className={cn(
              "label rounded-full px-4 py-2 transition-colors",
              tab.value === status ? "bg-lime text-ink" : "text-smoke hover:bg-slate hover:text-bone",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
