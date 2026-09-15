import { useState } from 'react';
import { colorForId, normalizeDesignation } from '../lib/helpers';
import { translateTagLabel } from '../data/translations';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';
import DesignationBadge from '../components/DesignationBadge';

function PersonCard({ p, userId, lang, t, onMessage }) {
  return (
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
      {(p.designation || (p.interests || []).length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
          <DesignationBadge designation={p.designation} t={t} />
          {(p.interests || []).map((tag) => (
            <span className="person-tag" key={tag}>
              {translateTagLabel(tag, lang)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonList({ list, emptyText, userId, lang, t, onMessage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {list.map((p) => (
        <PersonCard key={p.id} p={p} userId={userId} lang={lang} t={t} onMessage={onMessage} />
      ))}
      {list.length === 0 && (
        <div className="empty-state">
          <Flourish color="#FBD9BC" size={160} top={-40} right={-40} opacity={0.5} />
          <Flourish color="#FFDCEF" size={130} bottom={-30} left={-30} opacity={0.5} rotate={-25} />
          <div className="empty-note">{emptyText}</div>
        </div>
      )}
    </div>
  );
}

export default function People({ t, lang, userId, people, speakers, sponsors = [], onMessage }) {
  const [tab, setTab] = useState('speakers');
  const visiblePeople = people.filter((p) => p.display_name);
  const leadership = visiblePeople.filter((p) => ['founder', 'chair', 'board', 'staff'].includes(normalizeDesignation(p.designation)));
  const volunteers = visiblePeople.filter((p) => normalizeDesignation(p.designation) === 'volunteer');
  const sponsorAttendees = visiblePeople.filter((p) => normalizeDesignation(p.designation) === 'sponsor');

  const TABS = [
    { key: 'speakers', label: t.speakers },
    { key: 'leadership', label: t.leadership },
    { key: 'volunteers', label: t.volunteers },
    { key: 'sponsors', label: t.sponsors },
    { key: 'attendees', label: t.attendees },
  ];

  return (
    <div className="screen-pad">
      <div className="tab-row" style={{ marginBottom: 14, overflowX: 'auto', flexWrap: 'nowrap' }}>
        {TABS.map(({ key, label }) => (
          <div
            key={key}
            className="tab-item"
            style={{ flex: 'none', whiteSpace: 'nowrap', color: tab === key ? '#2E1035' : '#A08E9A', borderColor: tab === key ? '#D81B60' : 'transparent' }}
            onClick={() => setTab(key)}
          >
            {label}
          </div>
        ))}
      </div>

      {tab === 'speakers' && (
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
          {speakers.length === 0 && (
            <div className="empty-state">
              <Flourish color="#FBD9BC" size={160} top={-40} right={-40} opacity={0.5} />
              <Flourish color="#FFDCEF" size={130} bottom={-30} left={-30} opacity={0.5} rotate={-25} />
              <div className="empty-note">{t.speakersEmpty}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'leadership' && (
        <>
          <div className="empty-note" style={{ padding: 0, textAlign: 'left', marginBottom: 12 }}>
            {t.leadershipNote}
          </div>
          <PersonList list={leadership} emptyText={t.leadershipEmpty} userId={userId} lang={lang} t={t} onMessage={onMessage} />
        </>
      )}

      {tab === 'volunteers' && (
        <PersonList list={volunteers} emptyText={t.volunteersEmpty} userId={userId} lang={lang} t={t} onMessage={onMessage} />
      )}

      {tab === 'sponsors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {sponsors.map((sp) => (
            <div className="person-card" key={`org-${sp.id}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar url={sp.logo_url} name={sp.name} color={colorForId(sp.id)} size={52} fontSize={17} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="person-name">{sp.name}</div>
                  {(lang === 'es' ? sp.note_es || sp.note_en : sp.note_en) && (
                    <div className="person-bio">{lang === 'es' ? sp.note_es || sp.note_en : sp.note_en}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {sponsorAttendees.map((p) => (
            <PersonCard key={p.id} p={p} userId={userId} lang={lang} t={t} onMessage={onMessage} />
          ))}
          {sponsors.length === 0 && sponsorAttendees.length === 0 && (
            <div className="empty-state">
              <Flourish color="#FBD9BC" size={160} top={-40} right={-40} opacity={0.5} />
              <Flourish color="#FFDCEF" size={130} bottom={-30} left={-30} opacity={0.5} rotate={-25} />
              <div className="empty-note">{t.sponsorsEmpty}</div>
            </div>
          )}
        </div>
      )}

      {tab === 'attendees' && (
        <>
          <div className="empty-note" style={{ padding: 0, textAlign: 'left', marginBottom: 12 }}>
            {t.attendeesNote}
          </div>
          <PersonList list={visiblePeople} emptyText={t.attendeesEmpty} userId={userId} lang={lang} t={t} onMessage={onMessage} />
        </>
      )}
    </div>
  );
}
