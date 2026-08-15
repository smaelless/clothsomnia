import Link from "next/link";

export default function OrderNotFound() {
  return (
    <div className="rounded-3xl border border-dashed border-bone/15 px-6 py-16 text-center">
      <p className="display text-3xl">No order with that reference.</p>
      <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-smoke">
        References look like CLS-4F2A9. Check the spelling, or search by the customer&apos;s phone
        number instead.
      </p>
      <Link
        href="/admin/orders"
        className="label mt-8 inline-block rounded-full bg-lime px-6 py-3 text-ink"
      >
        All orders
      </Link>
    </div>
  );
}
