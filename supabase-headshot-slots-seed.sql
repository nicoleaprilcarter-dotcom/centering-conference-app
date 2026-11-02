-- ------------------------------------------------------------
-- HEADSHOT TIME SLOTS SEED
-- Run this after supabase-headshot-signup-schema.sql. Safe to run
-- more than once — skips a slot that already exists by label.
--
-- Covers all three confirmed headshot windows, each split into
-- 10-minute slots:
--   8:30-9:00 AM   (Upper Deck)
--   11:30 AM-12:20 PM (The Square)
--   1:35-2:25 PM   (near the Gem City rooms)
--
-- To add more later, copy a block below and change the label,
-- start_min (minutes since midnight), and sort.
-- To change how many people can book the same time, edit `capacity`.
-- ------------------------------------------------------------

-- 8:30-9:00 AM
insert into headshot_slots (label, start_min, capacity, sort)
select '8:30 AM', 510, 1, 10
where not exists (select 1 from headshot_slots where label = '8:30 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '8:40 AM', 520, 1, 20
where not exists (select 1 from headshot_slots where label = '8:40 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '8:50 AM', 530, 1, 30
where not exists (select 1 from headshot_slots where label = '8:50 AM');

-- 11:30 AM-12:20 PM
insert into headshot_slots (label, start_min, capacity, sort)
select '11:30 AM', 690, 1, 40
where not exists (select 1 from headshot_slots where label = '11:30 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '11:40 AM', 700, 1, 50
where not exists (select 1 from headshot_slots where label = '11:40 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '11:50 AM', 710, 1, 60
where not exists (select 1 from headshot_slots where label = '11:50 AM');

insert into headshot_slots (label, start_min, capacity, sort)
select '12:00 PM', 720, 1, 70
where not exists (select 1 from headshot_slots where label = '12:00 PM');

insert into headshot_slots (label, start_min, capacity, sort)
select '12:10 PM', 730, 1, 80
where not exists (select 1 from headshot_slots where label = '12:10 PM');

-- 1:35-2:25 PM
insert into headshot_slots (label, start_min, capacity, sort)
select '1:35 PM', 815, 1, 90
where not exists (select 1 from headshot_slots where label = '1:35 PM');

insert into headshot_slots (label, start_min, capacity, sort)
select '1:45 PM', 825, 1, 100
where not exists (select 1 from headshot_slots where label = '1:45 PM');

insert into headshot_slots (label, start_min, capacity, sort)
select '1:55 PM', 835, 1, 110
where not exists (select 1 from headshot_slots where label = '1:55 PM');

insert into headshot_slots (label, start_min, capacity, sort)
select '2:05 PM', 845, 1, 120
where not exists (select 1 from headshot_slots where label = '2:05 PM');

insert into headshot_slots (label, start_min, capacity, sort)
select '2:15 PM', 855, 1, 130
where not exists (select 1 from headshot_slots where label = '2:15 PM');
