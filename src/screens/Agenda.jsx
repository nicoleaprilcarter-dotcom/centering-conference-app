import { useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { tagColors, colorForId } from '../lib/helpers';
import { StarIcon, CheckCircleIcon, FileIcon, NoteIcon, SparkleIcon } from '../components/icons';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';

// Session times are written like "8:30" or "1:35" with no AM/PM — the
// conference runs 8:30a-3:40p, so hours 1-7 are always PM and 8-11 AM.
function timeToMinutes(tStr) {
  const [hStr, mStr] = tStr.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (h < 8 && h !== 12) h += 12;
  return h * 60 + m;
}

function Dashboard({ t, lang, name, saved, sessionCheckins, sessionNotes, checkedInAt, aiRecommendation, aiRecLoading, aiRecError, onFetchRecommendation }) {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const upNext = SESSIONS.find((s) => timeToMinutes(s.t) >= nowMin);
  const savedCount = Object.values(saved).filter(Boolean).length;
  const notesCount = Object.values(sessionNotes).filter((n) => n && n.trim()).length;
  const checkinCount = Object.keys(sessionCheckins).length;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, background: '#2E1035', padding: 18, marginBottom: 16 }}>
      <Flourish color="#FFDCEF" size={140} top={-40} right={-40} opacity={0.18} rotate={15} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ font: '700 18px/1.3 Poppins', color: '#fff' }}>{t.dashboardGreeting}{name ? `, ${name.split(' ')[0]}` : ''}</div>
        {upNext ? (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 14, background: 'rgba(255,255,255,.08)' }}>
            <div style={{ font: '600 10.5px/1 Poppins', color: '#FBD9BC', textTransform: 'uppercase', letterSpacing: '.04em' }}>{t.dashboardUpNext}</div>
            <div style={{ font: '600 14px/1.4 Poppins', color: '#fff', marginTop: 4 }}>
              {upNext.t} · {lang === 'es' ? upNext.titleEs : upNext.title}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10, font: '400 12.5px/1.5 Poppins', color: '#E3D3DF' }}>{t.dashboardDone}</div>
        )}
        <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
          <div style={{ font: '400 11.5px/1.4 Poppins', color: '#E3D3DF' }}>
            {checkedInAt ? t.dashboardCheckedIn : t.dashboardNotCheckedIn}
          </div>
          <div style={{ font: '400 11.5px/1.4 Poppins', color: '#E3D3DF' }}>{savedCount} {t.dashboardSaved}</div>
          <div style={{ font: '400 11.5px/1.4 Poppins', color: '#E3D3DF' }}>{checkinCount} {t.dashboardSessionsAttended}</div>
          <div style={{ font: '400 11.5px/1.4 Poppins', color: '#E3D3DF' }}>{notesCount} {t.dashboardNotes}</div>
        </div>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.14)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 11px/1 Poppins', color: '#FFDCEF', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            <SparkleIcon color="#FFDCEF" /> {t.dashboardRecTitle}
          </div>
          {aiRecommendation ? (
            <div style={{ marginTop: 8 }}>
              <div style={{ font: '400 12.5px/1.55 Poppins', color: '#fff' }}>{aiRecommendation.summary}</div>
              {(aiRecommendation.picks || []).map((p, i) => {
                const s = SESSIONS.find((x) => x.id === p.sessionId);
                return (
                  <div key={i} style={{ marginTop: 8, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,.08)' }}>
                    <div style={{ font: '600 12px/1.3 Poppins', color: '#FBD9BC' }}>{s ? (lang === 'es' ? s.titleEs : s.title) : p.sessionId}</div>
                    <div style={{ font: '400 12px/1.4 Poppins', color: '#E3D3DF', marginTop: 2 }}>{p.why}</div>
                  </div>
                );
              })}
              <div className="text-link-btn" style={{ margin: '8px 0 0', padding: 0, color: '#FFDCEF' }} onClick={onFetchRecommendation}>
                {aiRecLoading ? t.dashboardRecLoading : t.dashboardRecRefresh}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <div style={{ font: '400 12px/1.5 Poppins', color: '#E3D3DF' }}>{t.dashboardRecIntro}</div>
              <div className="primary-btn" style={{ marginTop: 8, background: '#FF2D95' }} onClick={onFetchRecommendation}>
                {aiRecLoading ? t.dashboardRecLoading : t.dashboardRecButton}
              </div>
              {aiRecError && <div style={{ font: '400 11.5px/1.4 Poppins', color: '#FBD9BC', marginTop: 6 }}>{aiRecError}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Agenda({
  t,
  lang,
  name,
  saved,
  onOpenSession,
  onToggleStar,
  sessionCheckins,
  onToggleSessionCheckIn,
  sessionHosts,
  sessionFiles,
  onOpenPerson,
  sessionNotes = {},
  onSaveNote,
  sessionRecaps = {},
  checkedInAt,
  aiRecommendation,
  aiRecLoading,
  aiRecError,
  onFetchRecommendation,
}) {
  const [view, setView] = useState('all');
  const [openNotesFor, setOpenNotesFor] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const visibleSessions = view === 'mine' ? SESSIONS.filter((s) => saved[s.id]) : SESSIONS;

  const openNotes = (sessionId) => {
    if (openNotesFor === sessionId) {
      setOpenNotesFor(null);
      return;
    }
    setOpenNotesFor(sessionId);
    setNoteDraft(sessionNotes[sessionId] || '');
  };

  return (
    <div className="screen-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <Dashboard
        t={t}
        lang={lang}
        name={name}
        saved={saved}
        sessionCheckins={sessionCheckins}
        sessionNotes={sessionNotes}
        checkedInAt={checkedInAt}
        aiRecommendation={aiRecommendation}
        aiRecLoading={aiRecLoading}
        aiRecError={aiRecError}
        onFetchRecommendation={onFetchRecommendation}
      />
      <div style={{ display: 'flex', background: '#F0E7EC', borderRadius: 999, padding: 4, marginBottom: 14 }}>
        <div
          onClick={() => setView('all')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '9px 0',
            borderRadius: 999,
            font: '600 13px/1 Poppins',
            cursor: 'pointer',
            background: view === 'all' ? '#2E1035' : 'transparent',
            color: view === 'all' ? '#fff' : '#7A6070',
          }}
        >
          {t.allSessions}
        </div>
        <div
          onClick={() => setView('mine')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '9px 0',
            borderRadius: 999,
            font: '600 13px/1 Poppins',
            cursor: 'pointer',
            background: view === 'mine' ? '#2E1035' : 'transparent',
            color: view === 'mine' ? '#fff' : '#7A6070',
          }}
        >
          {t.mySchedule}
        </div>
      </div>

      {view === 'mine' && visibleSessions.length === 0 && (
        <div className="empty-state">
          <Flourish color="#FFDCEF" size={160} top={-40} right={-40} opacity={0.5} />
          <Flourish color="#FBEAB0" size={130} bottom={-30} left={-30} opacity={0.5} rotate={30} />
          <div className="empty-note">{t.myScheduleEmpty}</div>
        </div>
      )}

      {visibleSessions.map((s) => {
        const [tagBg, tagFg] = tagColors(s.kind);
        const isSaved = !!saved[s.id];
        const isCheckedIn = !!sessionCheckins[s.id];
        const title = lang === 'es' ? s.titleEs : s.title;
        const tag = t[s.tagKey];
        const hosts = (sessionHosts && sessionHosts[s.id]) || [];
        const files = (sessionFiles && sessionFiles[s.id]) || [];
        return (
          <div className="session-row" key={s.id}>
            <div className="session-time">
              <div className="session-time-t">{s.t}</div>
              <div className="session-time-d">{s.d}</div>
            </div>
            <div className="session-card">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="tag-pill" style={{ background: tagBg, color: tagFg }}>
                  {tag}
                </span>
                <div className="session-title" onClick={() => onOpenSession(s.id)}>
                  {title}
                </div>
                <div className="session-sub">{s.room}</div>
                {sessionRecaps[s.id] && (
                  <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 10, background: '#F3EFF1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: '700 10px/1 Poppins', color: '#B01253', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      <SparkleIcon /> {t.sessionRecapTitle}
                    </div>
                    <div style={{ font: '400 12px/1.45 Poppins', color: '#2E1035', marginTop: 4 }}>
                      {lang === 'es' ? sessionRecaps[s.id].summary_es || sessionRecaps[s.id].summary_en : sessionRecaps[s.id].summary_en}
                    </div>
                  </div>
                )}
                {hosts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 9 }}>
                    {hosts.map((h) => {
                      const role = lang === 'es' ? h.roleEs || h.roleEn : h.roleEn;
                      return (
                        <div
                          key={h.userId || h.name}
                          onClick={() =>
                            onOpenPerson({
                              userId: h.userId,
                              name: h.name,
                              avatarUrl: h.avatarUrl,
                              pronouns: h.pronouns,
                              bio: h.bio,
                              interests: h.interests,
                              designation: h.designation,
                              role,
                            })
                          }
                          style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}
                        >
                          <Avatar url={h.avatarUrl} name={h.name} color={colorForId(h.userId || h.name)} size={24} fontSize={10} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ font: '600 12px/1.2 Poppins', color: '#2E1035' }}>{h.name}</div>
                            {role && <div style={{ font: '400 10.5px/1.2 Poppins', color: '#A08E9A' }}>{role}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 9 }}>
                    {files.map((f) => (
                      <a
                        key={f.id}
                        href={f.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                      >
                        {f.thumbnailUrl ? (
                          <img
                            src={f.thumbnailUrl}
                            alt=""
                            style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flex: 'none', border: '1px solid rgba(46,16,53,.1)' }}
                          />
                        ) : (
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F3EFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                            <FileIcon />
                          </div>
                        )}
                        <div style={{ font: '600 12px/1.3 Poppins', color: '#B01253', minWidth: 0 }}>{f.title}</div>
                      </a>
                    ))}
                  </div>
                )}
                {openNotesFor === s.id && (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      className="field-input dark"
                      placeholder={t.notePlaceholder}
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      onBlur={() => onSaveNote(s.id, noteDraft)}
                      style={{ resize: 'none', font: '400 12.5px/1.5 Poppins' }}
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  className="star-btn"
                  style={{ background: isSaved ? '#FFE2ED' : '#F3EFF1' }}
                  onClick={() => onToggleStar(s.id)}
                  title={t.saveIt}
                >
                  <StarIcon filled={isSaved} color={isSaved ? '#D81B60' : '#A08E9A'} />
                </div>
                <div
                  className="star-btn"
                  style={{ background: isCheckedIn ? '#FBD9BC' : '#F3EFF1' }}
                  onClick={() => onToggleSessionCheckIn(s.id)}
                  title={isCheckedIn ? t.sessionCheckedIn : t.sessionCheckIn}
                >
                  <CheckCircleIcon filled={isCheckedIn} color={isCheckedIn ? '#A63D06' : '#A08E9A'} />
                </div>
                <div
                  className="star-btn"
                  style={{ background: sessionNotes[s.id] ? '#FBEAB0' : '#F3EFF1' }}
                  onClick={() => openNotes(s.id)}
                  title={t.myNotes}
                >
                  <NoteIcon color={sessionNotes[s.id] ? '#7A5205' : '#A08E9A'} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
