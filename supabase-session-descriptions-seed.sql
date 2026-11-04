-- ------------------------------------------------------------
-- SESSION DESCRIPTIONS SEED
-- Run this in the Supabase SQL Editor to add the "About This
-- Session" text attendees see when they open a session's detail
-- page. Safe to run more than once — on conflict it overwrites with
-- the current text below, so editing a description here and
-- re-running updates it instead of duplicating it.
--
-- session_id matches src/data/sessions.js. Moderators can also add
-- or edit these live from the session detail screen in the app
-- instead of SQL, once signed in as a moderator.
-- ------------------------------------------------------------

insert into session_details (session_id, description_en, description_es)
values (
  's10b',
  'A personal session on living with lupus and learning that self-advocacy in healthcare is necessary.',
  'Una sesión personal sobre vivir con lupus y aprender que la autodefensa en el cuidado de la salud es necesaria.'
)
on conflict (session_id) do update set
  description_en = excluded.description_en,
  description_es = excluded.description_es,
  updated_at = now();
