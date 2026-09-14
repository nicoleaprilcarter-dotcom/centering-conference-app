import { useState } from 'react';

export default function SignIn({ onSendLink, sending, linkSent, error, onChangeDatabase }) {
  const [email, setEmail] = useState('');

  return (
    <div className="hero">
      <div className="hero-eyebrow">Expressions of Health</div>
      <div className="hero-title">
        Centering
        <br />
        Women
        <br />
        of Color
      </div>
      <div className="hero-body">
        Friday, November 6, 2026 · Dayton Hub
        <br />
        Enter your email and we will send you a sign-in link. No password to remember.
      </div>
      <div className="hero-spacer" />
      {linkSent ? (
        <div className="hero-success">Check your email. The link signs you straight in — open it on this phone.</div>
      ) : (
        <>
          <input
            className="field-input"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="btn-hero" style={{ marginTop: 12 }} onClick={() => onSendLink(email)}>
            {sending ? 'Sending…' : 'Email me a link'}
          </div>
        </>
      )}
      {error && <div className="hero-error">{error}</div>}
      <div className="hero-link" onClick={onChangeDatabase}>
        Change database connection
      </div>
    </div>
  );
}
