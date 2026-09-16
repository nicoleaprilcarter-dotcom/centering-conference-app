import { useState } from 'react';
import { SendIcon, SparkleIcon } from './icons';
import Avatar from './Avatar';

export default function AskHues({ t, myName, myAvatarUrl, msgs, sending, onSend }) {
  const [draft, setDraft] = useState('');

  const send = () => {
    const v = draft.trim();
    if (!v || sending) return;
    setDraft('');
    onSend(v);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 480 }}>
      <div style={{ padding: '14px 18px 0', font: '400 12.5px/1.55 Poppins', color: '#4A3348' }}>{t.askHuesIntro}</div>
      <div className="chat-list">
        {msgs.length === 0 && <div className="empty-note">{t.askHuesEmpty}</div>}
        {msgs.map((m, i) => {
          const mine = m.role === 'user';
          return (
            <div key={i} className="chat-row" style={{ alignSelf: mine ? 'flex-end' : 'flex-start', flexDirection: mine ? 'row-reverse' : 'row' }}>
              {mine ? (
                <Avatar url={myAvatarUrl} name={myName} color="#2E1035" size={40} fontSize={14} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FBEAB0', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <SparkleIcon color="#7A5205" />
                </div>
              )}
              <div>
                <div className="chat-who">{mine ? t.you : t.askHuesName}</div>
                <div className="chat-bubble" style={{ background: mine ? '#2E1035' : '#fff', color: mine ? '#fff' : '#2E1035' }}>
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
        {sending && <div className="empty-note">{t.askHuesThinking}</div>}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder={t.askHuesPlaceholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <div className="send-btn" onClick={send}>
          <SendIcon />
        </div>
      </div>
    </div>
  );
}
