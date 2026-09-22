import { useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { tagColors, colorForId, timeToMinutes, isSessionLiveNow } from '../lib/helpers';
import { StarIcon, CheckCircleIcon, FileIcon, NoteIcon, SparkleIcon } from '../components/icons';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';
import { downloadICS } from '../lib/ics';

// Only sessions with actual content (not arrival/breaks/transitions) get
// a "materials coming soon" placeholder when no flyer/worksheet/slides
// have been uploaded yet.
const MATERIALS_TAG_KEYS = ['tagPlenary', 'tagFeatured', 'tagWorkshop', 'tagTheme1', 'tagTheme2', 'tagTheme3', 'tagTheme4'];
const TRACK_FILTERS = ['tagPlenary', 'tagFeatured', 'tagTheme1', 'tagTheme2', 'tagTheme3', 'tagTheme4'];

// Pairs of saved sessions whose time ranges overlap — since every
// theme track runs in parallel, saving more than one from the same
// block means the attendee can only make it to one.
function findScheduleConflicts(sessions) {
  const withRange = sessions.map((s) => {
    const start = timeToMinutes(s.t);
    return { session: s, start, end: start + (parseInt(s.d, 10) || 0) };
  });
  const pairs = [];
  for (let i = 0; i < withRange.length; i++) {
    for (let j = i + 1; j < withRange.length; j++) {
      const a = withRange[i];
      const b = withRange[j];
      if (a.start < b.end && b.start < a.end) pairs.push([a.session, b.session]);
    }
  }
  return pairs;
}

function Dashboard({ t, lang, name, saved, sessionCheckins, sessionNotes, checkedInAt, aiRecommendation, aiRecLoading, aiRecError, onFetchRecommendation, view, onFilter }) {
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const liveSession = SESSIONS.find((s) => isSessionLiveNow(s, nowMin));
  const upNext = liveSession
    ? SESSIONS.find((s) => timeToMinutes(s.t) > timeToMinutes(liveSession.t))
    : SESSIONS.find((s) => timeToMinutes(s.t) >= nowMin);
  const endingInMin = liveSession ? timeToMinutes(liveSession.t) + (parseInt(liveSession.d, 10) || 0) - nowMin : null;
  const savedCount = Object.values(saved).filter(Boolean).length;
  const notesCount = Object.values(sessionNotes).filter((n) => n && n.trim()).length;
  const checkinCount = Object.keys(sessionCheckins).length;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, background: '#2E1035', padding: 18, marginBottom: 16 }}>
      <Flourish color="#FFDCEF" size={140} top={-40} right={-40} opacity={0.18} rotate={15} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ font: '700 18px/1.3 Poppins', color: '#fff' }}>{t.dashboardGreeting}{name ? `, ${name.split(' ')[0]}` : ''}</div>
        {liveSession ? (
          <div style={{ marginTop: 10, padding: 12, borderRadius: 14, background: 'rgba(255,45,149,.16)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: '700 10.5px/1 Poppins', color: '#FF2D95', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2D95', display: 'inline-block' }} />
              {t.liveNow}
            </div>
            <div style={{ font: '600 14px/1.4 Poppins', color: '#fff', marginTop: 4 }}>
              {lang === 'es' ? liveSession.titleEs : liveSession.title}
            </div>
            <div style={{ font: '400 11.5px/1.4 Poppins', color: '#E3D3DF', marginTop: 4 }}>
              {t.dashboardEndingIn} {endingInMin} min
              {upNext && ` · ${t.dashboardNextUp}: ${lang === 'es' ? upNext.titleEs : upNext.title}`}
            </div>
          </div>
        ) : upNext ? (
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
          <div
            onClick={() => onFilter('mine')}
            style={{ font: '400 11.5px/1.4 Poppins', color: view === 'mine' ? '#FFDCEF' : '#E3D3DF', cursor: 'pointer', textDecoration: view === 'mine' ? 'underline' : 'none' }}
          >
            {savedCount} {t.dashboardSaved}
          </div>
          <div
            onClick={() => onFilter('attended')}
            style={{ font: '400 11.5px/1.4 Poppins', color: view === 'attended' ? '#FFDCEF' : '#E3D3DF', cursor: 'pointer', textDecoration: view === 'attended' ? 'underline' : 'none' }}
          >
            {checkinCount} {t.dashboardSessionsAttended}
          </div>
          <div
            onClick={() => onFilter('notes')}
            style={{ font: '400 11.5px/1.4 Poppins', color: view === 'notes' ? '#FFDCEF' : '#E3D3DF', cursor: 'pointer', textDecoration: view === 'notes' ? 'underline' : 'none' }}
          >
            {notesCount} {t.dashboardNotes}
          </div>
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
  const [search, setSearch] = useState('');
  const [trackFilter, setTrackFilter] = useState('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();

  let visibleSessions =
    view === 'mine'
      ? SESSIONS.filter((s) => saved[s.id])
      : view === 'attended'
        ? SESSIONS.filter((s) => sessionCheckins[s.id])
        : view === 'notes'
          ? SESSIONS.filter((s) => sessionNotes[s.id] && sessionNotes[s.id].trim())
          : SESSIONS;
  const emptyMessage = view === 'attended' ? t.attendedFilterEmpty : view === 'notes' ? t.notesFilterEmpty : t.myScheduleEmpty;

  if (trackFilter !== 'all') visibleSessions = visibleSessions.filter((s) => s.tagKey === trackFilter);
  if (liveOnly) visibleSessions = visibleSessions.filter((s) => isSessionLiveNow(s, nowMin));
  const searchActive = search.trim().length > 0;
  if (searchActive) {
    const q = search.trim().toLowerCase();
    visibleSessions = visibleSessions.filter((s) => {
      const title = ((lang === 'es' ? s.titleEs : s.title) || '').toLowerCase();
      const hostNames = (sessionHosts[s.id] || []).map((h) => h.name).join(' ').toLowerCase();
      const room = (s.room || '').toLowerCase();
      return title.includes(q) || hostNames.includes(q) || room.includes(q);
    });
  }
  const filtersActive = searchActive || trackFilter !== 'all' || liveOnly;
  const scheduleConflicts = view === 'mine' ? findScheduleConflicts(SESSIONS.filter((s) => saved[s.id])) : [];

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
        view={view}
        onFilter={(v) => setView((cur) => (cur === v ? 'all' : v))}
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

      <input
        className="field-input dark"
        type="text"
        placeholder={t.searchSessionsPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div
        style={{
          display: 'flex',
          gap: 7,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: '0 -18px 14px',
          padding: '0 18px 2px',
        }}
      >
        <span
          onClick={() => setLiveOnly((v) => !v)}
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '7px 12px',
            borderRadius: 999,
            font: '600 11.5px/1 Poppins',
            cursor: 'pointer',
            background: liveOnly ? '#FF2D95' : '#F3EFF1',
            color: liveOnly ? '#fff' : '#7A6070',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: liveOnly ? '#fff' : '#FF2D95', display: 'inline-block' }} />
          {t.filterLiveNow}
        </span>
        <span
          onClick={() => setTrackFilter('all')}
          style={{
            flex: 'none',
            padding: '7px 12px',
            borderRadius: 999,
            font: '600 11.5px/1 Poppins',
            cursor: 'pointer',
            background: trackFilter === 'all' ? '#2E1035' : '#F3EFF1',
            color: trackFilter === 'all' ? '#fff' : '#7A6070',
            whiteSpace: 'nowrap',
          }}
        >
          {t.filterAllTracks}
        </span>
        {TRACK_FILTERS.map((key) => {
          const active = trackFilter === key;
          return (
            <span
              key={key}
              onClick={() => setTrackFilter(active ? 'all' : key)}
              style={{
                flex: 'none',
                padding: '7px 12px',
                borderRadius: 999,
                font: '600 11.5px/1 Poppins',
                cursor: 'pointer',
                background: active ? '#2E1035' : '#F3EFF1',
                color: active ? '#fff' : '#7A6070',
                whiteSpace: 'nowrap',
              }}
            >
              {t[key]}
            </span>
          );
        })}
      </div>

      {view === 'mine' && scheduleConflicts.length > 0 && (
        <div style={{ padding: '10px 12px', borderRadius: 12, background: '#FFF0DC', marginBottom: 12 }}>
          <div style={{ font: '700 11px/1.3 Poppins', color: '#8A6A12', textTransform: 'uppercase', letterSpacing: '.03em' }}>
            {t.scheduleConflictTitle}
          </div>
          {scheduleConflicts.map(([a, b], i) => {
            const titleA = lang === 'es' ? a.titleEs : a.title;
            const titleB = lang === 'es' ? b.titleEs : b.title;
            return (
              <div key={i} style={{ font: '400 12px/1.5 Poppins', color: '#5C4508', marginTop: 4 }}>
                “{titleA}” {t.scheduleConflictAnd} “{titleB}” {t.scheduleConflictOverlap} {a.t}
              </div>
            );
          })}
        </div>
      )}

      {view === 'mine' && visibleSessions.length > 0 && (
        <div
          className="text-link-btn"
          style={{ padding: 0, margin: '0 0 14px' }}
          onClick={() => downloadICS(visibleSessions, lang, 'my-schedule.ics')}
        >
          {t.exportToCalendar}
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '2px 0 14px', font: '400 11px/1.3 Poppins', color: '#7A6070' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <StarIcon filled color="#D81B60" /> {t.iconLegendSave}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <CheckCircleIcon filled color="#A63D06" /> {t.iconLegendAttended}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <NoteIcon color="#7A5205" /> {t.iconLegendNotes}
        </span>
      </div>

      {visibleSessions.length === 0 && (filtersActive || view !== 'all') && (
        <div className="empty-state">
          <Flourish color="#FFDCEF" size={160} top={-40} right={-40} opacity={0.5} />
          <Flourish color="#FBEAB0" size={130} bottom={-30} left={-30} opacity={0.5} rotate={30} />
          <div className="empty-note">{filtersActive ? t.noSearchResults : emptyMessage}</div>
          {filtersActive && (
            <div
              className="text-link-btn"
              style={{ marginTop: 10 }}
              onClick={() => {
                setSearch('');
                setTrackFilter('all');
                setLiveOnly(false);
              }}
            >
              {t.clearFilters}
            </div>
          )}
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
        const isLive = isSessionLiveNow(s, nowMin);
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
                {isLive && (
                  <span className="tag-pill" style={{ background: '#FF2D95', color: '#fff', marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                    {t.liveNow}
                  </span>
                )}
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
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ font: '600 12px/1.2 Poppins', color: '#2E1035' }}>{h.name}</div>
                            {role && <div style={{ font: '400 10.5px/1.2 Poppins', color: '#7E6A76' }}>{role}</div>}
                          </div>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C0AEBA" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                            <path d="M9 5l7 7-7 7" />
                          </svg>
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
                {files.length === 0 && MATERIALS_TAG_KEYS.includes(s.tagKey) && (
                  <div style={{ marginTop: 9, font: '400 11.5px/1.3 Poppins', color: '#7E6A76', fontStyle: 'italic' }}>{t.materialsComingSoon}</div>
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
                  role="button"
                  aria-label={t.saveIt}
                  aria-pressed={isSaved}
                >
                  <StarIcon filled={isSaved} color={isSaved ? '#D81B60' : '#7E6A76'} />
                </div>
                <div
                  className="star-btn"
                  style={{ background: isCheckedIn ? '#FBD9BC' : '#F3EFF1' }}
                  onClick={() => onToggleSessionCheckIn(s.id)}
                  title={isCheckedIn ? t.sessionCheckedIn : t.sessionCheckIn}
                  role="button"
                  aria-label={isCheckedIn ? t.sessionCheckedIn : t.sessionCheckIn}
                  aria-pressed={isCheckedIn}
                >
                  <CheckCircleIcon filled={isCheckedIn} color={isCheckedIn ? '#A63D06' : '#7E6A76'} />
                </div>
                <div
                  className="star-btn"
                  style={{ background: sessionNotes[s.id] ? '#FBEAB0' : '#F3EFF1' }}
                  onClick={() => openNotes(s.id)}
                  title={t.myNotes}
                  role="button"
                  aria-label={t.myNotes}
                  aria-pressed={!!sessionNotes[s.id]}
                >
                  <NoteIcon color={sessionNotes[s.id] ? '#7A5205' : '#7E6A76'} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
