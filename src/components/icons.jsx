export function StarIcon({ filled, color = '#7E6A76' }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinejoin="round" fill={filled ? color : 'none'} stroke={color}>
      <path d="M12 3.6l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 17l-5.3 2.8 1.1-5.9L3.5 9.8l5.9-.8z" />
    </svg>
  );
}

export function CheckCircleIcon({ filled, color = '#7E6A76' }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} stroke={color}>
      <circle cx="12" cy="12" r="9" fill={filled ? color : 'none'} />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke={filled ? '#fff' : color} />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12l16-8-6 16-3.5-6.5z" />
    </svg>
  );
}

export function WarnIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8E1148" strokeWidth="2" strokeLinecap="round" style={{ flex: 'none', marginTop: 1 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.4v.1" />
    </svg>
  );
}

export function AgendaIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10.5h17" />
    </svg>
  );
}

export function LiveIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2.5L5 13h5l-1 8.5L19 10h-5z" />
    </svg>
  );
}

export function WallIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.4-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.6-7 9-7 9z" />
    </svg>
  );
}

export function PeopleIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3.5 3.5 0 010 6.6M18 20c0-2.3-.9-4.4-2.4-5.9" />
    </svg>
  );
}

export function ChatIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16v11H8l-4 4V5z" />
    </svg>
  );
}

export function FileIcon({ color = '#7E6A76' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 19V5A1.5 1.5 0 017 3.5z" />
      <path d="M14 3.5V8h4" />
    </svg>
  );
}

export function ResourcesIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.1-7-11a7 7 0 0114 0c0 5.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function SparkleIcon({ color = '#D81B60' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
    </svg>
  );
}

export function NoteIcon({ color = '#7E6A76' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h11l3 3v13H5V4z" />
      <path d="M9 10h7M9 14h7M9 18h4" />
    </svg>
  );
}

export function CommunityIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 15.5V6h13v9.5H10l-3 3v-3H2.5z" />
      <path d="M11.5 4h10v9.5h-2.5v3l-3-3h-1" />
    </svg>
  );
}

export function HeartIcon({ filled, color = '#7E6A76' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" fill={filled ? color : 'none'} stroke={color}>
      <path d="M12 20.5s-7.8-4.6-10-9.3C.4 7.6 2.3 4 6 4c2.1 0 3.7 1.1 6 3.6C14.3 5.1 15.9 4 18 4c3.7 0 5.6 3.6 4 7.2-2.2 4.7-10 9.3-10 9.3z" />
    </svg>
  );
}

export function BadgeIcon({ color = '#fff' }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 20v-2.2c0-1 .9-1.8 2-1.8h4c1.1 0 2 .8 2 1.8V20" />
    </svg>
  );
}

export function XIcon({ color = '#7E6A76' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function CameraIcon({ color = '#7E6A76' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8h3l2-3h6l2 3h3v12H4V8z" />
      <circle cx="12" cy="14" r="3.5" />
    </svg>
  );
}

export function ProfileIcon({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}
