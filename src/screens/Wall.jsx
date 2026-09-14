const BG_ROTATION = ['#E9F4F3', '#FFF0DC', '#FFE2ED'];

export default function Wall({ userId, pledges, draft, setDraft, onPost }) {
  return (
    <div className="screen-pad">
      <div className="wall-title">One thing I will do for my health</div>
      <div className="wall-intro">Your pledge joins the wall and is read aloud during the closing circle at 3:45.</div>
      <div className="wall-composer">
        <textarea
          className="wall-textarea"
          placeholder="I will…"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="wall-post-btn" onClick={onPost}>
          Add to the wall
        </div>
      </div>
      <div className="section-label">
        {pledges.length} {pledges.length === 1 ? 'pledge today' : 'pledges today'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pledges.map((p, i) => (
          <div className="pledge-card" style={{ background: BG_ROTATION[i % 3] }} key={p.id}>
            <div className="pledge-text">{p.body}</div>
            <div className="pledge-who">{p.user_id === userId ? 'You' : 'Attendee'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
