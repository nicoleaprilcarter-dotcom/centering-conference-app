import { useState } from 'react';

const REASON_KEYS = ['reportReasonHarassment', 'reportReasonSpam', 'reportReasonSafety', 'reportReasonOther'];

// Small "..." menu offering Report (always) and Block (only when a
// blockable person is passed). Used on chat messages, pledges, and
// profile cards wherever the content belongs to someone else.
export default function ReportMenu({ t, onReport, onBlock, align = 'right' }) {
  const [step, setStep] = useState('closed'); // closed | menu | report | done
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const close = () => {
    setStep('closed');
    setReason('');
    setDetails('');
  };

  const submitReport = () => {
    if (!reason) return;
    onReport(reason, details);
    setStep('done');
    setTimeout(close, 1800);
  };

  const handleBlock = () => {
    if (window.confirm(t.blockConfirm)) onBlock();
    close();
  };

  return (
    <div style={{ position: 'relative', flex: 'none' }}>
      <div
        onClick={() => setStep(step === 'closed' ? 'menu' : 'closed')}
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#A08E9A',
          font: '700 15px/1 Poppins',
        }}
        role="button"
        aria-label={t.reportAction}
      >
        ⋯
      </div>
      {step !== 'closed' && (
        <div
          style={{
            position: 'absolute',
            top: 30,
            [align]: 0,
            zIndex: 10,
            width: step === 'report' ? 240 : 160,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 18px rgba(46,16,53,.18)',
            border: '1px solid rgba(46,16,53,.08)',
            padding: 10,
          }}
        >
          {step === 'menu' && (
            <>
              <div className="text-link-btn" style={{ padding: '6px 4px' }} onClick={() => setStep('report')}>
                {t.reportAction}
              </div>
              {onBlock && (
                <div className="text-link-btn" style={{ padding: '6px 4px', color: '#8E1148' }} onClick={handleBlock}>
                  {t.blockAction}
                </div>
              )}
            </>
          )}
          {step === 'report' && (
            <>
              {REASON_KEYS.map((key) => (
                <div
                  key={key}
                  onClick={() => setReason(key)}
                  style={{
                    padding: '7px 8px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: reason === key ? '#FFE0F0' : 'transparent',
                    font: '500 12px/1.3 Poppins',
                    color: '#2E1035',
                  }}
                >
                  {t[key]}
                </div>
              ))}
              <textarea
                className="field-input dark"
                placeholder={t.reportDetailsPlaceholder}
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                style={{ resize: 'none', marginTop: 6, font: '400 12px/1.4 Poppins', padding: 8 }}
              />
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <div
                  className="primary-btn"
                  style={{ flex: 1, padding: '9px 0', font: '600 12px/1 Poppins', opacity: reason ? 1 : 0.5 }}
                  onClick={submitReport}
                >
                  {t.reportSubmit}
                </div>
                <div className="text-link-btn" style={{ padding: '9px 8px', font: '600 12px/1 Poppins' }} onClick={close}>
                  {t.reportCancel}
                </div>
              </div>
            </>
          )}
          {step === 'done' && <div style={{ font: '500 12px/1.4 Poppins', color: '#2E1035', padding: '4px 2px' }}>{t.reportThanks}</div>}
        </div>
      )}
    </div>
  );
}
