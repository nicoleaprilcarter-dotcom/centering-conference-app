import { SESSIONS } from '../data/sessions';
import StarRating from '../components/StarRating';

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
  sessionRatings,
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
        <div style={{ font: '400 11.5px/1.5 Poppins', color: '#A08E9A', marginBottom: 14 }}>{t.rateSessionsSub}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SESSIONS.map((s) => (
            <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0, font: '600 13px/1.35 Poppins' }}>{lang === 'es' ? s.titleEs : s.title}</div>
              <StarRating value={sessionRatings[s.id] || 0} onChange={(n) => onRateSession(s.id, n)} size={16} />
            </div>
          ))}
        </div>

        {saved && <div className="fine-note" style={{ marginTop: 20 }}>{t.feedbackThanks}</div>}
      </div>
    </div>
  );
}
