-- ============================================================
-- Centering Women of Color Conference 2026 — database schema
-- HUES Women's Health Advocacy Institute
--
-- HOW TO RUN THIS:
--   1. Open your project at supabase.com
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New query", paste this whole file in, click "Run"
--
-- Running it twice is safe — it drops and recreates cleanly.
-- (Adding profile photos, lobby chat, and direct messages on 2026-09-14:
-- this version can be re-run on top of the original one safely too.)
-- ============================================================


-- ------------------------------------------------------------
-- PROFILES
-- One row per attendee. Created after they sign in.
-- ------------------------------------------------------------
create table if not exists profiles (
  id            uuid primary key references auth.users on delete cascade,
  display_name  text not null default '',
  pronouns      text not null default '',
  bio           text not null default '',
  interests     text[] not null default '{}',
  visible       boolean not null default true,
  is_moderator  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table profiles enable row level security;

-- Anyone signed in can see profiles that opted into the directory.
drop policy if exists "read visible profiles" on profiles;
create policy "read visible profiles" on profiles
  for select to authenticated
  using (visible = true or id = auth.uid());

-- You can only create your own profile.
drop policy if exists "insert own profile" on profiles;
create policy "insert own profile" on profiles
  for insert to authenticated
  with check (id = auth.uid());

-- You can only edit your own profile.
drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- You can delete your own profile.
drop policy if exists "delete own profile" on profiles;
create policy "delete own profile" on profiles
  for delete to authenticated
  using (id = auth.uid());


-- ------------------------------------------------------------
-- SAVED SESSIONS
-- Which sessions an attendee starred.
-- ------------------------------------------------------------
create table if not exists saved_sessions (
  user_id    uuid not null references auth.users on delete cascade,
  session_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

alter table saved_sessions enable row level security;

drop policy if exists "own saved sessions" on saved_sessions;
create policy "own saved sessions" on saved_sessions
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- SESSION CHAT
-- One row per message. hidden = removed by a moderator.
-- ------------------------------------------------------------
create table if not exists messages (
  id         bigint generated always as identity primary key,
  session_id text not null,
  user_id    uuid not null references auth.users on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  hidden     boolean not null default false,
  visibility text not null default 'public',
  created_at timestamptz not null default now()
);

create index if not exists messages_session_idx on messages (session_id, created_at);

alter table messages add column if not exists visibility text not null default 'public';
alter table messages drop constraint if exists messages_visibility_check;
alter table messages add constraint messages_visibility_check check (visibility in ('public', 'anonymous', 'private', 'staff'));

alter table messages enable row level security;

-- Everyone signed in reads public/anonymous messages that have not been
-- hidden ('anonymous' is still shown to everyone, but the app displays
-- it without the author's name). A 'private' message is visible only
-- to its author; a 'staff' message is visible to its author and
-- moderators. Used by the Triage check-in, where someone may want a
-- reflection to stay off the shared feed.
drop policy if exists "read visible messages" on messages;
create policy "read visible messages" on messages
  for select to authenticated
  using (
    hidden = false
    and (
      visibility in ('public', 'anonymous')
      or user_id = auth.uid()
      or (visibility = 'staff' and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
    )
  );

-- You post as yourself, and only as yourself.
drop policy if exists "post own message" on messages;
create policy "post own message" on messages
  for insert to authenticated
  with check (user_id = auth.uid());

-- Moderators can hide anything. Authors can hide their own.
drop policy if exists "moderate messages" on messages;
create policy "moderate messages" on messages
  for update to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- Authors can permanently delete their own message.
drop policy if exists "delete own message" on messages;
create policy "delete own message" on messages
  for delete to authenticated
  using (user_id = auth.uid());


-- ------------------------------------------------------------
-- LIVE POLL
-- Questions and options are seeded by staff; votes come from attendees.
-- ------------------------------------------------------------
create table if not exists poll_questions (
  id         text primary key,
  session_id text not null,
  prompt_en  text not null,
  prompt_es  text not null,
  active     boolean not null default true
);

create table if not exists poll_options (
  id          text primary key,
  question_id text not null references poll_questions on delete cascade,
  label_en    text not null,
  label_es    text not null,
  sort        int not null default 0
);

create table if not exists poll_votes (
  question_id text not null references poll_questions on delete cascade,
  user_id     uuid not null references auth.users on delete cascade,
  option_id   text not null references poll_options on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (question_id, user_id)
);

alter table poll_questions enable row level security;
alter table poll_options   enable row level security;
alter table poll_votes     enable row level security;

drop policy if exists "read questions" on poll_questions;
create policy "read questions" on poll_questions
  for select to authenticated using (true);

drop policy if exists "read options" on poll_options;
create policy "read options" on poll_options
  for select to authenticated using (true);

-- Everyone sees the tallies; you can only cast or change your own vote.
drop policy if exists "read votes" on poll_votes;
create policy "read votes" on poll_votes
  for select to authenticated using (true);

drop policy if exists "own vote" on poll_votes;
create policy "own vote" on poll_votes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- WORD CLOUD
-- ------------------------------------------------------------
create table if not exists cloud_words (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users on delete cascade,
  word       text not null check (char_length(word) between 1 and 24),
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);

alter table cloud_words enable row level security;

drop policy if exists "read words" on cloud_words;
create policy "read words" on cloud_words
  for select to authenticated using (hidden = false);

drop policy if exists "add own word" on cloud_words;
create policy "add own word" on cloud_words
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "moderate words" on cloud_words;
create policy "moderate words" on cloud_words
  for update to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );


-- ------------------------------------------------------------
-- PLEDGE WALL
-- approved defaults to true. Set it to false if you want
-- every pledge reviewed before it appears.
-- ------------------------------------------------------------
create table if not exists pledges (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users on delete cascade,
  body       text not null check (char_length(body) between 1 and 300),
  approved   boolean not null default true,
  anonymous  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table pledges enable row level security;

drop policy if exists "read approved pledges" on pledges;
create policy "read approved pledges" on pledges
  for select to authenticated
  using (approved = true or user_id = auth.uid());

drop policy if exists "post own pledge" on pledges;
create policy "post own pledge" on pledges
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "moderate pledges" on pledges;
create policy "moderate pledges" on pledges
  for update to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- Authors can permanently delete their own pledge.
drop policy if exists "delete own pledge" on pledges;
create policy "delete own pledge" on pledges
  for delete to authenticated
  using (user_id = auth.uid());


-- ------------------------------------------------------------
-- PROFILE PHOTOS
-- A public storage bucket. Each attendee can only add/replace/
-- remove files inside their own folder (named with their user id).
-- ------------------------------------------------------------
alter table profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatar public read" on storage.objects;
create policy "avatar public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatar own upload" on storage.objects;
create policy "avatar own upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatar own update" on storage.objects;
create policy "avatar own update" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatar own delete" on storage.objects;
create policy "avatar own delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);


-- ------------------------------------------------------------
-- LOBBY CHAT
-- The all-attendee room. No new table needed — it reuses
-- "messages" above with session_id = 'lobby', so the same
-- policies (post as yourself, moderators can hide) apply.
-- ------------------------------------------------------------


-- ------------------------------------------------------------
-- DIRECT MESSAGES
-- Private 1:1 messages between two attendees.
-- ------------------------------------------------------------
create table if not exists direct_messages (
  id           bigint generated always as identity primary key,
  sender_id    uuid not null references auth.users on delete cascade,
  recipient_id uuid not null references auth.users on delete cascade,
  body         text not null check (char_length(body) between 1 and 1000),
  created_at   timestamptz not null default now()
);

create index if not exists direct_messages_pair_idx
  on direct_messages (sender_id, recipient_id, created_at);

alter table direct_messages enable row level security;

-- You can only read messages you sent or received.
drop policy if exists "read own direct messages" on direct_messages;
create policy "read own direct messages" on direct_messages
  for select to authenticated
  using (sender_id = auth.uid() or recipient_id = auth.uid());

-- You send only as yourself.
drop policy if exists "send own direct message" on direct_messages;
create policy "send own direct message" on direct_messages
  for insert to authenticated
  with check (sender_id = auth.uid());

-- Senders can permanently delete their own message.
drop policy if exists "delete own direct message" on direct_messages;
create policy "delete own direct message" on direct_messages
  for delete to authenticated
  using (sender_id = auth.uid());


-- ------------------------------------------------------------
-- CHECK-IN
-- Self check-in. checked_in_at is null until the attendee taps
-- "Check in" in the app.
-- ------------------------------------------------------------
alter table profiles add column if not exists checked_in_at timestamptz;


-- ------------------------------------------------------------
-- LANGUAGE PREFERENCE
-- Persisted so it follows the attendee across devices.
-- ------------------------------------------------------------
alter table profiles add column if not exists language text not null default 'en';


-- ------------------------------------------------------------
-- DIRECTORY DESIGNATION
-- Lets an attendee's People-directory card carry a role badge and
-- puts them on the matching People tab (Leadership, Volunteers,
-- Sponsors). Null/anything else just shows as a regular attendee.
-- Set it in the Table Editor, profiles table, designation column,
-- using exactly one of:
--   speaker | founder | chair | board | staff | volunteer | sponsor | moderator
-- ------------------------------------------------------------
alter table profiles add column if not exists designation text;


-- ------------------------------------------------------------
-- SESSION CHECK-INS
-- Which specific sessions an attendee actually checked into
-- (separate from "saved_sessions", which is just their plan).
-- Reversible — tapping again removes the row.
-- ------------------------------------------------------------
create table if not exists session_checkins (
  user_id       uuid not null references auth.users on delete cascade,
  session_id    text not null,
  checked_in_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

alter table session_checkins enable row level security;

drop policy if exists "own session checkins" on session_checkins;
create policy "own session checkins" on session_checkins
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- FEEDBACK / CHECKOUT
-- One overall rating per attendee, plus an optional rating per
-- session they want to weigh in on. Upsert on both — tapping a
-- different star just updates the row.
-- ------------------------------------------------------------
create table if not exists conference_feedback (
  user_id    uuid primary key references auth.users on delete cascade,
  rating     int not null check (rating between 1 and 5),
  comments   text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table conference_feedback enable row level security;

drop policy if exists "own conference feedback" on conference_feedback;
create policy "own conference feedback" on conference_feedback
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table if not exists session_feedback (
  user_id    uuid not null references auth.users on delete cascade,
  session_id text not null,
  rating     int not null check (rating between 1 and 5),
  comment    text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

alter table session_feedback add column if not exists comment text not null default '';

alter table session_feedback enable row level security;

drop policy if exists "own session feedback" on session_feedback;
create policy "own session feedback" on session_feedback
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- WAITING ROOM & TRIAGE
-- Two more chat rooms, same idea as the lobby: no new table,
-- just more session_id values on "messages" above —
-- 'waiting-room' for introductions, 'triage' for check-ins on
-- how attendees are doing throughout the day.
-- ------------------------------------------------------------


-- ------------------------------------------------------------
-- SPEAKERS
-- Managed by HUES staff — add a row and a photo whenever a
-- speaker is confirmed. Nothing here needs the app rebuilt.
-- ------------------------------------------------------------
create table if not exists speakers (
  id         bigint generated always as identity primary key,
  name       text not null,
  role_en    text not null default '',
  role_es    text not null default '',
  bio_en     text not null default '',
  bio_es     text not null default '',
  photo_url  text,
  session_id text,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table speakers enable row level security;

-- Everyone signed in can read the speaker list.
drop policy if exists "read speakers" on speakers;
create policy "read speakers" on speakers
  for select to authenticated using (true);

-- Only moderators can add, edit, or remove speakers.
drop policy if exists "moderators manage speakers" on speakers;
create policy "moderators manage speakers" on speakers
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

-- Speaker photos: public bucket, only moderators can upload/replace/remove.
insert into storage.buckets (id, name, public)
values ('speaker-photos', 'speaker-photos', true)
on conflict (id) do nothing;

drop policy if exists "speaker photo public read" on storage.objects;
create policy "speaker photo public read" on storage.objects
  for select using (bucket_id = 'speaker-photos');

drop policy if exists "speaker photo moderator write" on storage.objects;
create policy "speaker photo moderator write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'speaker-photos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "speaker photo moderator update" on storage.objects;
create policy "speaker photo moderator update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'speaker-photos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "speaker photo moderator delete" on storage.objects;
create policy "speaker photo moderator delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'speaker-photos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );


-- ------------------------------------------------------------
-- SPONSORS
-- For sponsoring organizations/people who won't sign into the
-- app themselves (a company, a team, a realtor, etc). Managed by
-- HUES staff — add a row and a logo whenever a sponsor is
-- confirmed. Nothing here needs the app rebuilt. (An attendee who
-- IS in the app can instead just get designation = 'sponsor' on
-- their own profile row — see the DIRECTORY DESIGNATION section
-- above — and they'll show up here too.)
-- ------------------------------------------------------------
create table if not exists sponsors (
  id         bigint generated always as identity primary key,
  name       text not null,
  note_en    text not null default '',
  note_es    text not null default '',
  logo_url   text,
  website_url text,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

alter table sponsors add column if not exists website_url text;
alter table sponsors add column if not exists mission_en text not null default '';
alter table sponsors add column if not exists mission_es text not null default '';
alter table sponsors add column if not exists contact_name text;
alter table sponsors add column if not exists contact_email text;
alter table sponsors add column if not exists category text not null default 'sponsor';
alter table sponsors drop constraint if exists sponsors_category_check;
alter table sponsors add constraint sponsors_category_check check (category in ('sponsor', 'partner'));

alter table sponsors enable row level security;

-- Everyone signed in can read the sponsor list.
drop policy if exists "read sponsors" on sponsors;
create policy "read sponsors" on sponsors
  for select to authenticated using (true);

-- Only moderators can add, edit, or remove sponsors.
drop policy if exists "moderators manage sponsors" on sponsors;
create policy "moderators manage sponsors" on sponsors
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

-- Sponsor logos: public bucket, only moderators can upload/replace/remove.
insert into storage.buckets (id, name, public)
values ('sponsor-logos', 'sponsor-logos', true)
on conflict (id) do nothing;

drop policy if exists "sponsor logo public read" on storage.objects;
create policy "sponsor logo public read" on storage.objects
  for select using (bucket_id = 'sponsor-logos');

drop policy if exists "sponsor logo moderator write" on storage.objects;
create policy "sponsor logo moderator write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'sponsor-logos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "sponsor logo moderator update" on storage.objects;
create policy "sponsor logo moderator update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'sponsor-logos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "sponsor logo moderator delete" on storage.objects;
create policy "sponsor logo moderator delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'sponsor-logos'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );


-- ------------------------------------------------------------
-- SESSION HOSTS
-- Assigns someone as a host/presenter of one of the fixed schedule
-- entries in src/data/sessions.js. session_id is the session's id
-- from that file (e.g. 's2', 's11'), not a database row — nothing
-- to look up, just copy the id off the Agenda screen or the file.
--
-- Two ways to fill in who it is:
--   - They've signed into the app at least once (so they have a row
--     in profiles): set user_id to their id. Name/photo/bio come
--     from their profile automatically, and tapping them opens a
--     direct message.
--   - They haven't signed in / never will (a guest presenter, a
--     board member without the app): leave user_id blank and just
--     fill in name (and optionally photo_url, uploaded to the
--     speaker-photos bucket same as a speaker photo). No message
--     button shows for these since there's no account to message.
-- ------------------------------------------------------------
create table if not exists session_hosts (
  id         bigint generated always as identity primary key,
  session_id text not null,
  name       text not null default '',
  photo_url  text,
  user_id    uuid references profiles(id) on delete set null,
  role_en    text not null default '',
  role_es    text not null default '',
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

-- Safe to run again if session_hosts already existed from an
-- earlier version of this file (required user_id, no name/photo_url).
alter table session_hosts alter column user_id drop not null;
alter table session_hosts add column if not exists name text not null default '';
alter table session_hosts add column if not exists photo_url text;

alter table session_hosts enable row level security;

-- Everyone signed in can see who's hosting what.
drop policy if exists "read session hosts" on session_hosts;
create policy "read session hosts" on session_hosts
  for select to authenticated using (true);

-- Only moderators can assign/remove hosts.
drop policy if exists "moderators manage session hosts" on session_hosts;
create policy "moderators manage session hosts" on session_hosts
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));


-- ------------------------------------------------------------
-- SESSION FILES
-- Handouts, slide decks, and other files a speaker shares for one
-- of the fixed schedule entries in src/data/sessions.js. session_id
-- is that entry's id (e.g. 's6'), same as session_hosts above.
--
-- To add one: upload the file itself (PDF, PPTX, whatever) to the
-- session-files bucket in Storage, copy its public URL into
-- file_url. Optionally also upload a preview image (a screenshot of
-- the flyer or the first slide) to the same bucket and paste that
-- URL into thumbnail_url — if you skip it, the app just shows a
-- generic file icon instead of a picture.
-- ------------------------------------------------------------
create table if not exists session_files (
  id            bigint generated always as identity primary key,
  session_id    text not null,
  title         text not null,
  file_url      text not null,
  thumbnail_url text,
  sort          int not null default 0,
  created_at    timestamptz not null default now()
);

alter table session_files enable row level security;

-- Everyone signed in can see and open shared files.
drop policy if exists "read session files" on session_files;
create policy "read session files" on session_files
  for select to authenticated using (true);

-- Only moderators can add/remove files.
drop policy if exists "moderators manage session files" on session_files;
create policy "moderators manage session files" on session_files
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

-- Session files/thumbnails: public bucket, only moderators can upload/replace/remove.
insert into storage.buckets (id, name, public)
values ('session-files', 'session-files', true)
on conflict (id) do nothing;

drop policy if exists "session file public read" on storage.objects;
create policy "session file public read" on storage.objects
  for select using (bucket_id = 'session-files');

drop policy if exists "session file moderator write" on storage.objects;
create policy "session file moderator write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'session-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "session file moderator update" on storage.objects;
create policy "session file moderator update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'session-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "session file moderator delete" on storage.objects;
create policy "session file moderator delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'session-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

-- ------------------------------------------------------------
-- SESSION NOTES
-- Private per-attendee notes on a session. Only the person who
-- wrote a note can ever read or edit it — not even moderators.
-- ------------------------------------------------------------
create table if not exists session_notes (
  id         bigint generated always as identity primary key,
  session_id text not null,
  user_id    uuid not null references profiles(id) on delete cascade,
  note       text not null default '',
  updated_at timestamptz not null default now(),
  unique (session_id, user_id)
);

alter table session_notes enable row level security;

drop policy if exists "manage own notes" on session_notes;
create policy "manage own notes" on session_notes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- SESSION Q&A
-- Attendees submit questions for a session; anyone can upvote;
-- moderators can answer or mark a question answered.
-- ------------------------------------------------------------
create table if not exists session_questions (
  id          bigint generated always as identity primary key,
  session_id  text not null,
  user_id     uuid references profiles(id) on delete set null,
  body        text not null,
  answer      text,
  answered    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table session_questions enable row level security;

drop policy if exists "read questions" on session_questions;
create policy "read questions" on session_questions
  for select to authenticated using (true);

-- user_id may be null: an attendee can choose to ask anonymously.
drop policy if exists "ask questions" on session_questions;
create policy "ask questions" on session_questions
  for insert to authenticated with check (user_id = auth.uid() or user_id is null);

drop policy if exists "moderators manage questions" on session_questions;
create policy "moderators manage questions" on session_questions
  for update to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

drop policy if exists "moderators delete questions" on session_questions;
create policy "moderators delete questions" on session_questions
  for delete to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

create table if not exists session_question_votes (
  question_id bigint not null references session_questions(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  primary key (question_id, user_id)
);

alter table session_question_votes enable row level security;

drop policy if exists "read question votes" on session_question_votes;
create policy "read question votes" on session_question_votes
  for select to authenticated using (true);

drop policy if exists "manage own question vote" on session_question_votes;
create policy "manage own question vote" on session_question_votes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------------
-- SESSION RECAPS (AI-generated snapshots)
-- One short AI-written recap per session, generated by a
-- moderator from the Session screen after a session wraps up.
-- Written by the ai-assistant Edge Function's "recap" mode.
-- ------------------------------------------------------------
create table if not exists session_recaps (
  session_id   text primary key,
  summary_en   text not null default '',
  summary_es   text not null default '',
  generated_at timestamptz not null default now()
);

alter table session_recaps enable row level security;

drop policy if exists "read recaps" on session_recaps;
create policy "read recaps" on session_recaps
  for select to authenticated using (true);

drop policy if exists "moderators manage recaps" on session_recaps;
create policy "moderators manage recaps" on session_recaps
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));

-- ------------------------------------------------------------
-- SESSION DETAILS
-- The full-description content for each session's detail page
-- (tapping a session on Agenda). Optional per session — a
-- moderator fills these in from the Session Detail screen itself,
-- no SQL needed. Empty until someone writes one.
-- ------------------------------------------------------------
create table if not exists session_details (
  session_id       text primary key,
  description_en   text not null default '',
  description_es   text not null default '',
  accessibility_en text not null default '',
  accessibility_es text not null default '',
  updated_at       timestamptz not null default now()
);

alter table session_details enable row level security;

drop policy if exists "read session details" on session_details;
create policy "read session details" on session_details
  for select to authenticated using (true);

drop policy if exists "moderators manage session details" on session_details;
create policy "moderators manage session details" on session_details
  for all to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));


-- ------------------------------------------------------------
-- BLOCKS
-- An attendee can block another; blocked people's messages,
-- profile, and pledges are filtered out client-side. Nothing
-- special happens on the blocked person's side — they aren't
-- notified.
-- ------------------------------------------------------------
create table if not exists blocks (
  id         bigint generated always as identity primary key,
  blocker_id uuid not null references auth.users on delete cascade,
  blocked_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

alter table blocks enable row level security;

drop policy if exists "manage own blocks" on blocks;
create policy "manage own blocks" on blocks
  for all to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());


-- ------------------------------------------------------------
-- REPORTS
-- An attendee flags a message, profile, or pledge for the HUES
-- team to review. Reporters can see their own reports; only
-- moderators can see and resolve the full queue.
-- ------------------------------------------------------------
create table if not exists reports (
  id           bigint generated always as identity primary key,
  reporter_id  uuid not null references auth.users on delete cascade,
  target_type  text not null check (target_type in ('message', 'profile', 'pledge')),
  target_id    text not null,
  target_owner uuid references auth.users on delete set null,
  reason       text not null,
  details      text not null default '',
  status       text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at   timestamptz not null default now()
);

alter table reports enable row level security;

drop policy if exists "read own or moderate reports" on reports;
create policy "read own or moderate reports" on reports
  for select to authenticated
  using (
    reporter_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

drop policy if exists "file own report" on reports;
create policy "file own report" on reports
  for insert to authenticated
  with check (reporter_id = auth.uid());

drop policy if exists "moderators resolve reports" on reports;
create policy "moderators resolve reports" on reports
  for update to authenticated
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator));


-- ------------------------------------------------------------
-- WELLNESS REFLECTION
-- The optional "What helped? What got in the way?" reflection on the
-- My Wellness Follow-Through screen. One row per attendee, private to
-- them.
-- ------------------------------------------------------------
create table if not exists wellness_reflections (
  user_id    uuid primary key references auth.users on delete cascade,
  helped     text not null default '',
  obstacles  text not null default '',
  updated_at timestamptz not null default now()
);

alter table wellness_reflections enable row level security;

drop policy if exists "own wellness reflection" on wellness_reflections;
create policy "own wellness reflection" on wellness_reflections
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- WELLNESS REMINDERS PREFERENCE
-- Opt-in gentle transition prompts (breathing, hydration) shown
-- during the 15-minute passing periods between sessions.
-- ------------------------------------------------------------
alter table profiles add column if not exists wellness_reminders boolean not null default false;


-- ------------------------------------------------------------
-- PLEDGE SUPPORTS
-- A lightweight "heart" on someone else's Pledge Wall post, so
-- attendees can show community care without leaving a comment.
-- ------------------------------------------------------------
create table if not exists pledge_supports (
  id         bigint generated always as identity primary key,
  pledge_id  bigint not null references pledges on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (pledge_id, user_id)
);

alter table pledge_supports enable row level security;

drop policy if exists "read pledge supports" on pledge_supports;
create policy "read pledge supports" on pledge_supports
  for select to authenticated
  using (true);

drop policy if exists "manage own pledge support" on pledge_supports;
create policy "manage own pledge support" on pledge_supports
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- TOOLKIT SAVES ("digital tote bag")
-- Lets an attendee bookmark a sponsor or community partner profile
-- into their own Wellness Follow-Through screen instead of
-- collecting a paper flyer.
-- ------------------------------------------------------------
create table if not exists toolkit_saves (
  id         bigint generated always as identity primary key,
  sponsor_id bigint not null references sponsors on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (sponsor_id, user_id)
);

alter table toolkit_saves enable row level security;

drop policy if exists "manage own toolkit saves" on toolkit_saves;
create policy "manage own toolkit saves" on toolkit_saves
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ------------------------------------------------------------
-- ICEBREAKER
-- A short, optional "digital business card" prompt shown on a
-- profile to remove the awkwardness of a first approach.
-- ------------------------------------------------------------
alter table profiles add column if not exists icebreaker text not null default '';


-- ------------------------------------------------------------
-- MATCH LIKES ("Discover")
-- A one-at-a-time "Connect" or "Pass" deck. A mutual match exists
-- when both people have a row liking the other; no one ever sees
-- who passed on them.
-- ------------------------------------------------------------
create table if not exists match_likes (
  id         bigint generated always as identity primary key,
  liker_id   uuid not null references auth.users on delete cascade,
  liked_id   uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (liker_id, liked_id)
);

alter table match_likes enable row level security;

drop policy if exists "read own match likes" on match_likes;
create policy "read own match likes" on match_likes
  for select to authenticated
  using (liker_id = auth.uid() or liked_id = auth.uid());

drop policy if exists "create own match like" on match_likes;
create policy "create own match like" on match_likes
  for insert to authenticated
  with check (liker_id = auth.uid());

drop policy if exists "delete own match like" on match_likes;
create policy "delete own match like" on match_likes
  for delete to authenticated
  using (liker_id = auth.uid());


-- ------------------------------------------------------------
-- PHOTO CONTEST
-- A themed photo wall attendees post to and cheer on with a vote,
-- moderated the same way as everything else (report/block).
-- ------------------------------------------------------------
create table if not exists contest_entries (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users on delete cascade,
  theme      text not null check (theme in ('squad', 'moment', 'selfcare')),
  image_url  text not null,
  caption    text not null default '',
  created_at timestamptz not null default now()
);

alter table contest_entries enable row level security;

drop policy if exists "read contest entries" on contest_entries;
create policy "read contest entries" on contest_entries
  for select to authenticated
  using (true);

drop policy if exists "post own contest entry" on contest_entries;
create policy "post own contest entry" on contest_entries
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "delete own contest entry" on contest_entries;
create policy "delete own contest entry" on contest_entries
  for delete to authenticated
  using (
    user_id = auth.uid()
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_moderator)
  );

create table if not exists contest_votes (
  id         bigint generated always as identity primary key,
  entry_id   bigint not null references contest_entries on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (entry_id, user_id)
);

alter table contest_votes enable row level security;

drop policy if exists "read contest votes" on contest_votes;
create policy "read contest votes" on contest_votes
  for select to authenticated
  using (true);

drop policy if exists "manage own contest vote" on contest_votes;
create policy "manage own contest vote" on contest_votes
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Photo wall entries can now be reported alongside messages/profiles/pledges.
alter table reports drop constraint if exists reports_target_type_check;
alter table reports add constraint reports_target_type_check
  check (target_type in ('message', 'profile', 'pledge', 'contest_entry'));

-- Contest photos: public bucket, each attendee manages their own uploads.
insert into storage.buckets (id, name, public)
values ('contest-photos', 'contest-photos', true)
on conflict (id) do nothing;

drop policy if exists "contest photo public read" on storage.objects;
create policy "contest photo public read" on storage.objects
  for select using (bucket_id = 'contest-photos');

drop policy if exists "contest photo own upload" on storage.objects;
create policy "contest photo own upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'contest-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "contest photo own delete" on storage.objects;
create policy "contest photo own delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'contest-photos' and (storage.foldername(name))[1] = auth.uid()::text);


-- ------------------------------------------------------------
-- REALTIME
-- Lets the app update without refreshing. Wrapped so this whole
-- file is safe to run again later (a plain ALTER PUBLICATION
-- ADD TABLE errors the second time since the table is already
-- a member — this checks first).
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'poll_votes') then
    alter publication supabase_realtime add table poll_votes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pledges') then
    alter publication supabase_realtime add table pledges;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cloud_words') then
    alter publication supabase_realtime add table cloud_words;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'direct_messages') then
    alter publication supabase_realtime add table direct_messages;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
    alter publication supabase_realtime add table profiles;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'speakers') then
    alter publication supabase_realtime add table speakers;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sponsors') then
    alter publication supabase_realtime add table sponsors;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_hosts') then
    alter publication supabase_realtime add table session_hosts;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_files') then
    alter publication supabase_realtime add table session_files;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_notes') then
    alter publication supabase_realtime add table session_notes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_questions') then
    alter publication supabase_realtime add table session_questions;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_question_votes') then
    alter publication supabase_realtime add table session_question_votes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_recaps') then
    alter publication supabase_realtime add table session_recaps;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'session_details') then
    alter publication supabase_realtime add table session_details;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'reports') then
    alter publication supabase_realtime add table reports;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'pledge_supports') then
    alter publication supabase_realtime add table pledge_supports;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'match_likes') then
    alter publication supabase_realtime add table match_likes;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'contest_entries') then
    alter publication supabase_realtime add table contest_entries;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'contest_votes') then
    alter publication supabase_realtime add table contest_votes;
  end if;
end $$;


-- ------------------------------------------------------------
-- SEED — the live poll for the fireside chat
-- ------------------------------------------------------------
insert into poll_questions (id, session_id, prompt_en, prompt_es, active)
values ('q-health-today', 's8',
        'Where is your health showing up today?',
        '¿Dónde se expresa tu salud hoy?', true)
on conflict (id) do nothing;

insert into poll_options (id, question_id, label_en, label_es, sort) values
  ('o-body',      'q-health-today', 'In my body',      'En mi cuerpo',    1),
  ('o-mind',      'q-health-today', 'In my mind',      'En mi mente',     2),
  ('o-spirit',    'q-health-today', 'In my spirit',    'En mi espíritu',  3),
  ('o-community', 'q-health-today', 'In my community', 'En mi comunidad', 4)
on conflict (id) do nothing;


-- ------------------------------------------------------------
-- MAKING SOMEONE A MODERATOR
-- After they have signed in once, find their id in the
-- Authentication tab and run:
--
--   update profiles set is_moderator = true where id = 'paste-uuid-here';
-- ------------------------------------------------------------
