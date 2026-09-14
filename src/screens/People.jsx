import { useState } from 'react';
import { colorForId } from '../lib/helpers';
import { translateTagLabel } from '../data/translations';
import Avatar from '../components/Avatar';

export default function People({ t, lang, userId, people, speakers, onMessage }) {
  const [tab, setTab] = useState('speakers');
  const visiblePeople = people.filter((p) => p.display_name);

  return (
    <div className="screen-pad">
      <div className="tab-row" style={{ marginBottom: 14 }}>
        <div
          className="tab-item"
          style={{ color: tab === 'speakers' ? '#2E1035' : '#A08E9A', borderColor: tab === 'speakers' ? '#D81B60' : 'transparent' }}
          onClick={() => setTab('speakers')}
        >
          {t.speakers}
        </div>
        <div
          className="tab-item"
          style={{ color: tab === 'attendees' ? '#2E1035' : '#A08E9A', borderColor: tab === 'attendees' ? '#D81B60' : 'transparent' }}
          onClick={() => setTab('attendees')}
        >
          {t.attendees}
        </div>
      </div>

      {tab === 'speakers' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {speakers.map((sp) => (
            <div className="person-card" key={sp.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar url={sp.photo_url} name={sp.name} color={colorForId(sp.id)} size={52} fontSize={17} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="person-name">{sp.name}</div>
                  <div className="person-bio">{lang === 'es' ? sp.role_es || sp.role_en : sp.role_en}</div>
                </div>
              </div>
              {(lang === 'es' ? sp.bio_es || sp.bio_en : sp.bio_en) && (
                <div style={{ font: '400 12.5px/1.55 Poppins', color: '#4A3348', marginTop: 11 }}>
                  {lang === 'es' ? sp.bio_es || sp.bio_en : sp.bio_en}
                </div>
              )}
            </div>
          ))}
          {speakers.length === 0 && <div className="empty-note">{t.speakersEmpty}</div>}
        </div>
      ) : (
        <>
          <div className="empty-note" style={{ padding: 0, textAlign: 'left', marginBottom: 12 }}>
            {t.attendeesNote}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {visiblePeople.map((p) => (
              <div className="person-card" key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar url={p.avatar_url} name={p.display_name} color={p.id === userId ? '#2E1035' : colorForId(p.id)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="person-name">
                      {p.display_name}
                      {p.pronouns ? ` · ${p.pronouns}` : ''}
                    </div>
                    <div className="person-bio">{p.bio || t.attendee}</div>
                  </div>
                  {p.id !== userId && (
                    <div
                      style={{ flex: 'none', padding: '9px 14px', borderRadius: 999, font: '600 12px/1 Poppins', cursor: 'pointer', background: '#FFF0F6', color: '#B01253' }}
                      onClick={() => onMessage(p.id)}
                    >
                      {t.message}
                    </div>
                  )}
                </div>
                {(p.interests || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                    {p.interests.map((tag) => (
                      <span className="person-tag" key={tag}>
                        {translateTagLabel(tag, lang)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {visiblePeople.length === 0 && <div className="empty-note">{t.attendeesEmpty}</div>}
        </>
      )}
    </div>
  );
}
