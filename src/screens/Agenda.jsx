import { useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { tagColors } from '../lib/helpers';
import { badgeCode } from '../lib/badge';
import { StarIcon, CheckCircleIcon } from '../components/icons';
import QrCode from '../components/QrCode';

export default function Agenda({ t, lang, saved, onOpenSession, onToggleStar, checkedInAt, onCheckIn, onUndoCheckIn, sessionCheckins, onToggleSessionCheckIn, userId }) {
  const [view, setView] = useState('all');
  const visibleSessions = view === 'mine' ? SESSIONS.filter((s) => saved[s.id]) : SESSIONS;

  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="card"
        style={{
          marginBottom: 14,
          background: checkedInAt ? '#FBF0D3' : '#FFF0F6',
          border: 'none',
          cursor: checkedInAt ? 'default' : 'pointer',
        }}
        onClick={checkedInAt ? undefined : onCheckIn}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ font: '600 13.5px/1.3 Poppins', color: checkedInAt ? '#8A6A12' : '#B01253' }}>
              {checkedInAt ? t.checkedInAt : t.checkInPromptTitle}
            </div>
            <div style={{ font: '400 11.5px/1.4 Poppins', color: '#7A6070', marginTop: 3 }}>
              {checkedInAt
                ? new Date(checkedInAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : t.checkInPromptBody}
            </div>
          </div>
          {!checkedInAt && (
            <div style={{ flex: 'none', padding: '9px 14px', borderRadius: 999, background: '#B01253', color: '#fff', font: '600 12px/1 Poppins' }}>
              {t.checkInButton}
            </div>
          )}
        </div>

        {checkedInAt && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <QrCode value={badgeCode(userId)} size={128} />
            </div>
            <div style={{ font: '600 12.5px/1 Poppins', letterSpacing: '0.08em', color: '#8A6A12' }}>{badgeCode(userId)}</div>
            <div style={{ font: '400 11.5px/1.5 Poppins', color: '#7A6070', marginTop: 8 }}>{t.badgeShow}</div>
            <div
              style={{ font: '500 12px/1 Poppins', color: '#B01253', marginTop: 12, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onUndoCheckIn();
              }}
            >
              {t.undoCheckIn}
            </div>
          </div>
        )}
      </div>

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

      {view === 'mine' && visibleSessions.length === 0 && <div className="empty-note">{t.myScheduleEmpty}</div>}

      {visibleSessions.map((s) => {
        const [tagBg, tagFg] = tagColors(s.kind);
        const isSaved = !!saved[s.id];
        const isCheckedIn = !!sessionCheckins[s.id];
        const title = lang === 'es' ? s.titleEs : s.title;
        const tag = t[s.tagKey];
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
