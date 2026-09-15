import { AgendaIcon, LiveIcon, WallIcon, ChatIcon, PeopleIcon, ProfileIcon } from './icons';

export default function BottomNav({ screen, onNavigate, t, chatUnread }) {
  const TABS = [
    { key: 'agenda', label: t.tabAgenda, Icon: AgendaIcon },
    { key: 'session', label: t.tabSession, Icon: LiveIcon },
    { key: 'wall', label: t.tabWall, Icon: WallIcon },
    { key: 'chat', label: t.tabChat, Icon: ChatIcon, dot: chatUnread },
    { key: 'people', label: t.tabPeople, Icon: PeopleIcon },
    { key: 'profile', label: t.tabProfile, Icon: ProfileIcon },
  ];

  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, Icon, dot }) => {
        const active = screen === key;
        const iconColor = active ? '#000000' : 'rgba(0,0,0,0.55)';
        const labelColor = active ? '#D9A426' : 'rgba(217,164,38,0.6)';
        return (
          <button key={key} className="nav-item" onClick={() => onNavigate(key)}>
            <div style={{ position: 'relative' }}>
              <Icon color={iconColor} />
              {dot && <span className="nav-dot" />}
            </div>
            <div className="nav-label" style={{ color: labelColor }}>
              {label}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
