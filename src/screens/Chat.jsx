import { useState } from 'react';
import ChatThread from '../components/ChatThread';
import Avatar from '../components/Avatar';
import AskHues from '../components/AskHues';
import CommunityGuidelines from '../components/CommunityGuidelines';
import { colorForId } from '../lib/helpers';

export default function Chat({
  t,
  userId,
  myName,
  myAvatarUrl,
  people,
  waitingRoomMsgs,
  waitingRoomDraft,
  setWaitingRoomDraft,
  onSendWaitingRoom,
  lobbyMsgs,
  lobbyDraft,
  setLobbyDraft,
  onSendLobby,
  triageMsgs,
  triageDraft,
  setTriageDraft,
  onSendTriage,
  dmThreads,
  onOpenThread,
  aiChatMsgs,
  aiChatSending,
  onSendAiChat,
}) {
  const [tab, setTab] = useState('waitingRoom');

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

  const TABS = [
    { key: 'waitingRoom', label: t.chatWaitingRoom },
    { key: 'triage', label: t.chatTriage },
    { key: 'lobby', label: t.chatDischarge },
    { key: 'direct', label: t.chatDirect },
    { key: 'askHues', label: t.chatAskHues },
  ];

  return (
    <div className="screen">
      <div style={{ padding: '14px 18px 0' }}>
        <div className="tab-row" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
          {TABS.map(({ key, label }) => (
            <div
              key={key}
              className="tab-item"
              style={{ flex: 'none', whiteSpace: 'nowrap', color: tab === key ? '#2E1035' : '#7E6A76', borderColor: tab === key ? '#D81B60' : 'transparent' }}
              onClick={() => setTab(key)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '10px 18px 0' }}>
        <CommunityGuidelines t={t} />
      </div>

      {tab === 'waitingRoom' && (
        <>
          <div style={{ padding: '14px 18px 0', font: '400 12.5px/1.55 Poppins', color: '#4A3348' }}>{t.waitingRoomIntro}</div>
          <ChatThread
            youLabel={t.you}
            userId={userId}
            myName={myName}
            myAvatarUrl={myAvatarUrl}
            messages={waitingRoomMsgs}
            nameFor={nameFor}
            avatarFor={avatarFor}
            draft={waitingRoomDraft}
            setDraft={setWaitingRoomDraft}
            onSend={onSendWaitingRoom}
            placeholder={t.waitingRoomPlaceholder}
            emptyText={t.waitingRoomEmpty}
          />
        </>
      )}

      {tab === 'lobby' && (
        <>
          <div style={{ padding: '14px 18px 0', font: '400 12.5px/1.55 Poppins', color: '#4A3348' }}>{t.dischargeIntro}</div>
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
            placeholder={t.dischargePlaceholder}
            emptyText={t.dischargeEmpty}
          />
        </>
      )}

      {tab === 'triage' && (
        <>
          <div style={{ padding: '14px 18px 0', font: '400 12.5px/1.55 Poppins', color: '#4A3348' }}>{t.triageIntro}</div>
          <ChatThread
            youLabel={t.you}
            userId={userId}
            myName={myName}
            myAvatarUrl={myAvatarUrl}
            messages={triageMsgs}
            nameFor={nameFor}
            avatarFor={avatarFor}
            draft={triageDraft}
            setDraft={setTriageDraft}
            onSend={onSendTriage}
            placeholder={t.triagePlaceholder}
            emptyText={t.triageEmpty}
          />
        </>
      )}

      {tab === 'askHues' && (
        <AskHues t={t} myName={myName} myAvatarUrl={myAvatarUrl} msgs={aiChatMsgs} sending={aiChatSending} onSend={onSendAiChat} />
      )}

      {tab === 'direct' && (
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
