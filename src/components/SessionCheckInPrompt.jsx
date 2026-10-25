import { CheckCircleIcon } from './icons';

// Fires automatically once a session goes live, inviting the attendee
// to digitally check in. Dismissible without checking in — it will
// not reappear for this session once dismissed or checked into.
export default function SessionCheckInPrompt({ t, lang, session, onCheckIn, onDismiss }) {
  const title = lang === 'es' ? session.titleEs : session.title;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 56, background: 'rgba(46,16,53,.55)', display: 'flex', alignItems: 'flex-end' }}
      onClick={onDismiss}
    >
      <div
        style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#FFF7EF', borderRadius: '22px 22px 0 0', padding: '22px 20px 26px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: '#A63D06', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <CheckCircleIcon filled color="#fff" />
          </div>
          <div style={{ font: '700 17px/1.3 Poppins', color: '#2E1035' }}>{t.sessionCheckinPromptTitle}</div>
        </div>
        <div style={{ font: '500 14px/1.5 Poppins', color: '#4A3348', marginTop: 12 }}>
          {title} {t.sessionCheckinPromptBody}
        </div>
        <div className="primary-btn" style={{ marginTop: 18, background: '#A63D06' }} onClick={onCheckIn}>
          {t.sessionCheckinConfirm}
        </div>
        <div className="text-link-btn" style={{ marginTop: 6 }} onClick={onDismiss}>
          {t.sessionCheckinDismiss}
        </div>
      </div>
    </div>
  );
}
