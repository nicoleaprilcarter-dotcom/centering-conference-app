// Supabase Edge Function: ai-assistant
//
// One endpoint, three modes, all backed by the Anthropic API:
//   - "chat"      Ask HUES chatbot — answers attendee questions about the conference.
//   - "recommend" Personalized session recommendations + a short "your day" blurb.
//   - "recap"     A short bilingual recap of a session, generated from its group chat.
//
// Deploy this from the Supabase Dashboard (Edge Functions > Deploy a new function,
// paste this file in as index.ts) or via `supabase functions deploy ai-assistant`.
// Then add a secret named ANTHROPIC_API_KEY (Edge Functions > ai-assistant > Secrets,
// or Project Settings > Edge Functions) with a key from https://console.anthropic.com/.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const MODEL = 'claude-haiku-4-5-20251001';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Kept in sync by hand with src/data/sessions.js — the schedule rarely
// changes once set, so a static copy here avoids extra API round trips.
const SCHEDULE_TEXT = `
[s1] 8:30 (30 min) — Attendee Arrival, Registration, Mobile Coffee Bar & Professional Headshots — Hub/Arcade + Gem City Area
[s2] 9:00 (20 min) — Opening Ceremony — Upper Deck
[s3] 9:20 (25 min) — Coffee, Connection & Continental Breakfast (Transition) — Common Areas
[s8] 9:45 (90 min) — Signature Fireside Chat — Upper Deck
[s4] 11:15 (15 min) — Reflection + Bio Break — Common Areas
[s5] 11:30 (30 min) — Community Connection, Vendors & Headshots — Gem City/Common Areas
[s6a] 11:45 (50 min) — Theme 1: Expressing Wholeness (rest, healing, reclamation) — Amber room
[s6b] 11:45 (50 min) — Theme 2: Expressing Possibility (imagining more, choosing wellness, living fully) — Sapphire room
[s6c] 11:45 (50 min) — Theme 3: Expressing Power (changing health conditions, claiming dignity, sustainable futures) — Jade room
[s6d] 11:45 (50 min) — Theme 4: Expressing Community (sharing stories, building support, turning awareness into action) — Upper Deck
[s7] 12:35 (60 min) — Community Lunch + Marketplace — Upper Deck/Common Areas
[s9a] 1:35 (50 min) — Theme 1: Expressing Wholeness (rest, healing, reclamation) — Amber room
[s9b] 1:35 (50 min) — Theme 2: Expressing Possibility (imagining more, choosing wellness, living fully) — Sapphire room
[s9c] 1:35 (50 min) — Theme 3: Expressing Power (changing health conditions, claiming dignity, sustainable futures) — Jade room
[s9d] 1:35 (50 min) — Theme 4: Expressing Community (sharing stories, building support, turning awareness into action) — Upper Deck
[s10a] 2:40 (50 min) — Theme 1: Expressing Wholeness (rest, healing, reclamation) — Amber room
[s10b] 2:40 (50 min) — Theme 2: Expressing Possibility (imagining more, choosing wellness, living fully) — Sapphire room
[s10c] 2:40 (50 min) — Theme 3: Expressing Power (changing health conditions, claiming dignity, sustainable futures) — Jade room
[s10d] 2:40 (50 min) — Theme 4: Expressing Community (sharing stories, building support, turning awareness into action) — Upper Deck
[s11] 3:40 (20 min) — Closing Ceremony — Presenter Q&A — Upper Deck
`.trim();

const VENUE_TEXT = 'Dayton Hub, 31 S Main St, Dayton, OH 45402.';

async function buildContext(supabase) {
  const [{ data: speakers }, { data: sponsors }] = await Promise.all([
    supabase.from('speakers').select('name, bio_en, role_en').limit(30),
    supabase.from('sponsors').select('name, note_en').limit(30),
  ]);
  const speakerText = (speakers || []).map((s) => `${s.name}${s.role_en ? ` (${s.role_en})` : ''}`).join('; ') || 'TBD';
  const sponsorText = (sponsors || []).map((s) => s.name).join(', ') || 'TBD';
  return `
Event: Centering Women of Color 2026, hosted by HUES Women's Health Advocacy Institute.
Venue: ${VENUE_TEXT}
Schedule:
${SCHEDULE_TEXT}
Speakers: ${speakerText}
Sponsors: ${sponsorText}
`.trim();
}

async function callClaude(system, messages, maxTokens = 600) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return (data.content || []).map((b) => b.text || '').join('').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY secret is not set on this function.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Sign in required.' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { mode, lang } = body;
    const langLabel = lang === 'es' ? 'Spanish' : 'English';

    if (mode === 'chat') {
      const { message, history } = body;
      if (!message || !message.trim()) throw new Error('Missing message.');
      const context = await buildContext(supabase);
      const system = `You are "Ask HUES", a warm, concise assistant embedded in the Centering Women of Color 2026 conference app. Answer only using the event facts below plus general helpfulness; if you don't know something specific to this event, say so and suggest asking a HUES staff member. Keep answers under 80 words. Reply in ${langLabel}.\n\n${context}`;
      const messages = [
        ...(Array.isArray(history) ? history.slice(-8) : []).map((h) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: String(h.content || '').slice(0, 2000) })),
        { role: 'user', content: message.slice(0, 2000) },
      ];
      const reply = await callClaude(system, messages, 400);
      return new Response(JSON.stringify({ reply }), { headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    if (mode === 'recommend') {
      const { interests, bio } = body;
      const context = await buildContext(supabase);
      const system = `You help attendees of a women's health equity conference plan their day. Given their stated interests and bio, pick the 2-3 best-fit session blocks from the schedule (each schedule line starts with an id in square brackets, like [s6a]) and write one warm, specific sentence per pick explaining why, plus one 2-sentence "your day at a glance" summary. Reply in ${langLabel}. Respond with ONLY valid JSON, no markdown fences, shaped exactly like: {"summary":"...","picks":[{"sessionId":"s6a","why":"..."}]} — sessionId must be one of the exact bracketed ids from the schedule.\n\n${context}`;
      const userMsg = `Attendee interests: ${(interests || []).join(', ') || 'not specified'}.\nAbout them: ${bio || 'not specified'}.`;
      const raw = await callClaude(system, [{ role: 'user', content: userMsg }], 500);
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''));
      } catch {
        parsed = { summary: raw, picks: [] };
      }
      return new Response(JSON.stringify(parsed), { headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    if (mode === 'recap') {
      const { sessionTitle, transcript } = body;
      if (!transcript || !transcript.trim()) throw new Error('No conversation to summarize yet.');
      const system = `Summarize this conference session's group chat into a short, warm recap for attendees who want to catch up on what was discussed. 3-4 sentences max. Respond with ONLY valid JSON: {"summary_en":"...","summary_es":"..."} — write both, translating naturally, regardless of the source language.`;
      const userMsg = `Session: ${sessionTitle || 'Unknown session'}\n\nChat transcript:\n${transcript.slice(0, 6000)}`;
      const raw = await callClaude(system, [{ role: 'user', content: userMsg }], 500);
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ''));
      } catch {
        parsed = { summary_en: raw, summary_es: raw };
      }
      return new Response(JSON.stringify(parsed), { headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown mode.' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Something went wrong.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });
  }
});
