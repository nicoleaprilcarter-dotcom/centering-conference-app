// Sample program — final agenda pending. Rooms, times, and titles are
// placeholders until HUES confirms the program. No names are included
// per the event organizer's instructions.
export const SESSIONS = [
  { id: 's1', t: '9:00', d: '30 min', title: 'Check-in & Continental Breakfast', room: 'Atrium', tag: 'Welcome', kind: 'soft' },
  { id: 's2', t: '9:30', d: '30 min', title: 'Welcome & Land Acknowledgment', room: 'Main Hall', tag: 'Plenary', kind: 'plum' },
  { id: 's3', t: '10:00', d: '60 min', title: 'Opening Keynote: Expressions of Health', room: 'Main Hall', tag: 'Keynote', kind: 'mag' },
  { id: 's4', t: '11:00', d: '60 min', title: 'Workshop A — Naming What Hurts', room: 'Studio 1', tag: 'Workshop', kind: 'teal' },
  { id: 's5', t: '11:00', d: '60 min', title: 'Workshop B — Movement as Medicine', room: 'Studio 2', tag: 'Workshop', kind: 'teal' },
  { id: 's6', t: '11:00', d: '60 min', title: 'Workshop C — Food, Culture & Chronic Conditions', room: 'Studio 3', tag: 'Workshop', kind: 'teal' },
  { id: 's8', t: '12:00', d: '75 min', title: 'Fireside Chat — Living with Invisible Illness (working lunch)', room: 'Main Hall', tag: 'Featured', kind: 'gold' },
  { id: 's7', t: '12:00', d: 'all day', title: 'Community Resource & Vendor Fair', room: 'Vendor Hall · until 4:00', tag: 'Open all day', kind: 'soft' },
  { id: 's9', t: '2:45', d: '60 min', title: 'Workshop D — Insurance, Denials & Your Rights', room: 'Studio 1', tag: 'Workshop', kind: 'teal' },
  { id: 's10', t: '2:45', d: '60 min', title: 'Workshop E — Rest as Resistance', room: 'Studio 2', tag: 'Workshop', kind: 'teal' },
  { id: 's11', t: '3:45', d: '30 min', title: 'Closing Circle & Pledge Wall Reveal', room: 'Main Hall', tag: 'Plenary', kind: 'plum' },
];

export const INTEREST_TAGS = [
  'Maternal health',
  'Doula care',
  'Peer support',
  'Español',
  'Outreach',
  'Clinical',
  'Chronic care',
  'Policy',
  'Language access',
  'Mental health',
  'Caregiving',
  'Research',
  'Reproductive health',
  'Birth equity',
  'Community health workers',
  'Faith-based support',
  'LGBTQ+ health',
  'Disability advocacy',
  'Nutrition',
  'Movement & fitness',
  'Financial wellness',
  'Youth health',
  'Elder care',
  'Nonprofit leadership',
];

export const POLL_QUESTION_ID = 'q-health-today';

export const POLL_OPTIONS = [
  ['o-body', 'In my body'],
  ['o-mind', 'In my mind'],
  ['o-spirit', 'In my spirit'],
  ['o-community', 'In my community'],
];

export const POLL_PROMPT = 'Where is your health showing up today?';
