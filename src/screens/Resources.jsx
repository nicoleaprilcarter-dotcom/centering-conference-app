import { badgeCode } from '../lib/badge';
import QrCode from '../components/QrCode';
import AdminMaterials from '../components/AdminMaterials';
import ModeratorReports from '../components/ModeratorReports';
import CollapsibleSection from '../components/CollapsibleSection';

const VENUE_ADDRESS_ENCODED = encodeURIComponent('Dayton Hub, 31 S Main St, Dayton, OH 45402');
const HELP_DESK_PHONE = '937-540-4313';

export default function Resources({
  t,
  lang,
  checkedInAt,
  onCheckIn,
  onUndoCheckIn,
  userId,
  isModerator,
  sessionFiles,
  onUploadFile,
  onDeleteFile,
  reports,
  people,
  onResolveReport,
}) {
  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="card"
        style={{
          marginBottom: 14,
          background: checkedInAt ? '#FBF0D3' : '#FFF0F6',
          border: 'none',
          cursor: checkedInAt ? 'default' : 'pointer',
        }}
        onClick={checkedInAt ? undefined : onCheckIn}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ font: '600 13.5px/1.3 Poppins', color: checkedInAt ? '#8A6A12' : '#B01253' }}>
              {checkedInAt ? t.checkedInAt : t.checkInPromptTitle}
            </div>
            <div style={{ font: '400 11.5px/1.4 Poppins', color: '#7A6070', marginTop: 3 }}>
              {checkedInAt
                ? new Date(checkedInAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                : t.checkInPromptBody}
            </div>
          </div>
          {!checkedInAt && (
            <div style={{ flex: 'none', padding: '9px 14px', borderRadius: 999, background: '#B01253', color: '#fff', font: '600 12px/1 Poppins' }}>
              {t.checkInButton}
            </div>
          )}
        </div>

        {checkedInAt && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <QrCode value={badgeCode(userId)} size={128} />
            </div>
            <div style={{ font: '600 12.5px/1 Poppins', letterSpacing: '0.08em', color: '#8A6A12' }}>{badgeCode(userId)}</div>
            <div style={{ font: '400 11.5px/1.5 Poppins', color: '#7A6070', marginTop: 8 }}>{t.badgeShow}</div>
            <div
              style={{ font: '400 11px/1 Poppins', color: '#7E6A76', marginTop: 16 }}
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(t.undoCheckInConfirm)) onUndoCheckIn();
              }}
            >
              {t.undoCheckIn}
            </div>
          </div>
        )}
      </div>

      <div
        className="card"
        style={{ marginBottom: 14, border: 'none', background: '#2E1035', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}
      >
        <div style={{ font: '600 12.5px/1.3 Poppins', color: '#fff' }}>{t.venueHelpPrompt}</div>
        <a
          href={`tel:${HELP_DESK_PHONE}`}
          style={{ flex: 'none', padding: '9px 14px', borderRadius: 999, background: '#FF2D95', color: '#fff', font: '600 12px/1 Poppins', textDecoration: 'none' }}
        >
          {t.venueHelpButton}
        </a>
      </div>

      <div className="card" style={{ marginBottom: 14, border: 'none', background: '#fff' }}>
        <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035', marginBottom: 2 }}>{t.venueTitle}</div>
        <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070' }}>
          {t.venueName} · {t.venueAddress}
        </div>
        <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070', marginBottom: 10 }}>{t.venueCheckinHours}</div>
        <div style={{ borderRadius: 14, overflow: 'hidden' }}>
          <iframe
            title="Venue map"
            src={`https://www.google.com/maps?q=${VENUE_ADDRESS_ENCODED}&output=embed`}
            width="100%"
            height="160"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_ADDRESS_ENCODED}`}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', textAlign: 'center', font: '600 12px/1 Poppins', color: '#B01253', margin: '12px 0 16px', textDecoration: 'none' }}
        >
          {t.venueDirections}
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CollapsibleSection label={t.venueGettingHereLink}>{t.venueGettingHereBody}</CollapsibleSection>
          <CollapsibleSection label={t.venueAccessibilityLink}>{t.venueAccessibilityBody}</CollapsibleSection>
        </div>
      </div>

      {isModerator && (
        <>
          <AdminMaterials t={t} lang={lang} sessionFiles={sessionFiles} onUploadFile={onUploadFile} onDeleteFile={onDeleteFile} />
          <ModeratorReports t={t} reports={reports} people={people} onResolve={onResolveReport} />
        </>
      )}
    </div>
  );
}
