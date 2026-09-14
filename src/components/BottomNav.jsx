import { AgendaIcon, LiveIcon, WallIcon, ChatIcon, PeopleIcon, ProfileIcon } from './icons';

const TABS = [
  { key: 'agenda', label: 'Agenda', Icon: AgendaIcon },
  { key: 'session', label: 'Live', Icon: LiveIcon },
  { key: 'wall', label: 'Wall', Icon: WallIcon },
  { key: 'chat', label: 'Chat', Icon: ChatIcon },
  { key: 'people', label: 'People', Icon: PeopleIcon },
  { key: 'profile', label: 'Me', Icon: ProfileIcon },
];

export default function BottomNav({ screen, onNavigate }) {
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
