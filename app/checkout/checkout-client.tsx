"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Truck, Undo2, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Plate } from "@/components/ui/plate";
import { ActionButton } from "@/components/ui/magnetic";
import { CouponField } from "@/components/checkout/coupon-field";
import { EASE_OUT } from "@/lib/motion";
import { cn, formatPrice } from "@/lib/utils";
import { useStore } from "@/providers/store";

type Fields = { fullName: string; phone: string; city: string; address: string; note: string };

const EMPTY: Fields = { fullName: "", phone: "", city: "", address: "", note: "" };

/**
 * CHECKOUT — cash on delivery.
 *
 * No payment step: the customer confirms who they are and where they live, and
 * pays the courier. Everything money-related is recalculated server-side, so
 * this form only has to be clear and hard to get wrong.
 */
export function CheckoutClient() {
  const { detailedLines, subtotal, fullSubtotal, discount, total, coupon, count, clear, priceFor } =
    useStore();
  const reduced = useReducedMotion();

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ reference: string; total: number } | null>(null);

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setErrors({});

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          items: detailedLines.map((l) => ({
            slug: l.slug,
            size: l.size,
            color: l.color,
            qty: l.qty,
          })),
          // Sent as a code, not as an amount. The server decides what it is worth.
          coupon: coupon?.code ?? undefined,
        }),
      });

      if (res.status === 422) {
        const data = await res.json();
        setErrors(data.errors ?? {});
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ form: data.error ?? "Something went wrong. Please try again." });
        return;
      }

      const data = await res.json();
      setDone({ reference: data.reference, total: data.total });
      clear();
    } catch {
      setErrors({ form: "No connection. Check your network and try again." });
    } finally {
      setSending(false);
    }
  }

  /* ---------------- Confirmed ---------------- */
  if (done) {
    return (
      <section className="py-12 md:py-16" aria-label="Order confirmed">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-8">
          <motion.span
            initial={reduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mx-auto grid size-16 place-items-center rounded-full bg-lime"
          >
            <Check className="size-8 text-ink" strokeWidth={3} />
          </motion.span>

          <h1 className="display mt-10 text-huge leading-[0.95]">Order placed.</h1>

          <p className="label-wide mt-8 text-lime">Your reference</p>
          <p className="display mt-3 text-4xl tracking-wide">{done.reference}</p>

          <p className="mx-auto mt-8 max-w-[46ch] text-base leading-relaxed text-silver">
            We will call you on the number you gave to confirm before shipping. You pay the
            courier {formatPrice(done.total)} in cash when it arrives — nothing to pay now.
          </p>

          <p className="mt-6 text-sm text-smoke">
            Write the reference down. It is how we find your order if you call.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ActionButton href="/">Back to Clothsomnia</ActionButton>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Empty bag ---------------- */
  if (count === 0) {
    return (
      <section className="py-14" aria-label="Empty bag">
        <div className="mx-auto max-w-2xl px-4 text-center md:px-8">
          <h1 className="display text-huge leading-[0.95]">Your bag is empty.</h1>
          <p className="mx-auto mt-6 max-w-[40ch] text-base leading-relaxed text-silver">
            Nothing to check out yet. Chapter 1 is one hoodie in two colourways.
          </p>
          <div className="mt-10">
            <ActionButton href="/collections/new">See the drop</ActionButton>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <section className="py-12 md:py-16" aria-label="Checkout">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* Details */}
        <form onSubmit={submit} noValidate>
          <h2 className="display text-3xl">Where is it going?</h2>
          <p className="mt-3 text-sm text-smoke">
            Cash on delivery — you pay the courier. We only need enough to find you.
          </p>

          <div className="mt-10 grid gap-6">
            <Field
              id="fullName"
              label="Full name"
              value={fields.fullName}
              onChange={(v) => set("fullName", v)}
              error={errors.fullName}
              autoComplete="name"
            />
            <Field
              id="phone"
              label="Phone"
              hint="We call this number to confirm."
              value={fields.phone}
              onChange={(v) => set("phone", v)}
              error={errors.phone}
              autoComplete="tel"
              inputMode="tel"
              placeholder="06 12 34 56 78"
            />
            <Field
              id="city"
              label="City"
              value={fields.city}
              onChange={(v) => set("city", v)}
              error={errors.city}
              autoComplete="address-level2"
            />
            <Field
              id="address"
              label="Address"
              hint="Street, building, floor, and a landmark if it helps."
              value={fields.address}
              onChange={(v) => set("address", v)}
              error={errors.address}
              autoComplete="street-address"
              multiline
            />
            <Field
              id="note"
              label="Note (optional)"
              value={fields.note}
              onChange={(v) => set("note", v)}
              multiline
            />
          </div>

          <CouponField />

          <AnimatePresence>
            {(errors.form || errors.items || errors.coupon) && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="label mt-8 text-magenta"
              >
                {errors.form || errors.items || errors.coupon}
              </motion.p>
            )}
          </AnimatePresence>

          <ActionButton
            type="submit"
            className="mt-10 w-full"
            disabled={sending}
            onClick={() => undefined}
          >
            {sending ? "Placing your order…" : `Place order — ${formatPrice(total)}`}
          </ActionButton>

          <p className="mt-5 text-center text-xs text-smoke">
            No card, no payment now. You pay in cash when it reaches you.{" "}
            <Link href="/shipping" className="text-lime underline-offset-4 hover:underline">Shipping</Link>{" and "}
            <Link href="/returns" className="text-lime underline-offset-4 hover:underline">returns</Link>.
          </p>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="display text-3xl">Your bag</h2>

          <ul className="mt-8">
            {detailedLines.map((line) => (
              <li key={line.id} className="flex gap-4 border-b border-bone/10 py-5">
                <Plate
                  seed={line.slug}
                  tone={line.product.tone}
                  alt=""
                  sizes="80px"
                  className="h-28 w-20 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="display truncate text-lg">{line.product.name}</p>
                  <p className="label-wide mt-2 text-smoke">
                    {line.color} — {line.size} — ×{line.qty}
                  </p>
                  <p className="label mt-auto text-bone">
                    {formatPrice(priceFor(line.product).price * line.qty)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3">
            <div className="flex justify-between">
              <dt className="label text-smoke">Subtotal</dt>
              <dd className="label text-bone">
                {formatPrice(discount > 0 ? fullSubtotal : subtotal)}
              </dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="label text-lime">Offer</dt>
                <dd className="label text-lime">−{formatPrice(discount)}</dd>
              </div>
            )}
            {coupon && (
              <div className="flex justify-between">
                <dt className="label text-lime">Code {coupon.code}</dt>
                <dd className="label text-lime">−{formatPrice(coupon.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="label text-smoke">Delivery</dt>
              <dd className="label text-lime">Free</dd>
            </div>
            <div className="flex justify-between border-t border-bone/12 pt-4">
              <dt className="label text-smoke">Total to pay on delivery</dt>
              <dd className="display text-2xl">{formatPrice(total)}</dd>
            </div>
          </dl>

          <ul className="mt-8 grid gap-3 border-t border-bone/10 pt-8">
            {[
              { Icon: Wallet, text: "Cash on delivery — pay the courier, not the website." },
              { Icon: Truck, text: "Free delivery anywhere in Morocco." },
              { Icon: Undo2, text: "We call to confirm before anything ships." },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-silver">
                <Icon className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={1.5} />
                {text}
              </li>
            ))}
          </ul>

          <Link
            href="/collections/new"
            className="label mt-8 inline-block text-smoke underline-offset-4 hover:text-bone hover:underline"
          >
            Keep looking
          </Link>
        </aside>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  multiline,
  ...rest
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  multiline?: boolean;
  // Omit the native handlers we replace, so the string-based onChange above is
  // not widened back to a ChangeEvent by the spread.
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  const shared = cn(
    "w-full rounded-2xl border bg-transparent px-5 py-4 text-base text-bone outline-none transition-colors placeholder:text-smoke/70",
    error ? "border-magenta" : "border-bone/20 focus:border-lime",
  );

  return (
    <div>
      <label htmlFor={id} className="label mb-3 block text-smoke">
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={shared}
          {...rest}
        />
      )}

      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-smoke">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="label mt-2 text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}
