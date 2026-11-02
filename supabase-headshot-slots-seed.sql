-- ------------------------------------------------------------
-- HEADSHOT TIME SLOTS SEED
-- Run this after supabase-headshot-signup-schema.sql. Safe to run
-- more than once — skips a slot that already exists by label.
--
-- This only seeds the 8:30-9:00 AM arrival window, since that's the
-- one window with a clear end time right now. The 11:30 AM
-- "Community Connection & Vendors | Professional Headshots" block is
-- listed as running all day with no stated end, so more slots for it
-- (and for the possible 1:35 PM headshot window from the new agenda
-- PDF, still being confirmed) can be added the same way once there's
-- an actual end time to seed from.
--
-- To add more later, copy a block below and change the label,
-- start_min (minutes since midnight: 8:30 AM = 510), and sort.
-- To change how many people can book the same time, edit `capacity`.
-- ------------------------------------------------------------

insert into headshot_slots (label, start_min, capacity, sort)
select '8:30 AM', 510, 1, 10
where not exists (select 1 from headshot_slots where label = '8:30 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '8:40 AM', 520, 1, 20
where not exists (select 1 from headshot_slots where label = '8:40 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '8:50 AM', 530, 1, 30
where not exists (select 1 from headshot_slots where label = '8:50 AM');
