-- The pre-launch list: a WhatsApp number and nothing else.
--
-- Server-write only, like orders — RLS on with no policy, so the anon key can
-- neither read nor write. These are personal phone numbers belonging to people
-- who have not bought anything yet, which makes them worth more care, not less.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Normalised to +212XXXXXXXXX before it ever reaches here, so the same
  -- person typing 0612…, +212 612… or 06 12 34 56 78 is one row, not three.
  phone       text not null unique,

  -- Optional: someone who wants a message rather than just a code.
  name        text,

  -- Where they signed up from, so a second campaign can be told apart.
  source      text not null default 'waiting-page',

  -- Set when the pre-drop message actually goes out.
  notified_at timestamptz
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

comment on table public.waitlist is 'Pre-launch WhatsApp list. Server-only.';
