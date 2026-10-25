const POINTS = [1, 2, 3, 4, 5];

// A 5-point agreement scale (Strongly disagree -> Strongly agree) for
// one evaluation statement. `labels` is the five short point labels,
// shown under the end points only to avoid crowding on narrow screens.
export default function LikertScale({ statement, value, onChange, labels }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ font: '500 13px/1.4 Poppins', color: '#2E1035' }}>{statement}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {POINTS.map((n) => {
          const selected = value === n;
          return (
            <div
              key={n}
              role="radio"
              aria-checked={selected}
              aria-label={labels[n - 1]}
              title={labels[n - 1]}
              onClick={() => onChange(n)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                borderRadius: 10,
                cursor: 'pointer',
                font: '700 13px/1 Poppins',
                background: selected ? '#D81B60' : '#F3EFF1',
                color: selected ? '#fff' : '#7A6070',
                border: selected ? 'none' : '1px solid rgba(46,16,53,.08)',
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, font: '400 10.5px/1.3 Poppins', color: '#A08E9A' }}>
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  );
}
