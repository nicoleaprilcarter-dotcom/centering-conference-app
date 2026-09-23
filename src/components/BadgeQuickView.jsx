import QrCode from './QrCode';
import { badgeCode } from '../lib/badge';

// A fast path to the check-in QR badge, reachable from a floating button
// on the Agenda without navigating away to the Resource Hub — meant to
// cut the morning-of "hunting for the badge" bottleneck at registration.
export default function BadgeQuickView({ t, userId, checkedInAt, onCheckIn, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(46,16,53,.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, background: '#FFF7EF', borderRadius: '24px 24px 0 0', padding: '22px 22px 34px', textAlign: 'center' }}
      >
        <div style={{ font: '700 15px/1.2 Poppins', color: '#2E1035', marginBottom: 14 }}>{t.badgeQuickTitle}</div>
        {checkedInAt ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <QrCode value={badgeCode(userId)} size={150} />
            </div>
            <div style={{ font: '600 13px/1 Poppins', letterSpacing: '0.08em', color: '#8A6A12' }}>{badgeCode(userId)}</div>
          </>
        ) : (
          <>
            <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070', marginBottom: 14 }}>{t.badgeQuickNotCheckedInNote}</div>
            <div className="primary-btn" onClick={onCheckIn}>
              {t.badgeQuickCheckInNow}
            </div>
          </>
        )}
        <div className="text-link-btn" style={{ marginTop: 16, display: 'inline-block' }} onClick={onClose}>
          {t.badgeQuickClose}
        </div>
      </div>
    </div>
  );
}
