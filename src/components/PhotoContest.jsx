import { useRef, useState } from 'react';
import { colorForId } from '../lib/helpers';
import { CameraIcon, HeartIcon } from './icons';
import Avatar from './Avatar';
import ReportMenu from './ReportMenu';

const THEMES = ['squad', 'moment', 'selfcare'];
const THEME_LABEL_KEY = {
  squad: 'photoThemeSquad',
  moment: 'photoThemeMoment',
  selfcare: 'photoThemeSelfcare',
};

export default function PhotoContest({
  t,
  userId,
  entries,
  people,
  voteCounts = {},
  myVotedIds,
  uploading,
  onUpload,
  onDeleteEntry,
  onToggleVote,
  onReport,
  onBlock,
}) {
  const [themeFilter, setThemeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState('');
  const [postTheme, setPostTheme] = useState(THEMES[0]);
  const fileInputRef = useRef(null);

  const nameFor = (uid) => {
    if (uid === userId) return t.you;
    const p = people.find((x) => x.id === uid);
    return p && p.display_name ? p.display_name : t.attendee;
  };
  const avatarFor = (uid) => {
    const p = people.find((x) => x.id === uid);
    return p ? p.avatar_url : null;
  };

  const visibleEntries = themeFilter === 'all' ? entries : entries.filter((e) => e.theme === themeFilter);

  const handleFilePicked = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    onUpload(file, caption, postTheme);
    setCaption('');
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ font: '400 12.5px/1.6 Poppins', color: '#4A3348', marginBottom: 12 }}>{t.photoContestIntro}</div>

      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', margin: '0 -18px 14px', padding: '0 18px 2px' }}>
        {['all', ...THEMES].map((key) => {
          const active = themeFilter === key;
          const label = key === 'all' ? t.photoThemeAll : t[THEME_LABEL_KEY[key]];
          return (
            <span
              key={key}
              onClick={() => setThemeFilter(key)}
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
              {label}
            </span>
          );
        })}
      </div>

      {showForm ? (
        <div className="card" style={{ border: 'none', background: '#fff', marginBottom: 14 }}>
          <div style={{ font: '700 10px/1 Poppins', color: '#7A5205', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 8 }}>
            {t.photoChooseTheme}
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
            {THEMES.map((key) => (
              <span
                key={key}
                onClick={() => setPostTheme(key)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 999,
                  font: '600 11.5px/1 Poppins',
                  cursor: 'pointer',
                  background: postTheme === key ? '#2E1035' : '#F3EFF1',
                  color: postTheme === key ? '#fff' : '#7A6070',
                }}
              >
                {t[THEME_LABEL_KEY[key]]}
              </span>
            ))}
          </div>
          <textarea
            className="field-input dark"
            placeholder={t.photoCaptionPh}
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ resize: 'none', marginBottom: 10 }}
          />
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFilePicked} />
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="primary-btn" style={{ flex: 1 }} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              {uploading ? t.photoUploading : t.photoUploadButton}
            </div>
            <div className="text-link-btn" style={{ padding: '13px 14px' }} onClick={() => setShowForm(false)}>
              {t.cancel}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-link-btn" style={{ padding: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowForm(true)}>
          <CameraIcon color="#B01253" /> {t.photoPostButton}
        </div>
      )}

      {visibleEntries.length === 0 && <div className="empty-note">{t.photoEmpty}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visibleEntries.map((entry) => {
          const voted = !!(myVotedIds && myVotedIds.has(entry.id));
          const count = voteCounts[entry.id] || 0;
          const mine = entry.user_id === userId;
          return (
            <div key={entry.id} className="card" style={{ border: 'none', background: '#fff', padding: 0, overflow: 'hidden' }}>
              <img src={entry.image_url} alt="" style={{ width: '100%', display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }} />
              <div style={{ padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar url={avatarFor(entry.user_id)} name={nameFor(entry.user_id)} color={colorForId(entry.user_id)} size={26} fontSize={11} />
                  <div style={{ font: '600 12px/1.3 Poppins', color: '#2E1035', flex: 1, minWidth: 0 }}>{nameFor(entry.user_id)}</div>
                  {!mine && onReport && (
                    <ReportMenu
                      t={t}
                      onReport={(reason, details) => onReport('contest_entry', entry.id, entry.user_id, reason, details)}
                      onBlock={onBlock ? () => onBlock(entry.user_id) : null}
                    />
                  )}
                </div>
                {entry.caption && <div style={{ font: '400 12.5px/1.5 Poppins', color: '#4A3348', marginTop: 8 }}>{entry.caption}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                  <div
                    onClick={() => onToggleVote(entry.id)}
                    role="button"
                    aria-label={t.photoVoteLabel}
                    aria-pressed={voted}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                  >
                    <HeartIcon filled={voted} color={voted ? '#D81B60' : '#7A6070'} />
                    {count > 0 && <span style={{ font: '600 11.5px/1 Poppins', color: voted ? '#D81B60' : '#7A6070' }}>{count}</span>}
                  </div>
                  {mine && (
                    <div
                      style={{ font: '500 11px/1 Poppins', color: '#7A6070', cursor: 'pointer' }}
                      onClick={() => {
                        if (window.confirm(t.deleteConfirm)) onDeleteEntry(entry.id);
                      }}
                    >
                      {t.deleteAction}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
