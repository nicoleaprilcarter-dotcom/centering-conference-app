import { useState } from 'react';
import ChatThread from '../components/ChatThread';
import Avatar from '../components/Avatar';
import { colorForId } from '../lib/helpers';

export default function Chat({
  t,
  userId,
  myName,
  myAvatarUrl,
  people,
  lobbyMsgs,
  lobbyDraft,
  setLobbyDraft,
  onSendLobby,
  dmThreads,
  onOpenThread,
}) {
  const [tab, setTab] = useState('lobby');

  const personFor = (id) => people.find((p) => p.id === id);
  const nameFor = (id) => {
    if (id === userId) return t.you;
    const p = personFor(id);
    return p && p.display_name ? p.display_name : t.attendee;
  };
  const avatarFor = (id) => {
    const p = personFor(id);
    return p ? p.avatar_url : null;
  };

  return (
    <div className="screen">
      <div style={{ padding: '14px 18px 0' }}>
        <div className="tab-row">
          <div
            className="tab-item"
            style={{ color: tab === 'lobby' ? '#2E1035' : '#A08E9A', borderColor: tab === 'lobby' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('lobby')}
          >
            {t.chatEveryone}
          </div>
          <div
            className="tab-item"
            style={{ color: tab === 'direct' ? '#2E1035' : '#A08E9A', borderColor: tab === 'direct' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('direct')}
          >
            {t.chatDirect}
          </div>
        </div>
      </div>

      {tab === 'lobby' ? (
        <ChatThread
          youLabel={t.you}
          userId={userId}
          myName={myName}
          myAvatarUrl={myAvatarUrl}
          messages={lobbyMsgs}
          nameFor={nameFor}
          avatarFor={avatarFor}
          draft={lobbyDraft}
          setDraft={setLobbyDraft}
          onSend={onSendLobby}
          placeholder={t.lobbyPlaceholder}
          emptyText={t.lobbyEmpty}
        />
      ) : (
        <div className="screen-pad">
          {dmThreads.length === 0 && <div className="empty-note">{t.directEmpty}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {dmThreads.map((th) => (
              <div className="person-card" key={th.userId} onClick={() => onOpenThread(th.userId)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar url={th.avatarUrl} name={th.name} color={colorForId(th.userId)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="person-name">{th.name}</div>
                    <div className="person-bio">{th.lastMessage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
