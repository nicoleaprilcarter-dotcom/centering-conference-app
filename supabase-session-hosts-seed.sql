-- ------------------------------------------------------------
-- BREAKOUT PRESENTER SEED
-- Run this in the Supabase SQL Editor (same place as the other
-- seed files) to assign each presenter to their own breakout
-- session. Safe to run more than once: it clears out any existing
-- hosts for these 12 session ids first, then re-adds the current
-- list, so re-running it after an edit here won't create duplicates
-- or leave an old presenter's name on a session.
--
-- Matched by each presenter's own submitted session title against
-- the fixed titles in src/data/sessions.js, not by time slot — the
-- time/room a session runs in (src/data/sessions.js) is a separate
-- scheduling decision from who's presenting it.
--
-- session_id matches src/data/sessions.js: s6a-d is the 11:45 block,
-- s9a-d is the 1:35 block, s10a-d is the 2:40 block. Amber=a,
-- Sapphire=b, Jade=c, Upper Deck=d in every block.
-- ------------------------------------------------------------

delete from session_hosts
where session_id in ('s6a', 's6b', 's6c', 's6d', 's9a', 's9b', 's9c', 's9d', 's10a', 's10b', 's10c', 's10d');

insert into session_hosts (session_id, name, role_en, role_es, sort) values
  -- s6a: "The InnerBeing Reset: From Survival Mode to Soft Life"
  ('s6a',  'Tiara Bostock',            'MSW, LSW, Innerbeing Counseling LLC',                                            'MSW, LSW, Innerbeing Counseling LLC',                                            1),
  -- s6b: "Roots of Resistance: Decoding the Body's Silent Language to Command Your Healthcare"
  ('s6b',  'Koree L. Thatcher',        'Thatcher Lynn Salon and Wellness',                                               'Thatcher Lynn Salon and Wellness',                                               1),
  -- s6c: "More Than Strong: When Strength Becomes Survival"
  ('s6c',  'Dr. Gabrielle Reynolds',   'DSW, LISW-S',                                                                     'DSW, LISW-S',                                                                     1),
  -- s6d: "KNOW Your Power: Helping Women of Color Navigate Healthcare, Tell Their Stories, and Advocate for Better Care"
  ('s6d',  'Moneq "Nikki" Swilling',   'RN, A Queen Empowering Queenz Inc.; Safe and Sacred Care LLC (Toledo)',          'RN, A Queen Empowering Queenz Inc.; Safe and Sacred Care LLC (Toledo)',          1),
  -- s9a: "When Strong Isn't Healthy: Reclaiming Rest, Voice, and the Right to Be Cared For"
  ('s9a',  'Terra Fox Williams',       'Phoenix 4R Solutions',                                                           'Phoenix 4R Solutions',                                                           1),
  -- s9b: "Beyond the Polish: Safe Nail Care for All"
  ('s9b',  'Jessica Dow',              'Lady J Beauty LLC',                                                              'Lady J Beauty LLC',                                                              1),
  -- s9c: "The Weight Of The Crown"
  ('s9c',  'Brandy B. Spears',         'Brandy B Spears Enterprises LLC',                                                'Brandy B Spears Enterprises LLC',                                                1),
  -- s9d: "The Cost of Being Deemed Undeserving: Menstrual Health, Incarceration, and the Politics of Who Deserves Care"
  ('s9d',  'Kayelin Tiggs',            'Founder, Ohio Coalition for Menstrual Equity; Co-Founder & Board Member, The Prison Flow Project', 'Founder, Ohio Coalition for Menstrual Equity; Co-Founder & Board Member, The Prison Flow Project', 1),
  -- s10a: "Pause For You"
  ('s10a', 'Valencia Woodard',         'LSW, Women Who Roar; Founder, Pause For You',                                    'LSW, Women Who Roar; Founder, Pause For You',                                    1),
  -- s10b: "Health Self-Advocacy & Living with Lupus"
  ('s10b', 'Pastor Ida Carson',        'Ida Carson Ministries (Tipp City)',                                              'Ida Carson Ministries (Tipp City)',                                              1),
  -- s10c: "The Many Expressions of Her: Reimagining Health, Wellness, and Joy for Women of Color"
  ('s10c', 'Sonya Wells',              'MSN, FNP-C, Sonya Wells Public Health & Wellness Consulting',                    'MSN, FNP-C, Sonya Wells Public Health & Wellness Consulting',                    1),
  -- s10d: "Beyond the Data: Turning Community Stories Into Advocacy and Action"
  ('s10d', 'Ashley C. Miller',         'MBA, CareSource',                                                                'MBA, CareSource',                                                                1);
