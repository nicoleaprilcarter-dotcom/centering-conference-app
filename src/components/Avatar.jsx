import { initials } from '../lib/helpers';

export default function Avatar({ url, name, color, size = 44, fontSize = 15, onClick, rounded = true }) {
  const style = {
    width: size,
    height: size,
    borderRadius: rounded ? 999 : 12,
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : undefined,
    background: color || 'linear-gradient(135deg,#E8660D,#FF2D95)',
  };

  return (
    <div style={style} onClick={onClick}>
      {url ? (
        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ font: `600 ${fontSize}px/1 Poppins`, color: '#fff' }}>{initials(name)}</span>
      )}
    </div>
  );
}
