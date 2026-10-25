import { useState } from 'react';
import { SparkleIcon } from './icons';
import SessionEvaluationForm from './SessionEvaluationForm';

const EMPTY = { presentation: 0, presenter: 0, learning: 0, comment: '' };

// Fires automatically once a session ends, inviting the attendee to
// evaluate it on presentation, presenter, and what they learned.
// Dismissible without evaluating — it will not reappear for this
// session once dismissed or evaluated.
export default function SessionEvalPrompt({ t, lang, session, onSubmit, onDismiss }) {
  const [value, setValue] = useState(EMPTY);
  const title = lang === 'es' ? session.titleEs : session.title;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 56, background: 'rgba(46,16,53,.55)', display: 'flex', alignItems: 'flex-end' }}
      onClick={onDismiss}
    >
      <div
        style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#FFF7EF', borderRadius: '22px 22px 0 0', padding: '22px 20px 26px', maxHeight: '86vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: '#B01253', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <SparkleIcon color="#fff" />
          </div>
          <div style={{ font: '700 17px/1.3 Poppins', color: '#2E1035' }}>{t.sessionEvalPromptTitle}</div>
        </div>
        <div style={{ font: '500 14px/1.5 Poppins', color: '#4A3348', marginTop: 10 }}>
          {title} {t.sessionEvalPromptBody}
        </div>

        <SessionEvaluationForm t={t} value={value} onChange={setValue} onSubmit={() => onSubmit(value)} submitLabel={t.evalSubmit} />

        <div className="text-link-btn" style={{ marginTop: 6 }} onClick={onDismiss}>
          {t.evalSkip}
        </div>
      </div>
    </div>
  );
}
