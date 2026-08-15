"use client";

import { Send } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resendNotification } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

function Submit({ sent }: { sent: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "label mt-4 flex items-center gap-2 rounded-full px-5 py-3 transition-colors disabled:opacity-50",
        sent
          ? "border border-bone/20 text-bone hover:border-lime hover:text-lime"
          : "bg-lime text-ink hover:opacity-90",
      )}
    >
      <Send className="size-4" strokeWidth={1.75} />
      {pending ? "Sending…" : sent ? "Send again" : "Send now"}
    </button>
  );
}

export function ResendButton({ reference, sent }: { reference: string; sent: boolean }) {
  const [state, action] = useActionState(resendNotification, {});

  return (
    <form action={action}>
      <input type="hidden" name="reference" value={reference} />
      <Submit sent={sent} />

      {state.ok && <p className="label mt-3 text-lime">{state.ok}</p>}
      {state.error && (
        <p role="alert" className="label mt-3 text-magenta">
          {state.error}
        </p>
      )}
    </form>
  );
}
