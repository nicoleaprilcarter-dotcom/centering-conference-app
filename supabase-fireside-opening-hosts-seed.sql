-- ------------------------------------------------------------
-- FIRESIDE CHAT + OPENING CEREMONY SPEAKER SEED
-- Run this in the Supabase SQL Editor to add:
--   - Deb Ault, RN to the Signature Fireside Chat (s8)
--   - Mayor Shenise Turner-Sloss (City of Dayton), Mary McDonald
--     (Commissioner), and Anjeanette Christian (Pfizer) to the
--     Opening Ceremony (s2) for their ~5-minute remarks each
--
-- Safe to run more than once — each insert is skipped if that
-- person is already listed as a host on that session. This only
-- adds to whoever's already there; it doesn't remove anyone.
-- ------------------------------------------------------------

insert into session_hosts (session_id, name, role_en, role_es, sort)
select 's8', 'Deb Ault', 'RN', 'RN', 10
where not exists (select 1 from session_hosts where session_id = 's8' and name = 'Deb Ault');

insert into session_hosts (session_id, name, role_en, role_es, sort)
select 's2', 'Mayor Shenise Turner-Sloss', 'City of Dayton', 'Ciudad de Dayton', 10
where not exists (select 1 from session_hosts where session_id = 's2' and name = 'Mayor Shenise Turner-Sloss');

insert into session_hosts (session_id, name, role_en, role_es, sort)
select 's2', 'Mary McDonald', 'Commissioner', 'Comisionada', 20
where not exists (select 1 from session_hosts where session_id = 's2' and name = 'Mary McDonald');

insert into session_hosts (session_id, name, role_en, role_es, sort)
select 's2', 'Anjeanette Christian', 'Pfizer', 'Pfizer', 30
where not exists (select 1 from session_hosts where session_id = 's2' and name = 'Anjeanette Christian');
