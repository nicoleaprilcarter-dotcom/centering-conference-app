import { useState } from 'react';

export default function CommunityGuidelines({ t }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ font: '600 11px/1.4 Poppins', color: '#B01253', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        {t.guidelinesLink} {open ? '▲' : '▼'}
      </div>
      {open && (
        <div style={{ marginTop: 8, marginBottom: 4, padding: 12, borderRadius: 12, background: '#F3EFF1', font: '400 12px/1.55 Poppins', color: '#4A3348' }}>
          {t.guidelinesBody}
        </div>
      )}
    </div>
  );
}
