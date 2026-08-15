"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveNote } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label mt-4 rounded-full border border-bone/20 px-5 py-3 text-bone transition-colors hover:border-lime hover:text-lime disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save note"}
    </button>
  );
}

export function NoteForm({
  id,
  reference,
  note,
}: {
  id: string;
  reference: string;
  note: string;
}) {
  const [state, action] = useActionState(saveNote, {});

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="reference" value={reference} />

      <textarea
        name="note"
        rows={4}
        defaultValue={note}
        maxLength={2000}
        placeholder="Called twice, no answer. Trying again tomorrow."
        aria-label="Internal note"
        className="w-full resize-y rounded-2xl border border-bone/20 bg-transparent px-4 py-3 text-sm leading-relaxed text-bone outline-none transition-colors placeholder:text-smoke/60 focus:border-lime"
      />

      <div className="flex flex-wrap items-center gap-4">
        <Submit />
        {state.ok && <span className="label text-lime">{state.ok}</span>}
        {state.error && (
          <span role="alert" className="label text-magenta">
            {state.error}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-smoke">Only you see this. It is never sent to the customer.</p>
    </form>
  );
}
