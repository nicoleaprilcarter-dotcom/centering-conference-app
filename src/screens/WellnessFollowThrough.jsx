import { useState } from 'react';
import { SESSIONS } from '../data/sessions';

function buildExportText(t, lang, pledge, savedSessions, sessionNotes, helped, obstacles) {
  const lines = [];
  lines.push('Centering Women of Color 2026 — My Wellness Follow-Through');
  lines.push('');
  lines.push(t.wellnessMyPledge + ':');
  lines.push(pledge ? pledge.body : t.wellnessNoPledge);
  lines.push('');
  lines.push(t.wellnessSavedSessions + ':');
  if (savedSessions.length === 0) lines.push(t.wellnessNoSavedSessions);
  savedSessions.forEach((s) => {
    const title = lang === 'es' ? s.titleEs : s.title;
    lines.push(`- ${title}`);
    const note = sessionNotes[s.id];
    if (note && note.trim()) lines.push(`  ${t.wellnessNoteLabel}: ${note.trim()}`);
  });
  lines.push('');
  lines.push(t.wellnessWhatHelped + ':');
  lines.push(helped || '—');
  lines.push('');
  lines.push(t.wellnessWhatGotInWay + ':');
  lines.push(obstacles || '—');
  return lines.join('\n');
}

export default function WellnessFollowThrough({ t, lang, onBack, pledge, saved, sessionNotes, reflection, onSavePledge, onSaveReflection }) {
  const [editingPledge, setEditingPledge] = useState(false);
  const [pledgeDraft, setPledgeDraft] = useState((pledge && pledge.body) || '');
  const [helped, setHelped] = useState((reflection && reflection.helped) || '');
  const [obstacles, setObstacles] = useState((reflection && reflection.obstacles) || '');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const savedSessions = SESSIONS.filter((s) => saved[s.id]);

  const savePledge = () => {
    onSavePledge(pledgeDraft);
    setEditingPledge(false);
  };

  const saveReflection = () => {
    onSaveReflection(helped, obstacles);
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 1800);
  };

  const downloadNotes = () => {
    const text = buildExportText(t, lang, pledge, savedSessions, sessionNotes, helped, obstacles);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-wellness-follow-through.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px 0' }}>
        <div
          style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', border: '1px solid rgba(46,16,53,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E1035" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </div>
        <div style={{ font: '600 15px/1.2 Poppins' }}>{t.wellnessTitle}</div>
      </div>

      <div className="screen-pad">
        <div style={{ font: '400 12.5px/1.6 Poppins', color: '#7A6070', marginBottom: 18 }}>{t.wellnessIntro}</div>

        <div className="field-title">{t.wellnessMyPledge}</div>
        {editingPledge ? (
          <div style={{ marginTop: 8 }}>
            <textarea
              className="field-input dark"
              rows={3}
              value={pledgeDraft}
              onChange={(e) => setPledgeDraft(e.target.value)}
              style={{ resize: 'none' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <div className="primary-btn" style={{ flex: 1 }} onClick={savePledge}>
                {t.save}
              </div>
              <div className="text-link-btn" style={{ padding: '13px 14px' }} onClick={() => setEditingPledge(false)}>
                {t.cancel}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8, padding: 14, borderRadius: 14, background: '#FFF0F6' }}>
            <div style={{ font: '500 14px/1.5 Poppins', color: '#2E1035' }}>{(pledge && pledge.body) || t.wellnessNoPledge}</div>
            <div
              className="text-link-btn"
              style={{ padding: 0, marginTop: 8 }}
              onClick={() => {
                setPledgeDraft((pledge && pledge.body) || '');
                setEditingPledge(true);
              }}
            >
              {pledge ? t.wellnessEditPledge : t.wellnessAddPledge}
            </div>
          </div>
        )}

        <div className="field-title" style={{ margin: '22px 0 8px' }}>
          {t.wellnessSavedSessions}
        </div>
        {savedSessions.length === 0 ? (
          <div style={{ font: '400 13px/1.6 Poppins', color: '#7A6070' }}>{t.wellnessNoSavedSessions}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {savedSessions.map((s) => {
              const title = lang === 'es' ? s.titleEs : s.title;
              const note = sessionNotes[s.id];
              return (
                <div key={s.id} className="card" style={{ border: 'none', background: '#fff' }}>
                  <div style={{ font: '600 13px/1.35 Poppins', color: '#2E1035' }}>{title}</div>
                  {note && note.trim() && (
                    <div style={{ font: '400 12px/1.5 Poppins', color: '#4A3348', marginTop: 6 }}>{note}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="field-title" style={{ margin: '22px 0 8px' }}>
          {t.wellnessWhatHelped}
        </div>
        <textarea
          className="field-input dark"
          placeholder={t.wellnessWhatHelpedPh}
          rows={2}
          value={helped}
          onChange={(e) => setHelped(e.target.value)}
          style={{ resize: 'none' }}
        />

        <div className="field-title" style={{ margin: '14px 0 8px' }}>
          {t.wellnessWhatGotInWay}
        </div>
        <textarea
          className="field-input dark"
          placeholder={t.wellnessWhatGotInWayPh}
          rows={2}
          value={obstacles}
          onChange={(e) => setObstacles(e.target.value)}
          style={{ resize: 'none' }}
        />
        <div className="primary-btn" style={{ marginTop: 10 }} onClick={saveReflection}>
          {t.save}
        </div>
        {reflectionSaved && <div style={{ font: '400 11.5px/1.4 Poppins', color: '#1F7A78', marginTop: 6 }}>{t.feedbackThanksShort}</div>}

        <div className="text-link-btn" style={{ marginTop: 26 }} onClick={downloadNotes}>
          {t.wellnessDownload}
        </div>
      </div>
    </div>
  );
}
