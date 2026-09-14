import { useState } from 'react';
import { initials, colorForId } from '../lib/helpers';
import { POLL_OPTIONS, POLL_PROMPT } from '../data/sessions';
import { SendIcon } from '../components/icons';

export default function Session({ userId, myName, messages, votes, words, people, draft, setDraft, onSend, onVote, word, setWord, onAddWord }) {
  const [tab, setTab] = useState('chat');

  const nameFor = (uid) => {
    if (uid === userId) return 'You';
    const p = people.find((x) => x.id === uid);
    return p && p.display_name ? p.display_name : 'Attendee';
  };

  return (
    <div className="screen">
      <div style={{ padding: '14px 18px 0' }}>
        <div className="tab-row">
          <div
            className="tab-item"
            style={{ color: tab === 'chat' ? '#2E1035' : '#A08E9A', borderColor: tab === 'chat' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('chat')}
          >
            Group chat
          </div>
          <div
            className="tab-item"
            style={{ color: tab === 'poll' ? '#2E1035' : '#A08E9A', borderColor: tab === 'poll' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('poll')}
          >
            Live poll
          </div>
        </div>
      </div>

      {tab === 'chat' ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 480 }}>
          <div className="chat-list">
            {messages.map((m) => {
              const mine = m.user_id === userId;
              const who = nameFor(m.user_id);
              const ini = mine ? initials(myName) : initials(who);
              const color = mine ? '#2E1035' : colorForId(m.user_id);
              return (
                <div
                  className="chat-row"
                  key={m.id}
                  style={{ alignSelf: mine ? 'flex-end' : 'flex-start', flexDirection: mine ? 'row-reverse' : 'row' }}
                >
                  <div className="chat-avatar" style={{ background: color }}>
                    {ini}
                  </div>
                  <div>
                    <div className="chat-who">{who}</div>
                    <div className="chat-bubble" style={{ background: mine ? '#2E1035' : '#fff', color: mine ? '#fff' : '#2E1035' }}>
                      {m.body}
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && <div className="empty-note">No messages yet. Say hello.</div>}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              placeholder="Message the group"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
            <div className="send-btn" onClick={onSend}>
              <SendIcon />
            </div>
          </div>
        </div>
      ) : (
        <div className="screen-pad">
          <div style={{ font: "600 16px/1.4 Poppins" }}>{POLL_PROMPT}</div>
          <div style={{ font: "400 11.5px/1.4 Poppins", color: '#7A6070', margin: '6px 0 14px' }}>
            {votes.length} {votes.length === 1 ? 'response in this room' : 'responses in this room'}
          </div>
          {POLL_OPTIONS.map(([oid, label]) => {
            const n = votes.filter((v) => v.option_id === oid).length;
            const total = votes.length || 1;
            const pct = Math.round((n / total) * 100);
            const myVote = votes.find((v) => v.user_id === userId);
            const mine = myVote && myVote.option_id === oid;
            return (
              <div
                className="poll-option"
                key={oid}
                style={{ borderColor: mine ? '#D81B60' : 'rgba(46,16,53,.10)' }}
                onClick={() => onVote(oid)}
              >
                <div className="poll-fill" style={{ background: mine ? 'rgba(216,27,96,.16)' : 'rgba(46,16,53,.06)', width: pct + '%' }} />
                <div className="poll-row">
                  <span>{label}</span>
                  <span style={{ color: '#7A6070' }}>{pct}%</span>
                </div>
              </div>
            );
          })}
          <div className="section-label">What health looks like today</div>
          <div className="word-cloud">
            {(() => {
              const counts = {};
              words.forEach((w) => {
                const k = w.word.toLowerCase();
                counts[k] = (counts[k] || 0) + 1;
              });
              const keys = Object.keys(counts);
              if (keys.length === 0) return <div className="word-cloud-empty">Nobody's added a word yet.</div>;
              const colors = ['#D81B60', '#1F7A78', '#F58220', '#5C1A4C', '#8E1148', '#B96B0C'];
              return keys.map((w, i) => (
                <span key={w} style={{ fontFamily: 'Poppins', fontWeight: 600, lineHeight: 1, fontSize: 13 + Math.min(counts[w], 12) * 2.6, color: colors[i % colors.length] }}>
                  {w}
                </span>
              ));
            })()}
          </div>
          <div className="add-row">
            <input
              className="add-input"
              type="text"
              placeholder="Add one word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddWord()}
            />
            <div className="add-btn" onClick={onAddWord}>
              Add
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
