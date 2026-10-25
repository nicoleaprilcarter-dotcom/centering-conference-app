import { useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { CONTENT_SESSION_TAG_KEYS } from '../lib/helpers';
import StarRating from '../components/StarRating';
import SessionEvaluationForm from '../components/SessionEvaluationForm';

const EMPTY_EVALUATION = { presentation: 0, presenter: 0, learning: 0, comment: '' };
const EVALUABLE_SESSIONS = SESSIONS.filter((s) => CONTENT_SESSION_TAG_KEYS.includes(s.tagKey));

function SessionEvalRow({ t, lang, session, evaluation, onRateSession }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(evaluation || EMPTY_EVALUATION);
  const [justSaved, setJustSaved] = useState(false);
  const alreadyEvaluated = !!(evaluation && evaluation.presentation);

  const toggleOpen = () => {
    if (!open) setDraft(evaluation || EMPTY_EVALUATION);
    setOpen((v) => !v);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, cursor: 'pointer' }} onClick={toggleOpen}>
        <div style={{ flex: 1, minWidth: 0, font: '600 13px/1.35 Poppins' }}>{lang === 'es' ? session.titleEs : session.title}</div>
        <div style={{ flex: 'none', font: '600 11.5px/1 Poppins', color: alreadyEvaluated ? '#1F7A78' : '#B01253' }}>
          {alreadyEvaluated ? t.evalAlreadySubmitted : t.evalEvaluateThisSession}
        </div>
      </div>
      {open && (
        <SessionEvaluationForm
          t={t}
          value={draft}
          onChange={setDraft}
          onSubmit={async () => {
            const ok = await onRateSession(session.id, draft);
            if (ok) setJustSaved(true);
          }}
          submitLabel={t.evalSubmit}
          submitted={justSaved}
        />
      )}
    </div>
  );
}

export default function Checkout({
  t,
  lang,
  onBack,
  rating,
  setRating,
  comments,
  setComments,
  saving,
  saved,
  onSaveOverall,
  sessionEvaluations,
  onRateSession,
}) {
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
        <div style={{ font: '600 15px/1.2 Poppins' }}>{t.checkout}</div>
      </div>

      <div className="screen-pad">
        <div style={{ font: '600 17px/1.3 Poppins' }}>{t.overallRatingTitle}</div>
        <div style={{ marginTop: 12 }}>
          <StarRating value={rating} onChange={setRating} size={30} />
        </div>
        <div className="wall-composer" style={{ marginTop: 16 }}>
          <textarea
            className="wall-textarea"
            placeholder={t.overallCommentsPh}
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <div className="wall-post-btn" onClick={onSaveOverall}>
            {saving ? '…' : saved ? t.savedFeedback : t.saveFeedback}
          </div>
        </div>

        <div className="section-label" style={{ marginTop: 26 }}>
          {t.rateSessionsTitle}
        </div>
        <div style={{ font: '400 11.5px/1.5 Poppins', color: '#7E6A76', marginBottom: 14 }}>{t.rateSessionsSub}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EVALUABLE_SESSIONS.map((s) => (
            <SessionEvalRow key={s.id} t={t} lang={lang} session={s} evaluation={sessionEvaluations[s.id]} onRateSession={onRateSession} />
          ))}
        </div>

        {saved && <div className="fine-note" style={{ marginTop: 20 }}>{t.feedbackThanks}</div>}
      </div>
    </div>
  );
}
