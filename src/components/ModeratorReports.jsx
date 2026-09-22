const STATUS_COLOR = {
  open: { bg: '#FFE2ED', fg: '#8E1148' },
  reviewed: { bg: '#E9F4F3', fg: '#1F7A78' },
  dismissed: { bg: '#F3EFF1', fg: '#7A6070' },
};

export default function ModeratorReports({ t, reports, people, onResolve }) {
  const nameFor = (id) => {
    const p = people.find((x) => x.id === id);
    return (p && p.display_name) || id.slice(0, 8);
  };

  const targetLabel = {
    message: t.reportTargetMessage,
    profile: t.reportTargetProfile,
    pledge: t.reportTargetPledge,
  };

  return (
    <div className="card" style={{ marginBottom: 14, border: 'none', background: '#fff' }}>
      <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035', marginBottom: 10 }}>{t.moderatorReportsTitle}</div>

      {reports.length === 0 && <div style={{ font: '400 12.5px/1.5 Poppins', color: '#7A6070' }}>{t.reportsEmpty}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reports.map((r) => {
          const status = STATUS_COLOR[r.status] || STATUS_COLOR.open;
          return (
            <div key={r.id} style={{ padding: 10, borderRadius: 12, background: '#F9F5F2', border: '1px solid rgba(46,16,53,.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 999,
                    font: '700 10px/1.4 Poppins',
                    textTransform: 'uppercase',
                    letterSpacing: '.03em',
                    background: status.bg,
                    color: status.fg,
                  }}
                >
                  {t[`reportStatus${r.status.charAt(0).toUpperCase()}${r.status.slice(1)}`]}
                </span>
                <span style={{ font: '600 11px/1 Poppins', color: '#4A3348' }}>{targetLabel[r.target_type] || r.target_type}</span>
              </div>
              <div style={{ font: '600 12.5px/1.4 Poppins', color: '#2E1035', marginTop: 6 }}>{r.reason ? t[r.reason] || r.reason : ''}</div>
              {r.details && <div style={{ font: '400 12px/1.5 Poppins', color: '#4A3348', marginTop: 3 }}>{r.details}</div>}
              <div style={{ font: '400 11px/1.4 Poppins', color: '#A08E9A', marginTop: 6 }}>
                {nameFor(r.reporter_id)} · {new Date(r.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </div>
              {r.status === 'open' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <div style={{ font: '600 11px/1 Poppins', color: '#1F7A78', cursor: 'pointer' }} onClick={() => onResolve(r.id, 'reviewed')}>
                    {t.markReviewed}
                  </div>
                  <div style={{ font: '600 11px/1 Poppins', color: '#A08E9A', cursor: 'pointer' }} onClick={() => onResolve(r.id, 'dismissed')}>
                    {t.dismissReport}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
