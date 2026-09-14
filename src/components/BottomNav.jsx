import { AgendaIcon, LiveIcon, WallIcon, ChatIcon, PeopleIcon, ProfileIcon } from './icons';

export default function BottomNav({ screen, onNavigate, t }) {
  const TABS = [
    { key: 'agenda', label: t.tabAgenda, Icon: AgendaIcon },
    { key: 'session', label: t.tabSession, Icon: LiveIcon },
    { key: 'wall', label: t.tabWall, Icon: WallIcon },
    { key: 'chat', label: t.tabChat, Icon: ChatIcon },
    { key: 'people', label: t.tabPeople, Icon: PeopleIcon },
    { key: 'profile', label: t.tabProfile, Icon: ProfileIcon },
  ];

  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, Icon }) => {
        const active = screen === key;
        const color = active ? '#D81B60' : '#A08E9A';
        return (
          <button key={key} className="nav-item" onClick={() => onNavigate(key)}>
            <Icon color={color} />
            <div className="nav-label" style={{ color }}>
              {label}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
