-- ------------------------------------------------------------
-- BREAKOUT PRESENTER SEED
-- Run this in the Supabase SQL Editor (same place as the other
-- seed files) to assign each presenter to their new breakout
-- session. Safe to run more than once: it clears out any existing
-- hosts for these 12 session ids first, then re-adds the current
-- list, so re-running it after an edit here won't create duplicates
-- or leave an old presenter's name on a session.
--
-- session_id matches src/data/sessions.js: s6a-d is the 11:45 block,
-- s9a-d is the 1:35 block, s10a-d is the 2:40 block. Amber=a,
-- Sapphire=b, Jade=c, Upper Deck=d in every block.
-- ------------------------------------------------------------

delete from session_hosts
where session_id in ('s6a', 's6b', 's6c', 's6d', 's9a', 's9b', 's9c', 's9d', 's10a', 's10b', 's10c', 's10d');

insert into session_hosts (session_id, name, role_en, role_es, sort) values
  ('s6a',  'Tiara Bostock',           'MSW, LSW',       'MSW, LSW',       1),
  ('s6b',  'Koree L. Thatcher',       '',               '',               1),
  ('s6c',  'Dr. Gabrielle Reynolds',  'DSW, LISW-S',    'DSW, LISW-S',    1),
  ('s6d',  'Nikki King',              'RN',             'RN',             1),
  ('s9a',  'Terra Fox Williams',      '',               '',               1),
  ('s9b',  'Jessica Dow',             '',               '',               1),
  ('s9c',  'Brandy B. Spears',        '',               '',               1),
  ('s9d',  'Kayelin Tiggs',           '',               '',               1),
  ('s10a', 'Valencia Woodard',        'LSW',            'LSW',            1),
  ('s10b', 'Pastor Ida Carson',       '',               '',               1),
  ('s10c', 'Sonya Wells',             'MSN, FNP-C',     'MSN, FNP-C',     1),
  ('s10d', 'Ashley C. Miller',        'MBA',            'MBA',            1);
