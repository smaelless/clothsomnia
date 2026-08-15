"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/app/admin/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="label mt-6 w-full rounded-full bg-lime px-6 py-4 text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(signIn, {});

  return (
    <form action={action} className="mt-8">
      <label htmlFor="password" className="label mb-3 block text-smoke">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        className="w-full rounded-2xl border border-bone/20 bg-transparent px-5 py-4 text-base text-bone outline-none transition-colors focus:border-lime"
      />

      {state.error && (
        <p role="alert" className="label mt-4 text-magenta">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
