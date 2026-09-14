// Solid backgrounds for avatar initials — kept dark/saturated enough
// that white text stays readable on every one of them.
export const COLORS = ['#D81B60', '#1F7A78', '#A63D06', '#6B1029', '#7A5205', '#C6106B'];

// Each pairs a light pastel background with a deep, high-contrast
// text color from the same hue, so tag pills stay easy to read.
const TAG_COLOR_MAP = {
  pink: ['#FFE0F0', '#C6106B'], // hot pink — keynote
  mustard: ['#FBEAB0', '#7A5205'], // mustard yellow — workshops
  pumpkin: ['#FBD9BC', '#A63D06'], // pumpkin orange — featured
  plum: ['#F1E0E6', '#6B1029'], // deep burgundy — welcome / plenary
  soft: ['#F3EFF1', '#7A6070'], // neutral
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
