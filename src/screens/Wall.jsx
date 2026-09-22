import CommunityGuidelines from '../components/CommunityGuidelines';
import ReportMenu from '../components/ReportMenu';

const BG_ROTATION = ['#E9F4F3', '#FFF0DC', '#FFE2ED', '#FBF0D3'];

export default function Wall({ t, userId, pledges, draft, setDraft, onPost, onReport, onBlock, onDelete }) {
  return (
    <div className="screen-pad">
      <div className="wall-title">{t.wallTitle}</div>
      <div className="wall-intro">{t.wallIntro}</div>
      <div style={{ margin: '4px 0 10px' }}>
        <CommunityGuidelines t={t} />
      </div>
      <div className="wall-composer">
        <textarea
          className="wall-textarea"
          placeholder={t.wallPlaceholder}
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="wall-post-btn" onClick={onPost}>
          {t.wallPost}
        </div>
      </div>
      <div className="section-label">
        {pledges.length} {pledges.length === 1 ? t.pledgeOne : t.pledgeMany}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pledges.map((p, i) => (
          <div className="pledge-card" style={{ background: BG_ROTATION[i % 4], display: 'flex', justifyContent: 'space-between', gap: 8 }} key={p.id}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="pledge-text">{p.body}</div>
              <div className="pledge-who">{p.user_id === userId ? t.you : t.attendee}</div>
              {p.user_id === userId && onDelete && (
                <div
                  style={{ font: '500 10.5px/1 Poppins', color: '#7A6070', cursor: 'pointer', marginTop: 6 }}
                  onClick={() => {
                    if (window.confirm(t.deleteConfirm)) onDelete(p.id);
                  }}
                >
                  {t.deleteAction}
                </div>
              )}
            </div>
            {p.user_id !== userId && onReport && (
              <ReportMenu
                t={t}
                onReport={(reason, details) => onReport('pledge', p.id, p.user_id, reason, details)}
                onBlock={onBlock ? () => onBlock(p.user_id) : null}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
