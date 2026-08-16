"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { removeDiscount, upsertDiscount } from "@/app/admin/offer-actions";
import { Panel } from "@/components/admin/bits";
import type { OfferKind } from "@/lib/offers";
import { cn, formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  slug: string | null;
  kind: OfferKind;
  value: number;
  label: string;
  active: boolean;
  ends_at: string | null;
  created: string;
};

function Save({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label rounded-full bg-lime px-5 py-3 text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function DiscountEditor({
  discounts,
  products,
}: {
  discounts: Row[];
  products: { slug: string; name: string }[];
}) {
  const [state, action] = useActionState(upsertDiscount, {});
  const [del, delAction] = useActionState(removeDiscount, {});
  const [editing, setEditing] = useState<Row | null>(null);
  const [kind, setKind] = useState<OfferKind>("percent");
  const [open, setOpen] = useState(false);

  function edit(row: Row) {
    setEditing(row);
    setKind(row.kind);
    setOpen(true);
  }

  function fresh() {
    setEditing(null);
    setKind("percent");
    setOpen(true);
  }

  return (
    <Panel
      title="Discounts on pieces"
      action={
        !open && (
          <button
            type="button"
            onClick={fresh}
            className="label flex items-center gap-2 text-lime hover:underline"
          >
            <Plus className="size-4" strokeWidth={2} />
            New
          </button>
        )
      }
    >
      {open && (
        <form
          action={action}
          // Remounts on every switch between rows, so the browser does not keep
          // the previous discount's values in the inputs.
          key={editing?.id ?? "new"}
          className="mb-6 grid gap-4 rounded-2xl border border-bone/12 p-4"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <label className="label text-smoke">
            Applies to
            <select
              name="slug"
              defaultValue={editing?.slug ?? "all"}
              className="mt-2 w-full rounded-xl border border-bone/20 bg-charcoal px-4 py-3 text-sm text-bone outline-none focus:border-lime"
            >
              <option value="all">Every piece</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="label text-smoke">
              Type
              <select
                name="kind"
                value={kind}
                onChange={(e) => setKind(e.target.value as OfferKind)}
                className="mt-2 w-full rounded-xl border border-bone/20 bg-charcoal px-4 py-3 text-sm text-bone outline-none focus:border-lime"
              >
                <option value="percent">Percentage off</option>
                <option value="amount">Dirhams off</option>
              </select>
            </label>

            <label className="label text-smoke">
              {kind === "percent" ? "Percent (1–90)" : "Dirhams off each piece"}
              <input
                name="value"
                type="number"
                min={1}
                max={kind === "percent" ? 90 : undefined}
                required
                defaultValue={
                  editing ? (editing.kind === "percent" ? editing.value : editing.value / 100) : ""
                }
                className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none focus:border-lime"
              />
            </label>
          </div>

          <label className="label text-smoke">
            Badge on the site
            <input
              name="label"
              maxLength={40}
              placeholder="Last pieces"
              defaultValue={editing?.label ?? ""}
              className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none focus:border-lime"
            />
          </label>

          <label className="label text-smoke">
            Ends on (optional)
            <input
              name="ends_at"
              type="date"
              defaultValue={editing?.ends_at ? editing.ends_at.slice(0, 10) : ""}
              className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none focus:border-lime"
            />
          </label>

          <label className="label flex items-center gap-3 text-bone">
            <input
              name="active"
              type="checkbox"
              defaultChecked={editing ? editing.active : true}
              className="size-4 accent-lime"
            />
            Live on the site
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Save />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="label text-smoke hover:text-bone"
            >
              Cancel
            </button>
            {state.error && <span className="label text-magenta">{state.error}</span>}
            {state.ok && <span className="label text-lime">{state.ok}</span>}
          </div>
        </form>
      )}

      {discounts.length === 0 ? (
        <p className="text-sm text-smoke">
          No discounts yet. The pre-launch 15% runs on its own until 27 September.
        </p>
      ) : (
        <ul>
          {discounts.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-bone/10 py-3 last:border-0"
            >
              <span
                className={cn(
                  "label rounded-full px-3 py-1 text-[0.65rem]",
                  d.active ? "bg-lime/15 text-lime" : "bg-bone/10 text-smoke",
                )}
              >
                {d.active ? "live" : "off"}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-bone">
                  {d.kind === "percent" ? `${d.value}% off` : `${formatPrice(d.value)} off`} —{" "}
                  {d.slug ? products.find((p) => p.slug === d.slug)?.name ?? d.slug : "every piece"}
                </span>
                <span className="label text-smoke">
                  {d.label}
                  {d.ends_at && ` — until ${d.ends_at.slice(0, 10)}`}
                </span>
              </span>

              <button
                type="button"
                onClick={() => edit(d)}
                className="label text-smoke hover:text-lime"
              >
                Edit
              </button>

              <form action={delAction}>
                <input type="hidden" name="id" value={d.id} />
                <button
                  type="submit"
                  aria-label="Delete discount"
                  className="grid size-8 place-items-center rounded-full text-smoke hover:text-magenta"
                >
                  <Trash2 className="size-4" strokeWidth={1.75} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {del.error && <p className="label mt-3 text-magenta">{del.error}</p>}
    </Panel>
  );
}
