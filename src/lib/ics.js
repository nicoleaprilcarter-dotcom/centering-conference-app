import { timeToMinutes } from './helpers';

const EVENT_DATE = '20261106'; // Friday, November 6, 2026 — the conference is single-day

function pad(n) {
  return String(n).padStart(2, '0');
}

function minutesToICSTime(min) {
  return `${pad(Math.floor(min / 60))}${pad(min % 60)}00`;
}

function escapeICSText(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function sessionToVEvent(session, lang) {
  const start = timeToMinutes(session.t);
  const duration = parseInt(session.d, 10) || 0;
  const title = lang === 'es' ? session.titleEs : session.title;
  return [
    'BEGIN:VEVENT',
    `UID:${session.id}@centeringwomenofcolor2026`,
    `DTSTAMP:${EVENT_DATE}T000000Z`,
    `DTSTART:${EVENT_DATE}T${minutesToICSTime(start)}`,
    `DTEND:${EVENT_DATE}T${minutesToICSTime(start + duration)}`,
    `SUMMARY:${escapeICSText(title)}`,
    `LOCATION:${escapeICSText(session.room)}`,
    'END:VEVENT',
  ].join('\r\n');
}

export function sessionsToICS(sessions, lang) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Centering Women of Color 2026//EN',
    'CALSCALE:GREGORIAN',
    ...sessions.map((s) => sessionToVEvent(s, lang)),
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(sessions, lang, filename) {
  const ics = sessionsToICS(sessions, lang);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
