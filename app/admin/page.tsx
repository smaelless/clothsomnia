import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Empty, NotConfigured, OrderLink, Panel, Stat, StatusPill, when } from "@/components/admin/bits";
import { allOrders, isConfigured, stockLevels, summarise } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";

/**
 * OVERVIEW
 *
 * Answers the four questions worth asking every morning: how much sold, what
 * needs doing today, what is running out, and did anything fail quietly.
 */
export default async function AdminHome() {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const orders = await allOrders();
  const stats = summarise(orders);
  const stock = stockLevels(orders);
  const recent = [...orders].reverse().slice(0, 8);

  const pending = orders.filter((o) => o.status === "pending");
  const lowest = [...stock].sort((a, b) => a.left - b.left).slice(0, 4);
  const soldTotal = stock.reduce((n, r) => n + r.sold, 0);
  const runTotal = stock.reduce((n, r) => n + r.total, 0);

  return (
    <>
      <h1 className="display text-4xl leading-none md:text-5xl">Overview</h1>
      <p className="mt-3 text-sm text-smoke">
        Chapter 1 — {soldTotal} of {runTotal} pieces spoken for.
      </p>

      {/* Things that need a human */}
      {(pending.length > 0 || stats.unnotified > 0) && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {pending.length > 0 && (
            <Link
              href="/admin/orders?status=pending"
              className="flex items-center gap-4 rounded-3xl border border-lime/40 bg-lime/10 p-5 transition-colors hover:bg-lime/15"
            >
              <span className="display text-4xl leading-none text-lime tabular-nums">
                {pending.length}
              </span>
              <span className="text-sm leading-snug text-silver">
                {pending.length === 1 ? "order is" : "orders are"} waiting on a confirmation call.
              </span>
            </Link>
          )}

          {stats.unnotified > 0 && (
            <div className="flex items-center gap-4 rounded-3xl border border-magenta/40 bg-magenta/10 p-5">
              <AlertTriangle className="size-6 shrink-0 text-magenta" strokeWidth={1.75} />
              <span className="text-sm leading-snug text-silver">
                {stats.unnotified} {stats.unnotified === 1 ? "order" : "orders"} never reached
                Telegram. Open {stats.unnotified === 1 ? "it" : "them"} and resend.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Money */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Sold"
          value={formatPrice(stats.revenue)}
          hint={`${stats.units} ${stats.units === 1 ? "piece" : "pieces"}, cancellations excluded`}
          accent
        />
        <Stat
          label="Collected"
          value={formatPrice(stats.collected)}
          hint="Cash in hand — delivered orders only"
        />
        <Stat
          label="Out with couriers"
          value={formatPrice(stats.outstanding)}
          hint="Ordered, not yet paid for"
        />
        <Stat
          label="Average order"
          value={stats.averageOrder > 0 ? formatPrice(stats.averageOrder) : "—"}
          hint={`${stats.today} today · ${stats.week} this week`}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent orders */}
        <Panel
          title="Latest orders"
          action={
            <Link href="/admin/orders" className="label text-lime underline-offset-4 hover:underline">
              See all {stats.orders}
            </Link>
          }
        >
          {recent.length === 0 ? (
            <Empty
              title="No orders yet."
              copy="The moment someone checks out, they appear here and in your Telegram."
            />
          ) : (
            <ul>
              {recent.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-bone/10 py-3 last:border-0"
                >
                  <OrderLink reference={o.reference} />
                  <span className="min-w-0 flex-1 truncate text-sm text-bone">{o.full_name}</span>
                  <span className="hidden text-xs text-smoke sm:inline">{o.city}</span>
                  <span className="label tabular-nums text-silver">{formatPrice(o.total)}</span>
                  <StatusPill status={o.status} />
                  <span className="w-full text-xs text-smoke sm:w-auto">{when(o.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="grid gap-3">
          {/* Stock at risk */}
          <Panel
            title="Running low"
            action={
              <Link href="/admin/stock" className="label text-lime underline-offset-4 hover:underline">
                Full table
              </Link>
            }
          >
            <ul className="grid gap-3">
              {lowest.map((row) => (
                <li key={`${row.colour}-${row.size}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="label text-bone">
                      {row.colour} — {row.size}
                    </span>
                    <span className="label tabular-nums text-smoke">
                      {row.left} / {row.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bone/10">
                    <div
                      className="h-full rounded-full bg-lime"
                      style={{ width: `${(row.left / row.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Where they are */}
          <Panel title="Top cities">
            {stats.topCities.length === 0 ? (
              <p className="text-sm text-smoke">Nothing to show yet.</p>
            ) : (
              <ul className="grid gap-2">
                {stats.topCities.map((c) => (
                  <li key={c.city} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-bone">{c.city}</span>
                    <span className="label tabular-nums text-smoke">{c.orders}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
