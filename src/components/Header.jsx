import Avatar from './Avatar';

export default function Header({ name, avatarUrl, live, liveLabel, offlineLabel, langToggle, onToggleLang, onAvatarClick }) {
  return (
    <div className="app-header">
      <img className="header-banner-img" src="/images/header-banner.jpg" alt="Centering Women of Color — Friday, November 6, 2026 — Expressions of Health" />
      <div className="header-overlay">
        <Avatar url={avatarUrl} name={name} size={38} fontSize={14} rounded={false} onClick={onAvatarClick} />
        <div style={{ flex: 1 }} />
        <div className="lang-pill" onClick={onToggleLang}>
          {langToggle}
        </div>
        <div className="live-pill">
          <div className="live-dot" style={{ background: live ? '#1F7A78' : '#C0AEBA' }} />
          <div className="live-label">{live ? liveLabel : offlineLabel}</div>
        </div>
      </div>
    </div>
  );
}
