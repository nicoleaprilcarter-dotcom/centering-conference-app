import Avatar from './Avatar';

export default function Header({ name, hideAvatar, live, liveLabel, offlineLabel, langToggle, onToggleLang, onAvatarClick, showBack, onBack, compact }) {
  return (
    <div className={`app-header${compact ? ' app-header--compact' : ''}`}>
      {!compact && (
        <img className="header-banner-img" src="/images/header-banner.jpg" alt="Centering Women of Color — Friday, November 6, 2026 — Expressions of Health" />
      )}
      <div className="header-overlay">
        {showBack && (
          <div
            onClick={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flex: 'none',
              marginRight: 8,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2E1035" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </div>
        )}
        {!hideAvatar && <Avatar name={name} size={38} fontSize={14} rounded={false} onClick={onAvatarClick} />}
        <div style={{ flex: 1 }} />
        <div className="lang-pill" onClick={onToggleLang}>
          {langToggle}
        </div>
        <div className="live-pill">
          <div className="live-dot" style={{ background: live ? '#FF2D95' : '#C0AEBA' }} />
          <div className="live-label">{live ? liveLabel : offlineLabel}</div>
        </div>
      </div>
    </div>
  );
}
