import { NotConfigured, Panel, when } from "@/components/admin/bits";
import { CouponEditor } from "@/components/admin/coupon-editor";
import { DiscountEditor } from "@/components/admin/discount-editor";
import { requireAdmin } from "@/lib/admin";
import { isConfigured } from "@/lib/admin-data";
import { PRODUCTS } from "@/lib/catalog";
import { listCoupons, listProductDiscounts, priceMap } from "@/lib/offers-data";
import { formatPrice } from "@/lib/utils";

export default async function OffersPage() {
  await requireAdmin();
  if (!isConfigured()) return <NotConfigured />;

  const [discounts, coupons, prices] = await Promise.all([
    listProductDiscounts(),
    listCoupons(),
    priceMap(),
  ]);

  return (
    <>
      <h1 className="display text-4xl leading-none md:text-5xl">Offers</h1>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-smoke">
        Discounts apply to a piece automatically. Coupons need a code typed at the checkout. When
        more than one could apply, the shopper gets the single best one — they never stack.
      </p>

      {/* What a shopper sees right now, so a mistake is visible immediately. */}
      <Panel title="Selling right now" className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((p) => {
            const priced = prices[p.slug];
            const off = priced && priced.price < priced.list;
            return (
              <li
                key={p.slug}
                className="flex items-center justify-between gap-4 rounded-2xl border border-bone/12 px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm text-bone">
                    {p.name} — {p.colourway}
                  </span>
                  {off && <span className="label text-lime">{priced.label}</span>}
                </span>
                <span className="shrink-0 text-right">
                  <span className={off ? "label block text-lime" : "label block text-bone"}>
                    {formatPrice(priced?.price ?? p.price)}
                  </span>
                  {off && (
                    <span className="label block text-smoke line-through">
                      {formatPrice(priced.list)}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <DiscountEditor
          discounts={discounts.map((d) => ({
            id: d.id,
            slug: d.slug,
            kind: d.kind,
            value: d.value,
            label: d.label,
            active: d.active,
            ends_at: d.ends_at,
            created: when(d.created_at),
          }))}
          products={PRODUCTS.map((p) => ({
            slug: p.slug,
            name: `${p.name} — ${p.colourway}`,
          }))}
        />

        <CouponEditor
          coupons={coupons.map((c) => ({
            id: c.id,
            code: c.code,
            kind: c.kind,
            value: c.value,
            active: c.active,
            max_uses: c.max_uses,
            used_count: c.used_count,
            min_subtotal: c.min_subtotal,
            ends_at: c.ends_at,
            created: when(c.created_at),
          }))}
        />
      </div>
    </>
  );
}
