import { colorForId } from '../lib/helpers';
import { SendIcon } from './icons';
import Avatar from './Avatar';
import Flourish from './Flourish';

// Shared list-of-bubbles + composer, used by the lobby room, session
// group chat, and 1:1 direct message threads. `messages` items need
// `id`, `user_id` (or `sender_id`), `body`, and the caller resolves a
// display name + avatar for each via `nameFor` / `avatarFor`.
export default function ChatThread({ youLabel = 'You', userId, myName, myAvatarUrl, messages, idField = 'user_id', nameFor, avatarFor, draft, setDraft, onSend, placeholder = 'Message the group', emptyText = 'No messages yet. Say hello.' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 420 }}>
      <div className="chat-list">
        {messages.map((m) => {
          const otherId = m[idField];
          const mine = otherId === userId;
          const who = mine ? youLabel : nameFor(otherId);
          const avatarUrl = mine ? myAvatarUrl : avatarFor(otherId);
          const avatarName = mine ? myName : who;
          const color = mine ? '#2E1035' : colorForId(otherId);
          return (
            <div
              className="chat-row"
              key={m.id}
              style={{ alignSelf: mine ? 'flex-end' : 'flex-start', flexDirection: mine ? 'row-reverse' : 'row' }}
            >
              <Avatar url={avatarUrl} name={avatarName} color={color} size={40} fontSize={14} />
              <div>
                <div className="chat-who">{who}</div>
                <div className="chat-bubble" style={{ background: mine ? '#2E1035' : '#fff', color: mine ? '#fff' : '#2E1035' }}>
                  {m.body}
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="empty-state">
            <Flourish color="#FFDCEF" size={150} top={-30} left={-40} opacity={0.5} />
            <Flourish color="#FBEAB0" size={120} bottom={-30} right={-30} opacity={0.5} rotate={40} />
            <div className="empty-note">{emptyText}</div>
          </div>
        )}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
        />
        <div className="send-btn" onClick={onSend}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
}
