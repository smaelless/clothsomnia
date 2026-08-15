-- Columns the admin needs and the storefront never touches.
--
-- Both are nullable with no default, so existing rows are untouched and the
-- order API keeps working without knowing these exist.

alter table public.orders
  add column if not exists updated_at timestamptz,
  add column if not exists admin_note text;

comment on column public.orders.updated_at is 'Last time an admin changed the status or the internal note.';
comment on column public.orders.admin_note is 'Internal only — never shown to the customer.';
