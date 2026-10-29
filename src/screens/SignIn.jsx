import { useState } from 'react';
import Flourish from '../components/Flourish';

function emailFromUrl() {
  try {
    return new URLSearchParams(window.location.search).get('email') || '';
  } catch {
    return '';
  }
}

export default function SignIn({ t, onSendLink, sending, linkSent, onVerifyCode, verifyingCode, error, onChangeDatabase }) {
  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState('');
  const bodyLines = t.signInBody.split('\n');

  return (
    <div className="hero">
      <Flourish color="#FBEAB0" size={170} bottom={40} left={-70} opacity={0.16} rotate={25} />

      <div className="hero-content">
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
          <>
            <div className="hero-success">{t.signInLinkSent}</div>
            <div className="hero-body" style={{ marginTop: 14 }}>
              {t.signInCodeIntro}
            </div>
            <input
              className="field-input"
              type="text"
              inputMode="numeric"
              placeholder={t.signInCodePlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ marginTop: 8 }}
            />
            <div className="btn-hero" style={{ marginTop: 12 }} onClick={() => onVerifyCode(code)}>
              {verifyingCode ? t.signInCodeVerifying : t.signInCodeVerify}
            </div>
          </>
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
    </div>
  );
}
