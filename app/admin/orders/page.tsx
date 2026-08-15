import Link from "next/link";
import { Download } from "lucide-react";
import { Empty, NotConfigured, OrderLink, StatusPill, when } from "@/components/admin/bits";
import { OrderFilters } from "@/components/admin/order-filters";
import { STATUSES, type Status, isConfigured, listOrders } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin";
import { cn, formatPrice } from "@/lib/utils";

type Search = { q?: string; status?: string; page?: string };

function asStatus(value: string | undefined): Status | "all" {
  return STATUSES.includes(value as Status) ? (value as Status) : "all";
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const params = await searchParams;
  const status = asStatus(params.status);
  const q = params.q?.trim() ?? "";
  const page = Number(params.page) || 1;

  const { orders, total, pages } = await listOrders({ q, status, page });

  // Preserve the current filters when paging, so page 2 of a search is still
  // the same search.
  const link = (next: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "all") sp.set("status", status);
    if (next > 1) sp.set("page", String(next));
    const query = sp.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl leading-none md:text-5xl">Orders</h1>
          <p className="mt-3 text-sm text-smoke">
            {total} {total === 1 ? "order" : "orders"}
            {status !== "all" && ` — ${status}`}
            {q && ` matching “${q}”`}
          </p>
        </div>

        <a
          href="/admin/export"
          className="label flex items-center gap-2 rounded-full border border-bone/20 px-5 py-3 text-smoke transition-colors hover:border-lime hover:text-lime"
        >
          <Download className="size-4" strokeWidth={1.75} />
          Export CSV
        </a>
      </div>

      <OrderFilters q={q} status={status} />

      {orders.length === 0 ? (
        <div className="mt-6">
          <Empty
            title={q || status !== "all" ? "Nothing matches." : "No orders yet."}
            copy={
              q || status !== "all"
                ? "Try a different name, phone number or reference — or clear the filters."
                : "Orders land here the second someone checks out."
            }
          />
        </div>
      ) : (
        <>
          {/* Table on wide screens */}
          <div className="mt-6 hidden overflow-x-auto rounded-3xl border border-bone/12 lg:block">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-bone/12 bg-charcoal/60">
                  {["Reference", "Placed", "Customer", "Where", "Pieces", "Total", "Status"].map(
                    (h) => (
                      <th key={h} className="label-wide px-5 py-4 font-normal text-smoke">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-bone/8 last:border-0 hover:bg-slate/50">
                    <td className="px-5 py-4">
                      <OrderLink reference={o.reference} />
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap text-smoke">
                      {when(o.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-bone">{o.full_name}</p>
                      <p className="text-xs tabular-nums text-smoke">{o.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-silver">{o.city}</td>
                    <td className="px-5 py-4 label tabular-nums text-silver">{o.item_count}</td>
                    <td className="px-5 py-4 label tabular-nums text-bone">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on phones — a seven-column table is unusable at 375px */}
          <ul className="mt-6 grid gap-3 lg:hidden">
            {orders.map((o) => (
              <li key={o.id} className="rounded-3xl border border-bone/12 bg-charcoal/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <OrderLink reference={o.reference} />
                  <StatusPill status={o.status} />
                </div>
                <p className="mt-3 text-sm text-bone">{o.full_name}</p>
                <p className="text-xs tabular-nums text-smoke">
                  {o.phone} — {o.city}
                </p>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="text-xs text-smoke">{when(o.created_at)}</span>
                  <span className="label tabular-nums text-bone">
                    {o.item_count} × — {formatPrice(o.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pages">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={link(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "label rounded-full px-4 py-2 tabular-nums transition-colors",
                    n === page ? "bg-lime text-ink" : "text-smoke hover:bg-slate hover:text-bone",
                  )}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </>
  );
}
