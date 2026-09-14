import { SESSIONS } from '../data/sessions';
import { tagColors } from '../lib/helpers';
import { StarIcon } from '../components/icons';

export default function Agenda({ t, lang, saved, onOpenSession, onToggleStar, checkedInAt, onCheckIn }) {
  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="card"
        style={{
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          background: checkedInAt ? '#E9F4F3' : '#FFF0F6',
          border: 'none',
          cursor: checkedInAt ? 'default' : 'pointer',
        }}
        onClick={checkedInAt ? undefined : onCheckIn}
      >
        <div>
          <div style={{ font: '600 13.5px/1.3 Poppins', color: checkedInAt ? '#1F5F5E' : '#B01253' }}>
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

      {SESSIONS.map((s) => {
        const [tagBg, tagFg] = tagColors(s.kind);
        const isSaved = !!saved[s.id];
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
              <div
                className="star-btn"
                style={{ background: isSaved ? '#FFE2ED' : '#F3EFF1' }}
                onClick={() => onToggleStar(s.id)}
              >
                <StarIcon filled={isSaved} color={isSaved ? '#D81B60' : '#A08E9A'} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
