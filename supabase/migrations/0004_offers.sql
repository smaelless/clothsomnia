-- Admin-managed offers: per-product discounts, and coupon codes.
--
-- Both tables are server-write and server-read only: RLS is on with no policy,
-- exactly like orders. A coupon table the browser can read is a coupon table
-- every visitor can enumerate.

create table if not exists public.product_discounts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz,

  -- Which product this applies to. NULL means every product, which is how a
  -- storewide sale is expressed without writing one row per piece.
  slug        text,

  kind        text not null check (kind in ('percent', 'amount')),
  -- percent: 1-90. amount: centimes off each piece.
  value       integer not null check (value > 0),

  -- Shown to the shopper on the badge, e.g. "Pre-launch" or "Last pieces".
  label       text not null default 'Offer',

  active      boolean not null default true,
  starts_at   timestamptz,
  ends_at     timestamptz
);

create index if not exists product_discounts_slug_idx on public.product_discounts (slug);
create index if not exists product_discounts_active_idx on public.product_discounts (active);

alter table public.product_discounts enable row level security;

create table if not exists public.coupons (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz,

  -- Always stored uppercase and trimmed, so lookup is exact and a shopper
  -- typing "night10" finds NIGHT10.
  code          text not null unique,

  kind          text not null check (kind in ('percent', 'amount')),
  value         integer not null check (value > 0),

  active        boolean not null default true,
  starts_at     timestamptz,
  ends_at       timestamptz,

  -- NULL means unlimited. used_count only moves when an order is actually
  -- saved, never when a code is merely checked at the checkout.
  max_uses      integer,
  used_count    integer not null default 0,

  -- Floor, in centimes, before the coupon is allowed.
  min_subtotal  integer not null default 0
);

create index if not exists coupons_code_idx on public.coupons (code);

alter table public.coupons enable row level security;

-- What a coupon took off a given order, kept beside the item-level discount so
-- the two are never confused when the numbers are read back.
alter table public.orders
  add column if not exists coupon_code text,
  add column if not exists coupon_discount integer not null default 0;

comment on table public.product_discounts is 'Admin-set discounts. NULL slug = every product.';
comment on table public.coupons is 'Coupon codes. Server-read only — never expose to the browser.';
comment on column public.orders.coupon_discount is 'Amount the coupon took off, in centimes.';

-- Atomic. Read-modify-write from the application would let two orders placed in
-- the same second both read used_count = 49 on a 50-use coupon and both save.
create or replace function public.increment_coupon_use(coupon_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.coupons
     set used_count = used_count + 1,
         updated_at = now()
   where id = coupon_id;
$$;

revoke all on function public.increment_coupon_use(uuid) from public, anon, authenticated;
