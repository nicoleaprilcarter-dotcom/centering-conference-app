import { AgendaIcon, LiveIcon, WallIcon, ChatIcon, PeopleIcon, ResourcesIcon } from './icons';

const ROWS = [
  { Icon: AgendaIcon, titleKey: 'tabAgenda', bodyKey: 'onboardingAgenda' },
  { Icon: LiveIcon, titleKey: 'tabSession', bodyKey: 'onboardingLive' },
  { Icon: WallIcon, titleKey: 'tabWall', bodyKey: 'onboardingWall' },
  { Icon: ChatIcon, titleKey: 'tabChat', bodyKey: 'onboardingChat' },
  { Icon: PeopleIcon, titleKey: 'tabPeople', bodyKey: 'onboardingPeople' },
  { Icon: ResourcesIcon, titleKey: 'tabResources', bodyKey: 'onboardingResources' },
];

export default function OnboardingIntro({ t, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(46,16,53,.55)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onClick={onDismiss}
    >
      <div
        style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#FFF7EF', borderRadius: '22px 22px 0 0', padding: '22px 20px 26px', maxHeight: '86vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ font: '700 19px/1.3 Poppins', color: '#2E1035' }}>{t.onboardingTitle}</div>
        <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070', marginTop: 4, marginBottom: 18 }}>{t.onboardingIntro}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ROWS.map(({ Icon, titleKey, bodyKey }) => (
            <div key={titleKey} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#2E1035', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <Icon color="#fff" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: '600 14px/1.3 Poppins', color: '#2E1035' }}>{t[titleKey]}</div>
                <div style={{ font: '400 12.5px/1.5 Poppins', color: '#4A3348', marginTop: 2 }}>{t[bodyKey]}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="primary-btn" style={{ marginTop: 22 }} onClick={onDismiss}>
          {t.onboardingGotIt}
        </div>
      </div>
    </div>
  );
}
