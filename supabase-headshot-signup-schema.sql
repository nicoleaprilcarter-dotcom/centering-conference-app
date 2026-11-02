-- ------------------------------------------------------------
-- PROFESSIONAL HEADSHOT SIGN-UP
-- Run this once in the Supabase SQL Editor (same place as the other
-- schema/seed files) to add the headshot sign-up feature. Safe to
-- run more than once.
--
-- headshot_slots: one row per bookable 10-minute time. `capacity` is
-- how many attendees can book that same time (1 if there's a single
-- photographer, more if there are multiple stations running at once).
--
-- headshot_bookings: who's booked what. Each attendee can hold only
-- one booking at a time (user_id is unique) — booking a new time
-- automatically means they've given up any earlier one, same as a
-- real sign-up sheet.
-- ------------------------------------------------------------

create table if not exists headshot_slots (
  id         bigint generated always as identity primary key,
  label      text not null,
  start_min  int not null,
  capacity   int not null default 1,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table headshot_slots enable row level security;

drop policy if exists "read headshot slots" on headshot_slots;
create policy "read headshot slots" on headshot_slots
  for select to authenticated using (true);

drop policy if exists "moderators manage headshot slots" on headshot_slots;
create policy "moderators manage headshot slots" on headshot_slots
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

create table if not exists headshot_bookings (
  id         bigint generated always as identity primary key,
  slot_id    bigint not null references headshot_slots on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table headshot_bookings enable row level security;

-- Everyone can see how full each slot is (so the app can show
-- "Open"/"Full"); client code only ever displays counts, not who
-- else booked a given time.
drop policy if exists "read headshot bookings" on headshot_bookings;
create policy "read headshot bookings" on headshot_bookings
  for select to authenticated using (true);

-- You can only book as yourself, and only while that slot still has
-- room (capacity check happens here so two attendees can't both grab
-- the last spot from the client alone).
drop policy if exists "book own headshot slot" on headshot_bookings;
create policy "book own headshot slot" on headshot_bookings
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and (select count(*) from headshot_bookings b where b.slot_id = slot_id)
        < (select capacity from headshot_slots s where s.id = slot_id)
  );

drop policy if exists "cancel own headshot booking" on headshot_bookings;
create policy "cancel own headshot booking" on headshot_bookings
  for delete to authenticated
  using (user_id = auth.uid());

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'headshot_slots') then
    alter publication supabase_realtime add table headshot_slots;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'headshot_bookings') then
    alter publication supabase_realtime add table headshot_bookings;
  end if;
end $$;
