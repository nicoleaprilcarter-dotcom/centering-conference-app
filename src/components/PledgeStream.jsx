import { useEffect, useState } from 'react';

const ADVANCE_MS = 6000;

// A fullscreen, auto-rotating display of pledges meant to be projected on
// the main stage screen during the closing circle. Deliberately ignores
// the app's normal 480px phone-shell width so it fills a projector.
export default function PledgeStream({ t, pledges, onExit }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || pledges.length <= 1) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % pledges.length), ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, pledges.length]);

  const go = (delta) => {
    if (pledges.length === 0) return;
    setIndex((i) => (i + delta + pledges.length) % pledges.length);
  };

  // Clamp during render (rather than in an effect) in case a pledge is
  // deleted mid-presentation and the stored index runs past the end.
  const safeIndex = pledges.length === 0 ? 0 : index % pledges.length;
  const current = pledges[safeIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'linear-gradient(160deg, #2E1035 0%, #6B1029 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6vh 8vw',
        textAlign: 'center',
      }}
      onClick={() => setPaused((p) => !p)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer', color: 'rgba(255,255,255,.7)', font: '600 13px/1 Poppins' }}
      >
        <span onClick={onExit}>{t.presenterModeExit}</span>
      </div>

      {!current ? (
        <div style={{ color: 'rgba(255,255,255,.7)', font: '500 22px/1.4 Poppins' }}>{t.presenterModeEmpty}</div>
      ) : (
        <div
          className="font-script"
          style={{ color: '#fff', fontSize: 'min(7vw, 56px)', lineHeight: 1.4, maxWidth: '80vw' }}
        >
          &ldquo;{current.body}&rdquo;
        </div>
      )}

      {pledges.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: '5vh' }} onClick={(e) => e.stopPropagation()}>
          <div onClick={() => go(-1)} style={{ cursor: 'pointer', color: 'rgba(255,255,255,.75)', fontSize: 22 }}>
            &#8592;
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {pledges.map((p, i) => (
              <span
                key={p.id}
                style={{ width: 7, height: 7, borderRadius: 999, background: i === safeIndex ? '#FF2D95' : 'rgba(255,255,255,.3)', display: 'inline-block' }}
              />
            ))}
          </div>
          <div onClick={() => go(1)} style={{ cursor: 'pointer', color: 'rgba(255,255,255,.75)', fontSize: 22 }}>
            &#8594;
          </div>
        </div>
      )}
    </div>
  );
}
