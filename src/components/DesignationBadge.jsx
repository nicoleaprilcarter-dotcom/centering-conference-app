import { designationColors, normalizeDesignation } from '../lib/helpers';

const DESIGNATION_KEY = {
  speaker: 'designationSpeaker',
  founder: 'designationFounder',
  chair: 'designationChair',
  board: 'designationBoard',
  staff: 'designationStaff',
  volunteer: 'designationVolunteer',
  sponsor: 'designationSponsor',
  moderator: 'designationModerator',
};

// Accepts either a list of designations (so someone who is both, say,
// "board" and "volunteer" gets a chip for each) or a single legacy
// string, for any data that hasn't been migrated to the array column.
export default function DesignationBadge({ designations, t, style }) {
  const list = Array.isArray(designations) ? designations : designations ? [designations] : [];
  const seen = new Set();
  const chips = [];
  list.forEach((d) => {
    const norm = normalizeDesignation(d);
    const key = DESIGNATION_KEY[norm];
    if (!key || seen.has(norm)) return;
    seen.add(norm);
    const [bg, fg] = designationColors(norm);
    chips.push(
      <span key={norm} className="person-tag" style={{ background: bg, color: fg, fontWeight: 600, ...style }}>
        {t[key]}
      </span>
    );
  });
  return chips.length > 0 ? chips : null;
}
