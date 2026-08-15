import { NotConfigured, Panel } from "@/components/admin/bits";
import { allOrders, isConfigured, stockLevels } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin";
import { LOW_STOCK_AT, PRODUCTS } from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";

export default async function StockPage() {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const orders = await allOrders();
  const rows = stockLevels(orders);

  const sold = rows.reduce((n, r) => n + r.sold, 0);
  const run = rows.reduce((n, r) => n + r.total, 0);
  const left = run - sold;

  const colours = [...new Set(rows.map((r) => r.colour))];

  return (
    <>
      <h1 className="display text-4xl leading-none md:text-5xl">Stock</h1>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-smoke">
        Counted from the orders themselves rather than stored, so it can never fall out of step.
        Cancelling an order puts its pieces straight back.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Panel>
          <p className="label-wide text-smoke">Sold</p>
          <p className="display mt-3 text-4xl tabular-nums text-lime">{sold}</p>
        </Panel>
        <Panel>
          <p className="label-wide text-smoke">Left</p>
          <p className="display mt-3 text-4xl tabular-nums">{left}</p>
        </Panel>
        <Panel>
          <p className="label-wide text-smoke">Still to earn</p>
          <p className="display mt-3 text-4xl tabular-nums">
            {formatPrice(left * PRODUCTS[0].price)}
          </p>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {colours.map((colour) => {
          const set = rows.filter((r) => r.colour === colour);
          const hex = set[0].hex;

          return (
            <Panel key={colour}>
              <div className="mb-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-5 rounded-full border border-bone/25"
                  style={{ backgroundColor: hex }}
                />
                <h2 className="display text-2xl">{colour}</h2>
                <span className="label ml-auto tabular-nums text-smoke">
                  {set.reduce((n, r) => n + r.left, 0)} left
                </span>
              </div>

              <ul className="grid gap-5">
                {set.map((row) => {
                  const gone = row.left === 0;
                  const low = !gone && row.left <= LOW_STOCK_AT;

                  return (
                    <li key={row.size}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="label text-bone">Size {row.size}</span>
                        <span
                          className={cn(
                            "label tabular-nums",
                            gone ? "text-magenta" : low ? "text-lime" : "text-smoke",
                          )}
                        >
                          {gone ? "Sold out" : `${row.left} of ${row.total}`}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-bone/10">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width]",
                            gone ? "bg-magenta" : low ? "bg-lime" : "bg-silver/70",
                          )}
                          style={{ width: `${(row.left / row.total) * 100}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-smoke">
                        {row.sold} ordered
                        {low && " — nearly gone"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
