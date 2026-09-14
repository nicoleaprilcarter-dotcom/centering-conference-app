import Avatar from './Avatar';

export default function Header({ name, avatarUrl, title, subtitle, live, onAvatarClick }) {
  return (
    <div className="app-header">
      <Avatar url={avatarUrl} name={name} size={38} fontSize={14} rounded={false} onClick={onAvatarClick} />
      <div className="header-text">
        <div className="header-title">{title}</div>
        <div className="header-subtitle">{subtitle}</div>
      </div>
      <div className="live-pill">
        <div className="live-dot" style={{ background: live ? '#1F7A78' : '#C0AEBA' }} />
        <div className="live-label">{live ? 'Live' : 'Offline'}</div>
      </div>
    </div>
  );
}
