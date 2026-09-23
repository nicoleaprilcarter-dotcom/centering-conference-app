import Avatar from '../components/Avatar';
import { colorForId } from '../lib/helpers';

export default function SponsorDetail({ t, lang, sponsor, onBack, saved, onToggleSave }) {
  if (!sponsor) return null;
  const note = lang === 'es' ? sponsor.note_es || sponsor.note_en : sponsor.note_en;
  const mission = lang === 'es' ? sponsor.mission_es || sponsor.mission_en : sponsor.mission_en;

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
        <div style={{ font: '600 15px/1.2 Poppins' }}>{sponsor.category === 'partner' ? t.communityPartner : t.sponsor}</div>
      </div>

      <div className="card" style={{ border: 'none', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar url={sponsor.logo_url} name={sponsor.name} color={colorForId(sponsor.id)} size={72} fontSize={22} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '700 17px/1.25 Poppins', color: '#2E1035' }}>{sponsor.name}</div>
            {note && <div style={{ font: '400 12.5px/1.4 Poppins', color: '#7A6070', marginTop: 3 }}>{note}</div>}
          </div>
        </div>

        {mission && (
          <>
            <div className="field-title" style={{ margin: '18px 0 6px' }}>
              {t.sponsorDetailMission}
            </div>
            <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348' }}>{mission}</div>
          </>
        )}

        {(sponsor.contact_name || sponsor.contact_email) && (
          <>
            <div className="field-title" style={{ margin: '18px 0 6px' }}>
              {t.sponsorDetailContact}
            </div>
            {sponsor.contact_name && <div style={{ font: '500 13px/1.5 Poppins', color: '#2E1035' }}>{sponsor.contact_name}</div>}
            {sponsor.contact_email && (
              <a href={`mailto:${sponsor.contact_email}`} style={{ font: '500 13px/1.5 Poppins', color: '#B01253', textDecoration: 'none' }}>
                {sponsor.contact_email}
              </a>
            )}
          </>
        )}
      </div>

      {onToggleSave && (
        <div
          className="primary-btn"
          style={{ marginTop: 12, background: saved ? '#F3EFF1' : undefined, color: saved ? '#2E1035' : undefined }}
          onClick={() => onToggleSave(sponsor.id)}
        >
          {saved ? t.toolkitSavedButton : t.toolkitSaveButton}
        </div>
      )}

      {sponsor.website_url && (
        <a
          className="primary-btn"
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 12 }}
          href={sponsor.website_url}
          target="_blank"
          rel="noreferrer"
        >
          {t.visitWebsite}
        </a>
      )}
    </div>
  );
}
