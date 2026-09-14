import { useState } from 'react';

export default function SignIn({ t, onSendLink, sending, linkSent, error, onChangeDatabase }) {
  const [email, setEmail] = useState('');
  const bodyLines = t.signInBody.split('\n');

  return (
    <div className="hero">
      <div className="hero-eyebrow">{t.signInEyebrow}</div>
      <div className="hero-title">
        {t.signInTitleLine1}
        <br />
        {t.signInTitleLine2}
        <br />
        {t.signInTitleLine3}
      </div>
      <div className="hero-body">
        {bodyLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < bodyLines.length - 1 && <br />}
          </span>
        ))}
      </div>
      <div className="hero-spacer" />
      {linkSent ? (
        <div className="hero-success">{t.signInLinkSent}</div>
      ) : (
        <>
          <input
            className="field-input"
            type="email"
            placeholder={t.signInEmailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="btn-hero" style={{ marginTop: 12 }} onClick={() => onSendLink(email)}>
            {sending ? t.signInSending : t.signInSend}
          </div>
        </>
      )}
      {error && <div className="hero-error">{error}</div>}
      <div className="hero-link" onClick={onChangeDatabase}>
        {t.signInChangeDb}
      </div>
    </div>
  );
}
