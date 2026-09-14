import { SESSIONS } from '../data/sessions';
import { tagColors } from '../lib/helpers';
import { StarIcon } from '../components/icons';

export default function Agenda({ saved, onOpenSession, onToggleStar }) {
  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      {SESSIONS.map((s) => {
        const [tagBg, tagFg] = tagColors(s.kind);
        const isSaved = !!saved[s.id];
        return (
          <div className="session-row" key={s.id}>
            <div className="session-time">
              <div className="session-time-t">{s.t}</div>
              <div className="session-time-d">{s.d}</div>
            </div>
            <div className="session-card">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="tag-pill" style={{ background: tagBg, color: tagFg }}>
                  {s.tag}
                </span>
                <div className="session-title" onClick={() => onOpenSession(s.id)}>
                  {s.title}
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
