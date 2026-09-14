export const COLORS = ['#D81B60', '#1F7A78', '#F58220', '#5C1A4C', '#8E1148', '#B96B0C'];

const TAG_COLOR_MAP = {
  mag: ['#FFE2ED', '#8E1148'],
  teal: ['#E1EFEE', '#1F5F5E'],
  gold: ['#FCEFD6', '#8A5A0B'],
  plum: ['#EFE6EE', '#5C1A4C'],
  soft: ['#F3EFF1', '#7A6070'],
};

export function tagColors(kind) {
  return TAG_COLOR_MAP[kind] || TAG_COLOR_MAP.soft;
}

export function initials(name) {
  if (!name) return '—';
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => (w[0] ? w[0].toUpperCase() : ''))
      .join('') || '—'
  );
}

export function colorForId(id) {
  let n = 0;
  String(id)
    .split('')
    .forEach((ch) => {
      n = (n + ch.charCodeAt(0)) % 997;
    });
  return COLORS[n % COLORS.length];
}
