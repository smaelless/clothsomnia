import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { NotConfigured, Panel, StatusPill, when } from "@/components/admin/bits";
import { CopyButton } from "@/components/admin/copy-button";
import { NoteForm } from "@/components/admin/note-form";
import { ResendButton } from "@/components/admin/resend-button";
import { StatusControl } from "@/components/admin/status-control";
import { getOrder, isConfigured } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const { reference } = await params;
  const order = await getOrder(reference);
  if (!order) notFound();

  // wa.me wants digits only, no plus.
  const wa = order.phone.replace(/[^0-9]/g, "");
  const fullAddress = `${order.full_name}\n${order.phone}\n${order.address}\n${order.city}`;

  return (
    <>
      <Link
        href="/admin/orders"
        className="label inline-flex items-center gap-2 text-smoke transition-colors hover:text-bone"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        All orders
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <h1 className="display text-4xl leading-none tabular-nums md:text-5xl">
          {order.reference}
        </h1>
        <StatusPill status={order.status} />
      </div>

      <p className="mt-3 text-sm text-smoke">
        Placed {when(order.created_at)}
        {order.updated_at && ` — last touched ${when(order.updated_at)}`}
      </p>

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_1.1fr]">
        {/* ---------------- Customer ---------------- */}
        <div className="grid gap-3">
          <Panel title="Customer" action={<CopyButton value={fullAddress} label="Copy all" />}>
            <p className="display text-2xl">{order.full_name}</p>
            <p className="mt-2 text-base tabular-nums text-silver">{order.phone}</p>

            <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-silver">
              {order.address}
            </p>
            <p className="label mt-2 text-smoke">{order.city}</p>

            {order.note && (
              <div className="mt-6 rounded-2xl border border-bone/12 p-4">
                <p className="label-wide text-smoke">They wrote</p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-bone">
                  {order.note}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`tel:${order.phone}`}
                className="label flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-ink transition-opacity hover:opacity-90"
              >
                <Phone className="size-4" strokeWidth={2} />
                Call
              </a>
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="label flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3 text-bone transition-colors hover:border-lime hover:text-lime"
              >
                <MessageCircle className="size-4" strokeWidth={1.75} />
                WhatsApp
              </a>
            </div>
          </Panel>

          <Panel title="Internal note">
            <NoteForm id={order.id} reference={order.reference} note={order.admin_note ?? ""} />
          </Panel>
        </div>

        {/* ---------------- The order ---------------- */}
        <div className="grid gap-3">
          <Panel title="Status">
            <StatusControl id={order.id} reference={order.reference} current={order.status} />
          </Panel>

          <Panel title="What they ordered">
            <ul>
              {order.items.map((item, i) => (
                <li
                  key={`${item.slug}-${item.colour}-${item.size}-${i}`}
                  className="flex items-baseline justify-between gap-4 border-b border-bone/10 py-4 first:pt-0 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-base text-bone">{item.name}</p>
                    <p className="label mt-1 text-smoke">
                      {item.colour} — {item.size} — ×{item.qty}
                    </p>
                  </div>
                  <span className="label shrink-0 tabular-nums text-silver">
                    {formatPrice(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-bone/12 pt-5">
              <div className="flex justify-between">
                <dt className="label text-smoke">Subtotal</dt>
                <dd className="label tabular-nums text-silver">
                  {formatPrice(order.discount > 0 ? (order.full_subtotal ?? order.subtotal) : order.subtotal)}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="label text-lime">Pre-launch discount</dt>
                  <dd className="label tabular-nums text-lime">−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="label text-smoke">Delivery</dt>
                <dd className="label text-lime">
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-bone/12 pt-4">
                <dt className="label text-smoke">
                  {order.payment_method === "cod" ? "Cash to collect" : "Total"}
                </dt>
                <dd className="display text-3xl tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Telegram">
            {order.notified_at ? (
              <p className="text-sm text-silver">
                Sent {when(order.notified_at)}.{" "}
                <span className="text-smoke">Resend if you lost the message.</span>
              </p>
            ) : (
              <p className="text-sm text-magenta">
                This one never went out. Resend it so nothing is only in the database.
              </p>
            )}
            <ResendButton reference={order.reference} sent={Boolean(order.notified_at)} />
          </Panel>
        </div>
      </div>
    </>
  );
}
