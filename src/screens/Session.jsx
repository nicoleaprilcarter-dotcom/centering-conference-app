import { useState } from 'react';
import { colorForId } from '../lib/helpers';
import { POLL_OPTIONS, POLL_PROMPT } from '../data/sessions';
import { SendIcon, SparkleIcon } from '../components/icons';
import Avatar from '../components/Avatar';
import ReportMenu from '../components/ReportMenu';

export default function Session({
  t,
  lang,
  userId,
  myName,
  myAvatarUrl,
  messages,
  votes,
  words,
  people,
  draft,
  setDraft,
  onSend,
  onVote,
  word,
  setWord,
  onAddWord,
  questions = [],
  questionVotes = [],
  onAskQuestion,
  onToggleQuestionVote,
  onAnswerQuestion,
  isModerator,
  recap,
  onGenerateRecap,
  onReport,
  onBlock,
}) {
  const [tab, setTab] = useState('chat');
  const [qDraft, setQDraft] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [generatingRecap, setGeneratingRecap] = useState(false);

  const voteCount = (qId) => questionVotes.filter((v) => v.question_id === qId).length;
  const myVoteOn = (qId) => questionVotes.some((v) => v.question_id === qId && v.user_id === userId);
  const sortedQuestions = [...questions].sort((a, b) => voteCount(b.id) - voteCount(a.id) || (a.created_at < b.created_at ? -1 : 1));

  const handleGenerateRecap = async () => {
    setGeneratingRecap(true);
    await onGenerateRecap();
    setGeneratingRecap(false);
  };

  const nameFor = (uid) => {
    if (uid === userId) return t.you;
    const p = people.find((x) => x.id === uid);
    return p && p.display_name ? p.display_name : t.attendee;
  };

  return (
    <div className="screen">
      <div style={{ padding: '14px 18px 0' }}>
        <div className="tab-row">
          <div
            className="tab-item"
            style={{ color: tab === 'chat' ? '#2E1035' : '#7E6A76', borderColor: tab === 'chat' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('chat')}
          >
            {t.groupChat}
          </div>
          <div
            className="tab-item"
            style={{ color: tab === 'poll' ? '#2E1035' : '#7E6A76', borderColor: tab === 'poll' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('poll')}
          >
            {t.livePoll}
          </div>
          <div
            className="tab-item"
            style={{ color: tab === 'qa' ? '#2E1035' : '#7E6A76', borderColor: tab === 'qa' ? '#D81B60' : 'transparent' }}
            onClick={() => setTab('qa')}
          >
            {t.sessionQa}
          </div>
        </div>
      </div>

      {tab === 'chat' ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 480 }}>
          {(recap || isModerator) && (
            <div style={{ margin: '12px 18px 0', padding: 12, borderRadius: 14, background: '#F3EFF1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 11px/1 Poppins', color: '#B01253', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                <SparkleIcon /> {t.sessionRecapTitle}
              </div>
              {recap ? (
                <div style={{ font: '400 12.5px/1.55 Poppins', color: '#2E1035', marginTop: 6 }}>
                  {lang === 'es' ? recap.summary_es || recap.summary_en : recap.summary_en}
                </div>
              ) : (
                <div style={{ font: '400 12px/1.5 Poppins', color: '#7A6070', marginTop: 6 }}>{t.sessionRecapEmpty}</div>
              )}
              {isModerator && (
                <div className="text-link-btn" style={{ margin: '8px 0 0', padding: 0 }} onClick={handleGenerateRecap}>
                  {generatingRecap ? t.sessionRecapGenerating : recap ? t.sessionRecapRegenerate : t.sessionRecapGenerate}
                </div>
              )}
            </div>
          )}
          <div className="chat-list">
            {messages.map((m) => {
              const mine = m.user_id === userId;
              const who = mine ? t.you : nameFor(m.user_id);
              const avatarUrl = mine ? myAvatarUrl : people.find((p) => p.id === m.user_id)?.avatar_url;
              const avatarName = mine ? myName : who;
              const color = mine ? '#2E1035' : colorForId(m.user_id);
              return (
                <div
                  className="chat-row"
                  key={m.id}
                  style={{ alignSelf: mine ? 'flex-end' : 'flex-start', flexDirection: mine ? 'row-reverse' : 'row' }}
                >
                  <Avatar url={avatarUrl} name={avatarName} color={color} size={40} fontSize={14} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <div>
                      <div className="chat-who">{who}</div>
                      <div className="chat-bubble" style={{ background: mine ? '#2E1035' : '#fff', color: mine ? '#fff' : '#2E1035' }}>
                        {m.body}
                      </div>
                    </div>
                    {!mine && onReport && (
                      <ReportMenu
                        t={t}
                        align="left"
                        onReport={(reason, details) => onReport('message', m.id, m.user_id, reason, details)}
                        onBlock={onBlock ? () => onBlock(m.user_id) : null}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && <div className="empty-note">{t.noMessages}</div>}
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              type="text"
              placeholder={t.messagePlaceholder}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
            <div className="send-btn" onClick={onSend}>
              <SendIcon />
            </div>
          </div>
        </div>
      ) : tab === 'qa' ? (
        <div className="screen-pad">
          <div className="add-row" style={{ marginBottom: 14 }}>
            <input
              className="add-input"
              type="text"
              placeholder={t.askQuestionPlaceholder}
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && qDraft.trim()) {
                  onAskQuestion(qDraft);
                  setQDraft('');
                }
              }}
            />
            <div
              className="add-btn"
              onClick={() => {
                if (!qDraft.trim()) return;
                onAskQuestion(qDraft);
                setQDraft('');
              }}
            >
              {t.add}
            </div>
          </div>
          {sortedQuestions.length === 0 && <div className="empty-note">{t.noQuestions}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sortedQuestions.map((q) => {
              const mine = myVoteOn(q.id);
              return (
                <div key={q.id} style={{ background: '#fff', border: '1px solid rgba(46,16,53,.08)', borderRadius: 14, padding: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div
                      onClick={() => onToggleQuestionVote(q.id)}
                      style={{
                        flex: 'none',
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background: mine ? '#FFE0F0' : '#F3EFF1',
                        color: mine ? '#C6106B' : '#7A6070',
                        font: '700 13px/1 Poppins',
                      }}
                      title={t.upvote}
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>▲</span>
                      {voteCount(q.id)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '500 13px/1.4 Poppins', color: '#2E1035' }}>{q.body}</div>
                      {q.answered && q.answer && (
                        <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 10, background: '#FBEAB0' }}>
                          <div style={{ font: '700 10.5px/1 Poppins', color: '#7A5205', marginBottom: 3 }}>{t.answeredLabel}</div>
                          <div style={{ font: '400 12.5px/1.45 Poppins', color: '#2E1035' }}>{q.answer}</div>
                        </div>
                      )}
                      {isModerator && !q.answered && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <input
                            className="field-input dark"
                            style={{ flex: 1, padding: '7px 10px', font: '400 12px/1.3 Poppins' }}
                            type="text"
                            placeholder={t.answerPlaceholder}
                            value={answerDrafts[q.id] || ''}
                            onChange={(e) => setAnswerDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                          />
                          <div
                            className="add-btn"
                            style={{ flex: 'none' }}
                            onClick={() => {
                              onAnswerQuestion(q.id, (answerDrafts[q.id] || '').trim());
                              setAnswerDrafts((d) => ({ ...d, [q.id]: '' }));
                            }}
                          >
                            {t.answerSubmit}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="screen-pad">
          <div style={{ font: '600 16px/1.4 Poppins' }}>{POLL_PROMPT[lang] || POLL_PROMPT.en}</div>
          <div style={{ font: '400 11.5px/1.4 Poppins', color: '#7A6070', margin: '6px 0 14px' }}>
            {votes.length} {votes.length === 1 ? t.pollResponsesOne : t.pollResponsesMany}
          </div>
          {POLL_OPTIONS.map(([oid, labelEn, labelEs]) => {
            const n = votes.filter((v) => v.option_id === oid).length;
            const total = votes.length || 1;
            const pct = Math.round((n / total) * 100);
            const myVote = votes.find((v) => v.user_id === userId);
            const mine = myVote && myVote.option_id === oid;
            const label = lang === 'es' ? labelEs : labelEn;
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
          <div className="section-label">{t.wordCloudTitle}</div>
          <div className="word-cloud">
            {(() => {
              const counts = {};
              words.forEach((w) => {
                const k = w.word.toLowerCase();
                counts[k] = (counts[k] || 0) + 1;
              });
              const keys = Object.keys(counts);
              if (keys.length === 0) return <div className="word-cloud-empty">{t.wordCloudEmpty}</div>;
              const colors = ['#C6106B', '#7A5205', '#A63D06', '#6B1029', '#8A6A12', '#2E1035'];
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
              placeholder={t.addWordPlaceholder}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddWord()}
            />
            <div className="add-btn" onClick={onAddWord}>
              {t.add}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
