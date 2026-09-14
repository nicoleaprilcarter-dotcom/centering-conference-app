export default function StarRating({ value, onChange, size = 22 }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        return (
          <div key={n} onClick={() => onChange(n)} style={{ cursor: 'pointer' }}>
            <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.6" strokeLinejoin="round" fill={filled ? '#D81B60' : 'none'} stroke={filled ? '#D81B60' : '#C0AEBA'}>
              <path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.8 1.1-5.9L3.5 9.8l5.9-.8z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
