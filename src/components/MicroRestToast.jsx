export default function MicroRestToast({ message, dismissLabel, onDismiss }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 84,
        zIndex: 55,
        width: 'calc(100% - 36px)',
        maxWidth: 440,
        background: '#2E1035',
        borderRadius: 16,
        padding: '13px 16px',
        boxShadow: '0 8px 24px rgba(46,16,53,.35)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, font: '500 12.5px/1.5 Poppins', color: '#fff' }}>{message}</div>
      <div
        onClick={onDismiss}
        style={{ flex: 'none', font: '700 11.5px/1 Poppins', color: '#FBD9BC', cursor: 'pointer', padding: '6px 4px' }}
      >
        {dismissLabel}
      </div>
    </div>
  );
}
