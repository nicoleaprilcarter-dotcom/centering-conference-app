import { designationColors, normalizeDesignation } from '../lib/helpers';

const DESIGNATION_KEY = {
  speaker: 'designationSpeaker',
  chair: 'designationChair',
  board: 'designationBoard',
  staff: 'designationStaff',
  volunteer: 'designationVolunteer',
  sponsor: 'designationSponsor',
  moderator: 'designationModerator',
};

export default function DesignationBadge({ designation, t, style }) {
  const norm = normalizeDesignation(designation);
  const key = DESIGNATION_KEY[norm];
  if (!key) return null;
  const [bg, fg] = designationColors(norm);
  return (
    <span className="person-tag" style={{ background: bg, color: fg, fontWeight: 600, ...style }}>
      {t[key]}
    </span>
  );
}
