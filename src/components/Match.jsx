import { useState } from 'react';
import { colorForId } from '../lib/helpers';
import { translateTagLabel } from '../data/translations';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';
import { HeartIcon, XIcon } from './icons';

// A one-at-a-time "discover" deck rather than a directory list — tap
// Connect to signal interest, Pass to move on. A match only unlocks
// once both people have tapped Connect on each other; no one ever
// sees who passed on them.
export default function Match({ t, lang, myInterests = [], candidates, matches, onLike, onOpenThread }) {
  const [index, setIndex] = useState(0);
  const [justMatchedId, setJustMatchedId] = useState(null);

  const current = candidates[index];
  const advance = () => setIndex((i) => i + 1);

  const handlePass = () => advance();

  const handleLike = () => {
    if (!current) return;
    const becameMatch = onLike(current.id);
    if (becameMatch) {
      setJustMatchedId(current.id);
    } else {
      advance();
    }
  };

  const dismissMatch = () => {
    setJustMatchedId(null);
    advance();
  };

  const sharedInterests = current ? (current.interests || []).filter((i) => myInterests.includes(i)) : [];

  return (
    <div>
      <div style={{ font: '400 12.5px/1.6 Poppins', color: '#4A3348', marginBottom: 14 }}>{t.discoverIntro}</div>

      {justMatchedId ? (
        <div className="card" style={{ border: 'none', background: '#FFE0F0', textAlign: 'center', padding: 24 }}>
          <HeartIcon filled color="#D81B60" />
          <div style={{ font: '700 15px/1.4 Poppins', color: '#B01253', marginTop: 8 }}>{t.discoverMatchBanner}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
            <div className="primary-btn" style={{ flex: 'none', padding: '11px 18px' }} onClick={() => onOpenThread(justMatchedId)}>
              {t.discoverMessage}
            </div>
            <div className="text-link-btn" style={{ padding: '11px 4px' }} onClick={dismissMatch}>
              {t.discoverKeepBrowsing}
            </div>
          </div>
        </div>
      ) : current ? (
        <div className="card" style={{ position: 'relative', overflow: 'hidden', border: 'none', background: '#fff', padding: 20, textAlign: 'center' }}>
          <Flourish color="#FFDCEF" size={150} top={-40} right={-40} opacity={0.5} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Avatar url={current.avatar_url} name={current.display_name} color={colorForId(current.id)} size={96} fontSize={30} />
            <div style={{ font: '700 18px/1.3 Poppins', color: '#2E1035', marginTop: 12 }}>
              {current.display_name}
              {current.pronouns ? ` · ${current.pronouns}` : ''}
            </div>
            {current.bio && <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348', marginTop: 8 }}>{current.bio}</div>}
            {current.icebreaker && (
              <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: '#F3EFF1', font: '500 12.5px/1.5 Poppins', color: '#2E1035', fontStyle: 'italic' }}>
                “{current.icebreaker}”
              </div>
            )}
            {sharedInterests.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ font: '700 10px/1 Poppins', color: '#7A5205', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>
                  {t.discoverSharedInterests}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {sharedInterests.map((tag) => (
                    <span className="person-tag" key={tag}>
                      {translateTagLabel(tag, lang)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 20 }}>
              <div
                onClick={handlePass}
                role="button"
                aria-label={t.discoverPass}
                style={{ width: 54, height: 54, borderRadius: 999, background: '#F3EFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <XIcon color="#7E6A76" />
              </div>
              <div
                onClick={handleLike}
                role="button"
                aria-label={t.discoverLike}
                style={{ width: 54, height: 54, borderRadius: 999, background: '#FF2D95', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <HeartIcon filled color="#fff" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <Flourish color="#FFDCEF" size={160} top={-40} right={-40} opacity={0.5} />
          <Flourish color="#FBEAB0" size={130} bottom={-30} left={-30} opacity={0.5} rotate={30} />
          <div className="empty-note">{t.discoverEmpty}</div>
        </div>
      )}

      <div className="field-title" style={{ margin: '26px 0 10px' }}>
        {t.discoverMyMatches}
      </div>
      {matches.length === 0 ? (
        <div style={{ font: '400 13px/1.6 Poppins', color: '#7A6070' }}>{t.discoverMatchesEmpty}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {matches.map((p) => (
            <div className="person-card" key={p.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar url={p.avatar_url} name={p.display_name} color={colorForId(p.id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="person-name">{p.display_name}</div>
                  <div className="person-bio">{p.bio || t.attendee}</div>
                </div>
                <div
                  style={{ flex: 'none', padding: '9px 14px', borderRadius: 999, font: '600 12px/1 Poppins', cursor: 'pointer', background: '#FFF0F6', color: '#B01253' }}
                  onClick={() => onOpenThread(p.id)}
                >
                  {t.discoverMessage}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
