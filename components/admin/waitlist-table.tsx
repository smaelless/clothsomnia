"use client";

import { Check, MessageCircle, Search, Trash2, Undo2, X } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteSignup, markEveryone, toggleNotified } from "@/app/admin/waitlist-actions";
import { CopyButton } from "@/components/admin/copy-button";
import { Panel } from "@/components/admin/bits";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  phone: string;
  name: string | null;
  when: string;
  notified: boolean;
};

/**
 * THE LIST, in the admin.
 *
 * Built around how it will actually be used: a broadcast to everyone at once,
 * not a hundred individual messages. So the numbers are available as one block
 * to paste, the whole list can be marked as told in a single action, and the
 * per-row controls exist for the exceptions — a wrong number, someone who
 * asked to be taken off.
 */
export function WaitlistTable({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [onlyWaiting, setOnlyWaiting] = useState(false);

  const [markState, markAction] = useActionState(markEveryone, {});
  const [toggleState, toggleAction] = useActionState(toggleNotified, {});
  const [delState, delAction] = useActionState(deleteSignup, {});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyWaiting && r.notified) return false;
      if (!q) return true;
      return (
        r.phone.toLowerCase().includes(q) || (r.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, onlyWaiting]);

  /* Comma separated: what WhatsApp Business and every broadcast tool expects. */
  const numbers = filtered.map((r) => r.phone).join(", ");
  const waiting = rows.filter((r) => !r.notified).length;

  return (
    <>
      <Panel
        title={`${filtered.length} number${filtered.length === 1 ? "" : "s"} — ready to paste`}
        action={numbers ? <CopyButton value={numbers} label="Copy all" /> : undefined}
        className="mt-8"
      >
        {numbers ? (
          <>
            <p className="text-sm leading-relaxed break-words text-silver">{numbers}</p>
            <p className="mt-4 text-xs text-smoke">
              Paste into one WhatsApp broadcast. Send the code once, to everyone at the same
              time — that is the whole point of having collected these.
            </p>
          </>
        ) : (
          <p className="text-sm text-smoke">Nothing matches that filter.</p>
        )}

        {waiting > 0 && (
          <form action={markAction} className="mt-6 flex flex-wrap items-center gap-4">
            <MarkAllButton count={waiting} />
            <span className="text-xs text-smoke">
              Records that the message went out. It does not send anything.
            </span>
          </form>
        )}

        {markState.ok && <p className="label mt-3 text-lime">{markState.ok}</p>}
        {markState.error && <p className="label mt-3 text-magenta">{markState.error}</p>}
      </Panel>

      {/* Filters */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-smoke"
            strokeWidth={1.75}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a number"
            aria-label="Search the list"
            className="w-full rounded-full border border-bone/20 bg-transparent py-3 pr-10 pl-11 text-sm text-bone outline-none transition-colors placeholder:text-smoke/70 focus:border-lime"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-smoke hover:text-bone"
            >
              <X className="size-4" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOnlyWaiting((v) => !v)}
          aria-pressed={onlyWaiting}
          className={cn(
            "label shrink-0 rounded-full px-5 py-3 transition-colors",
            onlyWaiting ? "bg-lime text-ink" : "border border-bone/20 text-smoke hover:text-bone",
          )}
        >
          Not told yet ({waiting})
        </button>
      </div>

      {/* Rows */}
      <Panel className="mt-3">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-smoke">Nothing to show.</p>
        ) : (
          <ul>
            {filtered.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-bone/10 py-3 last:border-0"
              >
                <span
                  className={cn(
                    "label rounded-full px-3 py-1 text-[0.65rem]",
                    r.notified ? "bg-pine/40 text-cream" : "bg-lime/15 text-lime",
                  )}
                >
                  {r.notified ? "told" : "waiting"}
                </span>

                <span className="label tabular-nums text-bone">{r.phone}</span>
                {r.name && <span className="text-sm text-silver">{r.name}</span>}

                <span className="ml-auto text-xs whitespace-nowrap text-smoke">{r.when}</span>

                {/* wa.me wants digits only, no plus. */}
                <a
                  href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Message ${r.phone} on WhatsApp`}
                  className="grid size-8 place-items-center rounded-full text-smoke transition-colors hover:text-lime"
                >
                  <MessageCircle className="size-4" strokeWidth={1.75} />
                </a>

                <form action={toggleAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="notified" value={r.notified ? "0" : "1"} />
                  <button
                    type="submit"
                    aria-label={r.notified ? "Mark as not told" : "Mark as told"}
                    className="grid size-8 place-items-center rounded-full text-smoke transition-colors hover:text-lime"
                  >
                    {r.notified ? (
                      <Undo2 className="size-4" strokeWidth={1.75} />
                    ) : (
                      <Check className="size-4" strokeWidth={2} />
                    )}
                  </button>
                </form>

                <form action={delAction}>
                  <input type="hidden" name="id" value={r.id} />
                  <button
                    type="submit"
                    aria-label={`Remove ${r.phone}`}
                    className="grid size-8 place-items-center rounded-full text-smoke transition-colors hover:text-magenta"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        {toggleState.error && <p className="label mt-3 text-magenta">{toggleState.error}</p>}
        {delState.error && <p className="label mt-3 text-magenta">{delState.error}</p>}
      </Panel>
    </>
  );
}

function MarkAllButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label rounded-full bg-lime px-5 py-3 text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Marking…" : `Mark all ${count} as told`}
    </button>
  );
}
