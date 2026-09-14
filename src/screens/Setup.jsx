import { useState } from 'react';

export default function Setup({ onConnect }) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!url.trim() || !key.trim()) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    onConnect(url.trim(), key.trim());
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="hero-eyebrow">Expressions of Health</div>
        <div className="hero-title">
          Connect your
          <br />
          database
        </div>
        <div className="hero-body">
          Paste the two values from your Supabase project, under Project Settings then API. They are stored on this
          device only.
        </div>
        <div style={{ marginTop: 20 }}>
          <div className="field-label">Project URL</div>
          <input
            className="field-input"
            type="text"
            placeholder="https://xxxxx.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 14 }}>
          <div className="field-label">Anon public key</div>
          <input
            className="field-input"
            type="text"
            placeholder="eyJhbGciOi..."
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div className="btn-hero" onClick={submit}>
          Connect
        </div>
        {error && <div className="hero-error">{error}</div>}
        <div className="hero-note">The anon key is safe in a browser. Never paste the service role key here.</div>
        <div className="hero-spacer" />
        <div className="hero-note">
          Run supabase-schema.sql in the SQL Editor first, or the app will connect but find no tables.
        </div>
      </div>
    </div>
  );
}
