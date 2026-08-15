"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateStatus } from "@/app/admin/actions";
import { STATUSES, type Status } from "@/lib/order-status";
import { cn } from "@/lib/utils";

const EXPLAINS: Record<Status, string> = {
  pending: "Just came in. Nobody has called yet.",
  confirmed: "Called, they confirmed. Ready to pack.",
  shipped: "With the courier.",
  delivered: "Delivered and paid for in cash.",
  cancelled: "Called off. The pieces go back into stock.",
};

function Button({ value, active }: { value: Status; active: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || active}
      aria-pressed={active}
      className={cn(
        "label rounded-full px-4 py-2.5 transition-colors disabled:cursor-default",
        active
          ? "bg-lime text-ink"
          : "border border-bone/20 text-smoke hover:border-lime hover:text-lime disabled:opacity-40",
      )}
    >
      {pending ? "…" : value}
    </button>
  );
}

export function StatusControl({
  id,
  reference,
  current,
}: {
  id: string;
  reference: string;
  current: Status;
}) {
  const [state, action] = useActionState(updateStatus, {});

  return (
    <div>
      {/*
        One form per status, rather than one form with five submit buttons.
        useActionState submits the form itself and drops the submitter's
        name/value, so a shared form arrives at the server with no status at all
        — the choice has to be a hidden field to survive the trip.
      */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <form key={s} action={action}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="reference" value={reference} />
            <input type="hidden" name="status" value={s} />
            <Button value={s} active={s === current} />
          </form>
        ))}
      </div>

      <p className="mt-4 text-sm text-smoke">{EXPLAINS[current]}</p>

      {state.error && (
        <p role="alert" className="label mt-3 text-magenta">
          {state.error}
        </p>
      )}
      {state.ok && <p className="label mt-3 text-lime">{state.ok}</p>}
    </div>
  );
}
