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
  ('s6a',  'Valencia Woodard',    'LSW, CEO, Women Who Roar',                                              'LSW, CEO, Women Who Roar',                                              1),
  ('s6b',  'Jessica Dow',         'CEO, Lady J Beauty LLC',                                                 'CEO, Lady J Beauty LLC',                                                 1),
  ('s6c',  'Brandy B Spears',     'PMP, PSM, CEO, Brandy B Spears Enterprises',                             'PMP, PSM, CEO, Brandy B Spears Enterprises',                             1),
  ('s6d',  'Ashley C. Miller',    'MBA, CareSource',                                                        'MBA, CareSource',                                                        1),
  ('s9a',  'Sonya Wells',         'MSN, APRN, FNP-C, CEO & Principal Consultant',                           'MSN, APRN, FNP-C, CEO & Principal Consultant',                           1),
  ('s9b',  'Korree L. Thatcher',  'CEO, Thatcher Lynn Salon and Wellness',                                  'CEO, Thatcher Lynn Salon and Wellness',                                  1),
  ('s9c',  'Dr. Gabrielle Reynolds', 'DSW, LISW-S, Speaker',                                                'DSW, LISW-S, Speaker',                                                   1),
  ('s9d',  'Kayelin Tiggs',       'Co-Founder, Ohio Coalition for Menstrual Equity; The Prison Flow Project & Miss Ohio USA', 'Co-Founder, Ohio Coalition for Menstrual Equity; The Prison Flow Project & Miss Ohio USA', 1),
  ('s10a', 'Tiara Bostock',       'MSW, LSW, Founder, Innerbeing Counseling LLC',                           'MSW, LSW, Founder, Innerbeing Counseling LLC',                           1),
  ('s10b', 'Pastor Ida Carson',   'Founder, Ida Carson Ministries & Program Director, Winning Warriors for Lupus', 'Founder, Ida Carson Ministries & Program Director, Winning Warriors for Lupus', 1),
  ('s10c', 'Nikki King',         'RN, CEO, A Queen Empowering Queenz Inc. & Safe & Sacred Care LLC',       'RN, CEO, A Queen Empowering Queenz Inc. & Safe & Sacred Care LLC',       1),
  ('s10d', 'Terra Fox Williams',  'MPH, CEO & Founder, Phoenix 4R Solutions',                               'MPH, CEO & Founder, Phoenix 4R Solutions',                               1);
