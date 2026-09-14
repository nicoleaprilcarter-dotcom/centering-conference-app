// Sample program — final agenda pending. Rooms, times, and titles are
// placeholders until HUES confirms the program. No names are included
// per the event organizer's instructions.
export const SESSIONS = [
  { id: 's1', t: '9:00', d: '30 min', title: 'Check-in & Continental Breakfast', titleEs: 'Registro y desayuno continental', room: 'Atrium', tagKey: 'tagWelcome', kind: 'soft' },
  { id: 's2', t: '9:30', d: '30 min', title: 'Welcome & Land Acknowledgment', titleEs: 'Bienvenida y reconocimiento de la tierra', room: 'Main Hall', tagKey: 'tagPlenary', kind: 'plum' },
  { id: 's3', t: '10:00', d: '60 min', title: 'Opening Keynote: Expressions of Health', titleEs: 'Discurso inaugural: Expresiones de la salud', room: 'Main Hall', tagKey: 'tagKeynote', kind: 'mag' },
  { id: 's4', t: '11:00', d: '60 min', title: 'Workshop A — Naming What Hurts', titleEs: 'Taller A — Nombrar lo que duele', room: 'Studio 1', tagKey: 'tagWorkshop', kind: 'teal' },
  { id: 's5', t: '11:00', d: '60 min', title: 'Workshop B — Movement as Medicine', titleEs: 'Taller B — El movimiento como medicina', room: 'Studio 2', tagKey: 'tagWorkshop', kind: 'teal' },
  { id: 's6', t: '11:00', d: '60 min', title: 'Workshop C — Food, Culture & Chronic Conditions', titleEs: 'Taller C — Comida, cultura y condiciones crónicas', room: 'Studio 3', tagKey: 'tagWorkshop', kind: 'teal' },
  { id: 's8', t: '12:00', d: '75 min', title: 'Fireside Chat — Living with Invisible Illness (working lunch)', titleEs: 'Charla íntima — Vivir con una enfermedad invisible (almuerzo de trabajo)', room: 'Main Hall', tagKey: 'tagFeatured', kind: 'gold' },
  { id: 's7', t: '12:00', d: 'all day', title: 'Community Resource & Vendor Fair', titleEs: 'Feria de recursos y proveedores comunitarios', room: 'Vendor Hall · until 4:00', tagKey: 'tagOpenAllDay', kind: 'soft' },
  { id: 's9', t: '2:45', d: '60 min', title: 'Workshop D — Insurance, Denials & Your Rights', titleEs: 'Taller D — Seguros, negaciones y tus derechos', room: 'Studio 1', tagKey: 'tagWorkshop', kind: 'teal' },
  { id: 's10', t: '2:45', d: '60 min', title: 'Workshop E — Rest as Resistance', titleEs: 'Taller E — El descanso como resistencia', room: 'Studio 2', tagKey: 'tagWorkshop', kind: 'teal' },
  { id: 's11', t: '3:45', d: '30 min', title: 'Closing Circle & Pledge Wall Reveal', titleEs: 'Círculo de cierre y muro de compromisos', room: 'Main Hall', tagKey: 'tagPlenary', kind: 'plum' },
];

export const POLL_QUESTION_ID = 'q-health-today';

export const POLL_OPTIONS = [
  ['o-body', 'In my body', 'En mi cuerpo'],
  ['o-mind', 'In my mind', 'En mi mente'],
  ['o-spirit', 'In my spirit', 'En mi espíritu'],
  ['o-community', 'In my community', 'En mi comunidad'],
];

export const POLL_PROMPT = { en: 'Where is your health showing up today?', es: '¿Dónde se expresa tu salud hoy?' };
