import { useState } from 'react';

export default function CollapsibleSection({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ font: '600 13px/1.3 Poppins', color: '#2E1035', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {label} <span style={{ color: '#B01253' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && <div style={{ marginTop: 10, font: '400 12.5px/1.6 Poppins', color: '#4A3348', whiteSpace: 'pre-line' }}>{children}</div>}
    </div>
  );
}
