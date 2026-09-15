import { useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { tagColors, colorForId } from '../lib/helpers';
import { StarIcon, CheckCircleIcon } from '../components/icons';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';

export default function Agenda({ t, lang, saved, onOpenSession, onToggleStar, sessionCheckins, onToggleSessionCheckIn, sessionHosts, onOpenPerson }) {
  const [view, setView] = useState('all');
  const visibleSessions = view === 'mine' ? SESSIONS.filter((s) => saved[s.id]) : SESSIONS;

  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', background: '#F0E7EC', borderRadius: 999, padding: 4, marginBottom: 14 }}>
        <div
          onClick={() => setView('all')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '9px 0',
            borderRadius: 999,
            font: '600 13px/1 Poppins',
            cursor: 'pointer',
            background: view === 'all' ? '#2E1035' : 'transparent',
            color: view === 'all' ? '#fff' : '#7A6070',
          }}
        >
          {t.allSessions}
        </div>
        <div
          onClick={() => setView('mine')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '9px 0',
            borderRadius: 999,
            font: '600 13px/1 Poppins',
            cursor: 'pointer',
            background: view === 'mine' ? '#2E1035' : 'transparent',
            color: view === 'mine' ? '#fff' : '#7A6070',
          }}
        >
          {t.mySchedule}
        </div>
      </div>

      {view === 'mine' && visibleSessions.length === 0 && (
        <div className="empty-state">
          <Flourish color="#FFDCEF" size={160} top={-40} right={-40} opacity={0.5} />
          <Flourish color="#FBEAB0" size={130} bottom={-30} left={-30} opacity={0.5} rotate={30} />
          <div className="empty-note">{t.myScheduleEmpty}</div>
        </div>
      )}

      {visibleSessions.map((s) => {
        const [tagBg, tagFg] = tagColors(s.kind);
        const isSaved = !!saved[s.id];
        const isCheckedIn = !!sessionCheckins[s.id];
        const title = lang === 'es' ? s.titleEs : s.title;
        const tag = t[s.tagKey];
        const hosts = (sessionHosts && sessionHosts[s.id]) || [];
        return (
          <div className="session-row" key={s.id}>
            <div className="session-time">
              <div className="session-time-t">{s.t}</div>
              <div className="session-time-d">{s.d}</div>
            </div>
            <div className="session-card">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="tag-pill" style={{ background: tagBg, color: tagFg }}>
                  {tag}
                </span>
                <div className="session-title" onClick={() => onOpenSession(s.id)}>
                  {title}
                </div>
                <div className="session-sub">{s.room}</div>
                {hosts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 9 }}>
                    {hosts.map((h) => (
                      <div
                        key={h.userId}
                        onClick={() => onOpenPerson(h.userId)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
                      >
                        <Avatar url={h.avatarUrl} name={h.name} color={colorForId(h.userId)} size={24} fontSize={10} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ font: '600 12px/1.2 Poppins', color: '#2E1035' }}>{h.name}</div>
                          {(lang === 'es' ? h.roleEs || h.roleEn : h.roleEn) && (
                            <div style={{ font: '400 10.5px/1.2 Poppins', color: '#A08E9A' }}>{lang === 'es' ? h.roleEs || h.roleEn : h.roleEn}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  className="star-btn"
                  style={{ background: isSaved ? '#FFE2ED' : '#F3EFF1' }}
                  onClick={() => onToggleStar(s.id)}
                  title={t.saveIt}
                >
                  <StarIcon filled={isSaved} color={isSaved ? '#D81B60' : '#A08E9A'} />
                </div>
                <div
                  className="star-btn"
                  style={{ background: isCheckedIn ? '#FBD9BC' : '#F3EFF1' }}
                  onClick={() => onToggleSessionCheckIn(s.id)}
                  title={isCheckedIn ? t.sessionCheckedIn : t.sessionCheckIn}
                >
                  <CheckCircleIcon filled={isCheckedIn} color={isCheckedIn ? '#A63D06' : '#A08E9A'} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
