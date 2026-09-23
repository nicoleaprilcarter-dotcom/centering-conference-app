import { tagColors, normalizeDesignation } from '../lib/helpers';

const LEADERSHIP_DESIGNATIONS = ['founder', 'chair', 'board', 'staff', 'moderator'];

function roleKey(designation) {
  const norm = normalizeDesignation(designation);
  if (norm === 'speaker') return 'speaker';
  if (LEADERSHIP_DESIGNATIONS.includes(norm)) return 'leadership';
  if (norm === 'volunteer') return 'volunteer';
  return 'attendee';
}

const ROLE_COLOR_KIND = { speaker: 'pumpkin', leadership: 'plum', volunteer: 'mustard', attendee: 'soft' };
const ROLE_LABEL_KEY = {
  speaker: 'badgeRoleSpeaker',
  leadership: 'badgeRoleLeadership',
  volunteer: 'badgeRoleVolunteer',
  attendee: 'badgeRoleAttendee',
};

// The attendee's printable/on-screen check-in badge: photo (or the HUES
// logo when no photo has been uploaded), name, and a role pill. Shown
// alongside the QR code both in Resources and the quick badge view.
export default function EventBadge({ t, name, avatarUrl, designation }) {
  const role = roleKey(designation);
  const [roleBg, roleFg] = tagColors(ROLE_COLOR_KIND[role]);
  const roleLabel = t[ROLE_LABEL_KEY[role]];

  return (
    <div style={{ width: 240, margin: '0 auto', borderRadius: 22, padding: 4, background: 'linear-gradient(165deg, #FF3D8F 0%, #C6106B 55%, #6B1029 100%)' }}>
      <div style={{ background: '#FFF7EF', borderRadius: 18, padding: '20px 16px 18px', textAlign: 'center' }}>
        <div style={{ font: '700 9.5px/1 Poppins', letterSpacing: '0.1em', color: '#B01253', textTransform: 'uppercase', marginBottom: 14 }}>
          {t.badgeEventName}
        </div>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 999,
            margin: '0 auto 12px',
            border: '3px solid #fff',
            boxShadow: '0 2px 10px rgba(46,16,53,.25)',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src="/images/hues-logo.png" alt="" style={{ width: '72%', height: '72%', objectFit: 'contain' }} />
          )}
        </div>
        <div style={{ font: '700 17px/1.25 Poppins', color: '#2E1035' }}>{name}</div>
        <span
          style={{
            display: 'inline-block',
            marginTop: 9,
            padding: '5px 13px',
            borderRadius: 999,
            background: roleBg,
            color: roleFg,
            font: '700 10.5px/1 Poppins',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {roleLabel}
        </span>
      </div>
    </div>
  );
}
