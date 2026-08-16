-- The pre-launch offer: 15% off for anyone who orders before Chapter 1 opens.
--
-- `subtotal` already holds what the customer pays, so these two columns are
-- what the order would have cost and what came off. Kept because "319 became
-- 271" is a question someone will ask in six months, and recomputing it later
-- from a discount rate that may have changed is guesswork.
--
-- Defaulted rather than nullable so every row, including the ones written
-- before this migration, reports a real number instead of null.

alter table public.orders
  add column if not exists full_subtotal integer,
  add column if not exists discount integer not null default 0;

-- Orders placed before the offer existed were charged list price.
update public.orders set full_subtotal = subtotal where full_subtotal is null;

comment on column public.orders.full_subtotal is 'Bag at list price, before any discount.';
comment on column public.orders.discount is 'Amount taken off, in centimes. 0 after the drop.';
