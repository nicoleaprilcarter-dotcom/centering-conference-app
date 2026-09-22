import { useState } from 'react';
import { tagColors, colorForId } from '../lib/helpers';
import { FileIcon, SparkleIcon } from '../components/icons';
import Avatar from '../components/Avatar';
import StarRating from '../components/StarRating';
import { downloadICS } from '../lib/ics';

const VENUE_ADDRESS_ENCODED = encodeURIComponent('Dayton Hub, 31 S Main St, Dayton, OH 45402');
const LIVE_SESSION_ID = 's8';

export default function SessionDetail({
  t,
  lang,
  session,
  isLive,
  hasEnded,
  rating = 0,
  feedbackComment = '',
  onRateSession,
  hosts = [],
  files = [],
  detail,
  recap,
  isModerator,
  onBack,
  onOpenPerson,
  onJoinLive,
  onSaveDetail,
}) {
  const [editing, setEditing] = useState(false);
  const [descDraft, setDescDraft] = useState((detail && detail.description_en) || '');
  const [a11yDraft, setA11yDraft] = useState((detail && detail.accessibility_en) || '');
  const [commentDraft, setCommentDraft] = useState(feedbackComment);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  if (!session) return null;

  const [tagBg, tagFg] = tagColors(session.kind);
  const title = lang === 'es' ? session.titleEs : session.title;
  const tag = t[session.tagKey];
  const description = lang === 'es' ? (detail && detail.description_es) || (detail && detail.description_en) : detail && detail.description_en;
  const accessibility = lang === 'es' ? (detail && detail.accessibility_es) || (detail && detail.accessibility_en) : detail && detail.accessibility_en;

  const startEdit = () => {
    setDescDraft((detail && detail.description_en) || '');
    setA11yDraft((detail && detail.accessibility_en) || '');
    setEditing(true);
  };

  const save = () => {
    onSaveDetail(session.id, { description_en: descDraft, accessibility_en: a11yDraft });
    setEditing(false);
  };

  return (
    <div className="screen-pad">
      <div className="text-link-btn" style={{ padding: 0, margin: '0 0 14px' }} onClick={onBack}>
        {t.backToAgenda}
      </div>

      <span className="tag-pill" style={{ background: tagBg, color: tagFg }}>
        {tag}
      </span>
      {isLive && (
        <span className="tag-pill" style={{ background: '#FF2D95', color: '#fff', marginLeft: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          {t.liveNow}
        </span>
      )}

      <div style={{ font: '700 20px/1.3 Poppins', color: '#2E1035', margin: '10px 0 4px' }}>{title}</div>
      <div style={{ font: '400 13px/1.4 Poppins', color: '#7A6070' }}>
        {session.t} · {session.d} · {session.room}
      </div>
      <div
        className="text-link-btn"
        style={{ padding: 0, margin: '8px 0 0' }}
        onClick={() => downloadICS([session], lang, `${session.id}.ics`)}
      >
        {t.addToCalendar}
      </div>

      {session.id === LIVE_SESSION_ID && (
        <div className="primary-btn" style={{ marginTop: 14 }} onClick={onJoinLive}>
          {t.joinLive}
        </div>
      )}

      {recap && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 14, background: '#F3EFF1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 11px/1 Poppins', color: '#B01253', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            <SparkleIcon /> {t.sessionRecapTitle}
          </div>
          <div style={{ font: '400 12.5px/1.55 Poppins', color: '#2E1035', marginTop: 6 }}>
            {lang === 'es' ? recap.summary_es || recap.summary_en : recap.summary_en}
          </div>
        </div>
      )}

      <div className="field-title" style={{ margin: '20px 0 8px' }}>
        {t.sessionDetailAbout}
      </div>
      {editing ? (
        <div>
          <textarea
            className="field-input dark"
            placeholder={t.sessionDetailAboutPh}
            rows={4}
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            style={{ resize: 'none' }}
          />
          <div className="field-title" style={{ margin: '14px 0 8px' }}>
            {t.sessionDetailAccessibility}
          </div>
          <textarea
            className="field-input dark"
            placeholder={t.sessionDetailAccessibilityPh}
            rows={3}
            value={a11yDraft}
            onChange={(e) => setA11yDraft(e.target.value)}
            style={{ resize: 'none' }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <div className="primary-btn" style={{ flex: 1 }} onClick={save}>
              {t.save}
            </div>
            <div className="text-link-btn" style={{ padding: '13px 14px' }} onClick={() => setEditing(false)}>
              {t.cancel}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348' }}>{description || t.sessionDetailAboutEmpty}</div>
          {accessibility && (
            <>
              <div className="field-title" style={{ margin: '16px 0 6px' }}>
                {t.sessionDetailAccessibility}
              </div>
              <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348' }}>{accessibility}</div>
            </>
          )}
          {isModerator && (
            <div className="text-link-btn" style={{ margin: '10px 0 0', padding: 0 }} onClick={startEdit}>
              {detail && detail.description_en ? t.sessionDetailEdit : t.sessionDetailAdd}
            </div>
          )}
        </>
      )}

      {hosts.length > 0 && (
        <>
          <div className="field-title" style={{ margin: '20px 0 8px' }}>
            {t.sessionDetailHosts}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                  style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                >
                  <Avatar url={h.avatarUrl} name={h.name} color={colorForId(h.userId || h.name)} size={36} fontSize={13} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ font: '600 13px/1.2 Poppins', color: '#2E1035' }}>{h.name}</div>
                    {role && <div style={{ font: '400 11.5px/1.2 Poppins', color: '#7E6A76' }}>{role}</div>}
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0AEBA" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })}
          </div>
        </>
      )}

      {files.length > 0 && (
        <>
          <div className="field-title" style={{ margin: '20px 0 8px' }}>
            {t.sessionDetailMaterials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.map((f) => (
              <a key={f.id} href={f.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                {f.thumbnailUrl ? (
                  <img src={f.thumbnailUrl} alt="" style={{ width: 32, height: 32, borderRadius: 7, objectFit: 'cover', flex: 'none', border: '1px solid rgba(46,16,53,.1)' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: 7, background: '#F3EFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <FileIcon />
                  </div>
                )}
                <div style={{ font: '600 13px/1.3 Poppins', color: '#B01253' }}>{f.title}</div>
              </a>
            ))}
          </div>
        </>
      )}

      {hasEnded && onRateSession && (
        <div style={{ marginTop: 20, padding: 14, borderRadius: 14, background: '#F3EFF1' }}>
          <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035' }}>{t.feedbackWasUseful}</div>
          <div style={{ marginTop: 8 }}>
            <StarRating
              value={rating}
              onChange={(n) => {
                onRateSession(n, commentDraft);
                setFeedbackSubmitted(true);
              }}
              size={24}
            />
          </div>
          <div className="field-title" style={{ margin: '14px 0 6px' }}>
            {t.feedbackNextYear}
          </div>
          <textarea
            className="field-input dark"
            placeholder={t.feedbackCommentPh}
            rows={2}
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            onBlur={() => {
              if (rating > 0 && commentDraft !== feedbackComment) onRateSession(rating, commentDraft);
            }}
            style={{ resize: 'none' }}
          />
          {(feedbackSubmitted || rating > 0) && <div style={{ font: '400 11.5px/1.4 Poppins', color: '#1F7A78', marginTop: 6 }}>{t.feedbackThanksShort}</div>}
        </div>
      )}

      <div className="field-title" style={{ margin: '20px 0 8px' }}>
        {t.sessionDetailLocation}
      </div>
      <div style={{ font: '400 13px/1.6 Poppins', color: '#4A3348', marginBottom: 8 }}>{session.room}</div>
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${VENUE_ADDRESS_ENCODED}`}
        target="_blank"
        rel="noreferrer"
        style={{ font: '600 12.5px/1 Poppins', color: '#B01253', textDecoration: 'none' }}
      >
        {t.venueDirections}
      </a>
    </div>
  );
}
