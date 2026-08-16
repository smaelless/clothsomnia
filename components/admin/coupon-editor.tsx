"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { removeCoupon, upsertCoupon } from "@/app/admin/offer-actions";
import { Panel } from "@/components/admin/bits";
import type { OfferKind } from "@/lib/offers";
import { cn, formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  code: string;
  kind: OfferKind;
  value: number;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  min_subtotal: number;
  ends_at: string | null;
  created: string;
};

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label rounded-full bg-lime px-5 py-3 text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function CouponEditor({ coupons }: { coupons: Row[] }) {
  const [state, action] = useActionState(upsertCoupon, {});
  const [del, delAction] = useActionState(removeCoupon, {});
  const [editing, setEditing] = useState<Row | null>(null);
  const [kind, setKind] = useState<OfferKind>("percent");
  const [open, setOpen] = useState(false);

  function edit(row: Row) {
    setEditing(row);
    setKind(row.kind);
    setOpen(true);
  }

  return (
    <Panel
      title="Coupon codes"
      action={
        !open && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setKind("percent");
              setOpen(true);
            }}
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
          key={editing?.id ?? "new"}
          className="mb-6 grid gap-4 rounded-2xl border border-bone/12 p-4"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />

          <label className="label text-smoke">
            Code
            <input
              name="code"
              required
              maxLength={24}
              placeholder="NIGHT10"
              defaultValue={editing?.code ?? ""}
              autoCapitalize="characters"
              spellCheck={false}
              className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm tracking-[0.12em] text-bone uppercase outline-none focus:border-lime"
            />
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
              {kind === "percent" ? "Percent (1–90)" : "Dirhams off the bag"}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="label text-smoke">
              Max uses (blank = unlimited)
              <input
                name="max_uses"
                type="number"
                min={1}
                defaultValue={editing?.max_uses ?? ""}
                className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none focus:border-lime"
              />
            </label>

            <label className="label text-smoke">
              Minimum bag, in dirhams
              <input
                name="min_subtotal"
                type="number"
                min={0}
                defaultValue={editing ? editing.min_subtotal / 100 : ""}
                className="mt-2 w-full rounded-xl border border-bone/20 bg-transparent px-4 py-3 text-sm text-bone outline-none focus:border-lime"
              />
            </label>
          </div>

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
            Usable now
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

      {coupons.length === 0 ? (
        <p className="text-sm text-smoke">
          No codes yet. A code only works when someone types it at the checkout.
        </p>
      ) : (
        <ul>
          {coupons.map((c) => {
            const spent = c.max_uses !== null && c.used_count >= c.max_uses;
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-bone/10 py-3 last:border-0"
              >
                <span
                  className={cn(
                    "label rounded-full px-3 py-1 text-[0.65rem]",
                    spent
                      ? "bg-magenta/15 text-magenta"
                      : c.active
                        ? "bg-lime/15 text-lime"
                        : "bg-bone/10 text-smoke",
                  )}
                >
                  {spent ? "used up" : c.active ? "live" : "off"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="label block truncate tracking-[0.12em] text-bone">{c.code}</span>
                  <span className="label text-smoke">
                    {c.kind === "percent" ? `${c.value}% off` : `${formatPrice(c.value)} off`}
                    {c.min_subtotal > 0 && ` — min ${formatPrice(c.min_subtotal)}`}
                    {` — used ${c.used_count}${c.max_uses !== null ? ` / ${c.max_uses}` : ""}`}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => edit(c)}
                  className="label text-smoke hover:text-lime"
                >
                  Edit
                </button>

                <form action={delAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    aria-label={`Delete ${c.code}`}
                    className="grid size-8 place-items-center rounded-full text-smoke hover:text-magenta"
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}

      {del.error && <p className="label mt-3 text-magenta">{del.error}</p>}
    </Panel>
  );
}
