import { colorForId } from '../lib/helpers';
import Avatar from '../components/Avatar';

export default function People({ userId, people, onMessage }) {
  const visible = people.filter((p) => p.display_name);

  return (
    <div className="screen-pad">
      <div className="empty-note" style={{ padding: 0, textAlign: 'left', marginBottom: 12 }}>
        Only attendees who turned on directory visibility appear here.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {visible.map((p) => (
          <div className="person-card" key={p.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar url={p.avatar_url} name={p.display_name} color={p.id === userId ? '#2E1035' : colorForId(p.id)} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="person-name">
                  {p.display_name}
                  {p.pronouns ? ` · ${p.pronouns}` : ''}
                </div>
                <div className="person-bio">{p.bio || 'Attendee'}</div>
              </div>
              {p.id !== userId && (
                <div
                  style={{
                    flex: 'none',
                    padding: '9px 14px',
                    borderRadius: 999,
                    font: '600 12px/1 Poppins',
                    cursor: 'pointer',
                    background: '#FFF0F6',
                    color: '#B01253',
                  }}
                  onClick={() => onMessage(p.id)}
                >
                  Message
                </div>
              )}
            </div>
            {(p.interests || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                {p.interests.map((tag) => (
                  <span className="person-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {visible.length === 0 && <div className="empty-note">Nobody is in the directory yet.</div>}
    </div>
  );
}
