# Centering Women of Color 2026 — companion app

A React + Vite mobile web app for HUES Women's Health Advocacy Institute's
"Centering Women of Color 2026" conference (Nov 6, 2026, Dayton Hub). Built
from the `Centering Conference App Live.dc.html` design: sign-in by email
magic link, a session agenda, group chat and a live poll for the fireside
chat, a pledge wall, an attendee directory, and profile create/edit — all
backed by Supabase (Postgres + Auth + Realtime).

The session agenda is still hard-coded in `src/data/sessions.js` with no
attendee or speaker names, matching the organizer's instructions — swap in
the real program and names when they're confirmed.

## 1. Create the Supabase project

At [supabase.com](https://supabase.com), free tier, US region.

## 2. Run the schema

Open the SQL Editor in your Supabase project, paste in all of
`supabase-schema.sql` from this folder, and click Run. That creates the
tables, the row-level security policies, and seeds the fireside chat poll.
Running it twice is safe.

## 3. Configure the app

Copy `.env.example` to `.env` and fill in your Project URL and anon public
key (Project Settings → API):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

If you deploy without a `.env`, the app falls back to an in-app "Connect
your database" screen where a visitor can paste the same two values —
they're stored only in that browser's `localStorage`. Setting the env vars
is the right choice for your own production deploy.

## 4. Also set up in Supabase

- **Authentication → URL Configuration** — set the Site URL to your Netlify
  address and add it under Redirect URLs. Magic links won't return to the
  app without this.
- **Authentication → Providers → Email** — on by default. Turn off "Confirm
  email" if you want the link to sign people in on first tap.
- **Moderators** — after someone signs in once, find their id under
  Authentication and run:
  ```sql
  update profiles set is_moderator = true where id = 'paste-uuid-here';
  ```

## Local development

```bash
npm install
npm run dev
```

## Build & deploy to Netlify

```bash
npm run build
```

This produces `dist/`. `netlify.toml` in this folder already sets the
build command and publish directory, and redirects all routes to
`index.html` for the single-page app. Connect the repo (or this `app/`
subdirectory) in Netlify, or drag-and-drop the `dist/` folder at
app.netlify.com/drop for a one-off deploy. Set the two `VITE_SUPABASE_*`
environment variables in Netlify's Site configuration → Environment
variables so they're baked in at build time.

## What's real

Sign-in by email link, profile create/edit, starred sessions, session
chat, the live poll, the word cloud, the pledge wall, and the attendee
directory all read and write to your database in real time — two phones
signed in at once see each other's messages, votes, and pledges appear
without refreshing.

## Still to build

Photo uploads need a Supabase storage bucket. Push notifications need a
service worker and a send job. The agenda is hard-coded rather than
loaded from a table, so it can ship before the program is final.
