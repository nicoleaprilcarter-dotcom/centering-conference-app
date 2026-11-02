// Professional headshot sign-up: each slot is a fixed 10-minute time.
// Tapping an open slot books it; tapping your own booked slot cancels
// it. An attendee can only hold one slot at a time (enforced by the
// database), so booking a new one automatically gives up the old one.
export default function HeadshotSignup({ t, slots, bookingCounts, mySlotId, onBook, onCancel }) {
  if (slots.length === 0) {
    return (
      <div className="card" style={{ marginBottom: 14, border: 'none', background: '#fff' }}>
        <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035', marginBottom: 4 }}>{t.headshotSignupTitle}</div>
        <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070' }}>{t.headshotSignupEmpty}</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 14, border: 'none', background: '#fff' }}>
      <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035', marginBottom: 2 }}>{t.headshotSignupTitle}</div>
      <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070', marginBottom: 12 }}>{t.headshotSignupIntro}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {slots.map((s) => {
          const taken = bookingCounts[s.id] || 0;
          const full = taken >= s.capacity;
          const mine = mySlotId === s.id;
          const disabled = full && !mine;
          return (
            <div
              key={s.id}
              onClick={() => {
                if (disabled) return;
                if (mine) onCancel();
                else onBook(s.id);
              }}
              role="button"
              aria-pressed={mine}
              aria-disabled={disabled}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                cursor: disabled ? 'default' : 'pointer',
                background: mine ? '#2E1035' : full ? '#F3EFF1' : '#FFF0F6',
                color: mine ? '#fff' : full ? '#A08E9A' : '#B01253',
                font: '600 12.5px/1.3 Poppins',
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              <div>{s.label}</div>
              <div style={{ font: '400 10px/1.3 Poppins', marginTop: 2, opacity: 0.85 }}>
                {mine ? t.headshotSlotYours : full ? t.headshotSlotFull : t.headshotSlotOpen}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
