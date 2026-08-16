"use client";

import { Check, Tag, X } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

/** The code box. Every answer it shows comes from the server. */
export function CouponField() {
  const { coupon, applyCoupon, clearCoupon, couponPending } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (couponPending) return;
    setError(await applyCoupon(code));
  }

  if (coupon) {
    return (
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-lime/40 bg-lime/10 px-4 py-3">
        <span className="label flex items-center gap-2 text-lime">
          <Check className="size-4" strokeWidth={2} />
          {coupon.code} — {formatPrice(coupon.discount)} off
        </span>
        <button
          type="button"
          onClick={() => {
            clearCoupon();
            setCode("");
          }}
          aria-label="Remove coupon"
          className="grid size-8 place-items-center rounded-full text-smoke transition-colors hover:text-bone"
        >
          <X className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    // Not a nested <form>: this sits inside the checkout form, and a form
    // inside a form is invalid HTML that submits the wrong one.
    <div className="mt-6">
      <label htmlFor="coupon" className="label mb-3 flex items-center gap-2 text-smoke">
        <Tag className="size-3.5" strokeWidth={1.75} />
        Have a code?
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(e);
          }}
          placeholder="NIGHT10"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "coupon-error" : undefined}
          className="w-full rounded-2xl border border-bone/20 bg-transparent px-4 py-3 text-base tracking-[0.12em] text-bone uppercase outline-none transition-colors placeholder:text-smoke/60 placeholder:tracking-normal focus:border-lime"
        />
        <button
          type="button"
          onClick={submit}
          disabled={couponPending || !code.trim()}
          className="label shrink-0 rounded-2xl border border-bone/20 px-5 text-bone transition-colors hover:border-lime hover:text-lime disabled:opacity-40"
        >
          {couponPending ? "…" : "Apply"}
        </button>
      </div>

      {error && (
        <p id="coupon-error" role="alert" className="label mt-2 text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
