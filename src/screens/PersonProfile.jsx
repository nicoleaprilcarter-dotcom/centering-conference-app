import Avatar from '../components/Avatar';
import DesignationBadge from '../components/DesignationBadge';
import { colorForId } from '../lib/helpers';
import { translateTagLabel } from '../data/translations';

export default function PersonProfile({ t, lang, person, onBack, onMessage }) {
  const { userId, name, avatarUrl, pronouns, bio, interests, designation, role } = person;

  return (
    <div className="screen-pad">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div
          style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: '1px solid rgba(46,16,53,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E1035" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </div>
        <div style={{ font: '600 15px/1.2 Poppins' }}>{t.profile}</div>
      </div>

      <div className="card" style={{ border: 'none', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar url={avatarUrl} name={name} color={colorForId(userId || name)} size={72} fontSize={22} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '700 17px/1.25 Poppins', color: '#2E1035' }}>{name}</div>
            {pronouns && <div style={{ font: '400 12.5px/1.3 Poppins', color: '#7A6070', marginTop: 2 }}>{pronouns}</div>}
            {role && <div style={{ font: '500 12.5px/1.3 Poppins', color: '#A08E9A', marginTop: 2 }}>{role}</div>}
          </div>
        </div>

        {(designation || (interests || []).length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            <DesignationBadge designation={designation} t={t} />
            {(interests || []).map((tag) => (
              <span className="person-tag" key={tag}>
                {translateTagLabel(tag, lang)}
              </span>
            ))}
          </div>
        )}

        {bio && <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348', marginTop: 16 }}>{bio}</div>}
      </div>

      {onMessage && (
        <div className="primary-btn" onClick={onMessage}>
          {t.message}
        </div>
      )}
    </div>
  );
}
