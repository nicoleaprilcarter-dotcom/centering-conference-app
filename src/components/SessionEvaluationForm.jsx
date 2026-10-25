import LikertScale from './LikertScale';

// The three-statement Likert evaluation shared by the auto-prompt
// modal, the session detail screen, and the Checkout rate-sessions
// list, so every entry point writes the same shape to session_feedback.
export default function SessionEvaluationForm({ t, value, onChange, onSubmit, submitLabel, submitted }) {
  const labels = [t.likertLabel1, t.likertLabel2, t.likertLabel3, t.likertLabel4, t.likertLabel5];
  const canSubmit = value.presentation > 0 && value.presenter > 0 && value.learning > 0;

  return (
    <div>
      <LikertScale
        statement={t.likertPresentationStatement}
        value={value.presentation}
        onChange={(n) => onChange({ ...value, presentation: n })}
        labels={labels}
      />
      <LikertScale
        statement={t.likertPresenterStatement}
        value={value.presenter}
        onChange={(n) => onChange({ ...value, presenter: n })}
        labels={labels}
      />
      <LikertScale
        statement={t.likertLearningStatement}
        value={value.learning}
        onChange={(n) => onChange({ ...value, learning: n })}
        labels={labels}
      />
      <div className="field-title" style={{ margin: '16px 0 6px' }}>
        {t.feedbackNextYear}
      </div>
      <textarea
        className="field-input dark"
        placeholder={t.feedbackCommentPh}
        rows={2}
        value={value.comment}
        onChange={(e) => onChange({ ...value, comment: e.target.value })}
        style={{ resize: 'none' }}
      />
      <div
        className="primary-btn"
        style={{ marginTop: 12, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'default' }}
        onClick={() => canSubmit && onSubmit()}
      >
        {submitLabel}
      </div>
      {submitted && <div style={{ font: '400 11.5px/1.4 Poppins', color: '#1F7A78', marginTop: 8 }}>{t.feedbackThanksShort}</div>}
    </div>
  );
}
