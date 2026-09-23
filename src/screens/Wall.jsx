import CommunityGuidelines from '../components/CommunityGuidelines';
import ReportMenu from '../components/ReportMenu';
import { HeartIcon } from '../components/icons';

const BG_ROTATION = ['#E9F4F3', '#FFF0DC', '#FFE2ED', '#FBF0D3'];

export default function Wall({
  t,
  userId,
  pledges,
  draft,
  setDraft,
  onPost,
  onReport,
  onBlock,
  onDelete,
  supportCounts = {},
  mySupportedIds,
  onToggleSupport,
  isModerator,
  onOpenPresenter,
}) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="section-label" style={{ margin: 0 }}>
          {pledges.length} {pledges.length === 1 ? t.pledgeOne : t.pledgeMany}
        </div>
        {isModerator && onOpenPresenter && (
          <div className="text-link-btn" style={{ padding: 0, font: '600 11px/1 Poppins' }} onClick={onOpenPresenter}>
            {t.presenterModeLink}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pledges.map((p, i) => {
          const supported = !!(mySupportedIds && mySupportedIds.has(p.id));
          const count = supportCounts[p.id] || 0;
          return (
            <div className="pledge-card" style={{ background: BG_ROTATION[i % 4], display: 'flex', justifyContent: 'space-between', gap: 8 }} key={p.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pledge-text">{p.body}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <div className="pledge-who">{p.user_id === userId ? t.you : t.attendee}</div>
                  {onToggleSupport && (
                    <div
                      onClick={() => onToggleSupport(p.id)}
                      role="button"
                      aria-label={t.pledgeSupportLabel}
                      aria-pressed={supported}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                    >
                      <HeartIcon filled={supported} color={supported ? '#D81B60' : '#7A6070'} />
                      {count > 0 && <span style={{ font: '600 11px/1 Poppins', color: supported ? '#D81B60' : '#7A6070' }}>{count}</span>}
                    </div>
                  )}
                </div>
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
          );
        })}
      </div>
    </div>
  );
}
