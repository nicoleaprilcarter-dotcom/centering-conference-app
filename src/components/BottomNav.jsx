import { AgendaIcon, CommunityIcon, PeopleIcon, ResourcesIcon, ProfileIcon } from './icons';

// The live session room and the Wall/Chat screens no longer get their own
// bottom-tab slot (five icons instead of seven keeps touch targets usable
// on small phones). Live is reached from the Agenda's live banner, and
// Wall/Chat live under a single "Community" tab with its own sub-tabs.
const SCREEN_TO_TAB = { wall: 'community', chat: 'community', photos: 'community', session: 'agenda' };

export default function BottomNav({ screen, onNavigate, t, chatUnread }) {
  const TABS = [
    { key: 'agenda', label: t.tabAgenda, Icon: AgendaIcon },
    { key: 'community', label: t.tabCommunity, Icon: CommunityIcon, dot: chatUnread, navigateTo: 'wall' },
    { key: 'people', label: t.tabPeople, Icon: PeopleIcon },
    { key: 'resources', label: t.tabResources, Icon: ResourcesIcon },
    { key: 'profile', label: t.tabProfile, Icon: ProfileIcon },
  ];
  const activeTab = SCREEN_TO_TAB[screen] || screen;

  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, Icon, dot, navigateTo }) => {
        const active = activeTab === key;
        const iconColor = active ? '#FFFFFF' : 'rgba(255,255,255,0.55)';
        const labelColor = iconColor;
        return (
          <button key={key} className="nav-item" onClick={() => onNavigate(active ? screen : navigateTo || key)}>
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
