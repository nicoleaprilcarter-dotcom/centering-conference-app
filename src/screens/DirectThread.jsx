import ChatThread from '../components/ChatThread';
import Avatar from '../components/Avatar';
import { colorForId } from '../lib/helpers';

export default function DirectThread({ userId, myName, myAvatarUrl, otherId, otherName, otherAvatarUrl, messages, draft, setDraft, onSend, onBack }) {
  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px 0' }}>
        <div
          style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: '1px solid rgba(46,16,53,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E1035" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </div>
        <Avatar url={otherAvatarUrl} name={otherName} color={colorForId(otherId)} size={32} fontSize={12} />
        <div style={{ font: '600 15px/1.2 Poppins' }}>{otherName}</div>
      </div>
      <ChatThread
        userId={userId}
        myName={myName}
        myAvatarUrl={myAvatarUrl}
        messages={messages}
        idField="sender_id"
        nameFor={() => otherName}
        avatarFor={() => otherAvatarUrl}
        draft={draft}
        setDraft={setDraft}
        onSend={onSend}
        placeholder={`Message ${otherName}`}
        emptyText="No messages yet. Say hello."
      />
    </div>
  );
}
