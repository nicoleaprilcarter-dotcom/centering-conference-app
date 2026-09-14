const BG_ROTATION = ['#E9F4F3', '#FFF0DC', '#FFE2ED'];

export default function Wall({ t, userId, pledges, draft, setDraft, onPost }) {
  return (
    <div className="screen-pad">
      <div className="wall-title">{t.wallTitle}</div>
      <div className="wall-intro">{t.wallIntro}</div>
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
          <div className="pledge-card" style={{ background: BG_ROTATION[i % 3] }} key={p.id}>
            <div className="pledge-text">{p.body}</div>
            <div className="pledge-who">{p.user_id === userId ? t.you : t.attendee}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
