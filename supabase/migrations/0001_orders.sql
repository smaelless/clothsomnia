-- Chapter 1 orders — cash on delivery.
--
-- Orders are written only by the server (the API route holds the service key),
-- so row level security is enabled with no public policy at all: the anon key
-- can neither read nor write this table. That matters because these rows hold
-- customer names, phone numbers and home addresses.

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Human-readable reference given to the customer, e.g. CLS-4F2A9.
  reference     text not null unique,

  -- Customer
  full_name     text not null,
  phone         text not null,
  city          text not null,
  address       text not null,
  note          text,

  -- What they ordered. Line items are stored as JSON because the catalogue is
  -- a single product today; when it grows this becomes its own table.
  items         jsonb not null,
  item_count    integer not null,

  -- Money, in centimes, captured at order time so a later price change never
  -- rewrites history.
  subtotal      integer not null,
  shipping      integer not null default 0,
  total         integer not null,
  currency      text not null default 'MAD',

  payment_method text not null default 'cod',
  status         text not null default 'pending'
                 check (status in ('pending','confirmed','shipped','delivered','cancelled')),

  -- Set once the Telegram notification has actually gone out, so a failed
  -- notification is visible rather than silent.
  notified_at   timestamptz
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_phone_idx      on public.orders (phone);

alter table public.orders enable row level security;

-- Deliberately no policies: only the service role bypasses RLS, and only the
-- server holds that key.

comment on table public.orders is 'Chapter 1 cash-on-delivery orders. Server-write only.';
