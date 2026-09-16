import { useRef, useState } from 'react';
import { SESSIONS } from '../data/sessions';
import { FileIcon } from './icons';

export default function AdminMaterials({ t, lang, sessionFiles, onUploadFile, onDeleteFile }) {
  const [sessionId, setSessionId] = useState(SESSIONS[0].id);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const files = (sessionFiles && sessionFiles[sessionId]) || [];

  const handleFile = async (file) => {
    setUploading(true);
    await onUploadFile(sessionId, title, file);
    setUploading(false);
    setTitle('');
  };

  return (
    <div className="card" style={{ marginBottom: 14, border: 'none', background: '#fff' }}>
      <div style={{ font: '600 13.5px/1.3 Poppins', color: '#2E1035', marginBottom: 2 }}>{t.adminMaterialsTitle}</div>
      <div style={{ font: '400 12px/1.5 Poppins', color: '#7A6070', marginBottom: 12 }}>{t.adminMaterialsSub}</div>

      <div className="field-title">{t.adminMaterialsSession}</div>
      <select
        className="field-input dark"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        style={{ marginBottom: 10 }}
      >
        {SESSIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.t} · {lang === 'es' ? s.titleEs : s.title}
          </option>
        ))}
      </select>

      <div className="field-title">{t.adminMaterialsLabel}</div>
      <input
        className="field-input dark"
        type="text"
        placeholder={t.adminMaterialsLabelPh}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div
        style={{
          padding: '9px 14px',
          borderRadius: 999,
          background: uploading ? '#F3EFF1' : '#B01253',
          color: uploading ? '#7A6070' : '#fff',
          font: '600 12px/1 Poppins',
          textAlign: 'center',
          cursor: uploading ? 'default' : 'pointer',
        }}
        onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
      >
        {uploading ? t.adminMaterialsUploading : t.adminMaterialsUpload}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf,.ppt,.pptx,.doc,.docx"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
          {files.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {f.thumbnailUrl ? (
                <img src={f.thumbnailUrl} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: 'cover', flex: 'none' }} />
              ) : (
                <div style={{ width: 26, height: 26, borderRadius: 6, background: '#F3EFF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <FileIcon />
                </div>
              )}
              <a href={f.fileUrl} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 0, font: '600 12px/1.3 Poppins', color: '#2E1035', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {f.title}
              </a>
              <div style={{ flex: 'none', font: '600 11px/1 Poppins', color: '#B01253', cursor: 'pointer' }} onClick={() => onDeleteFile(f.id)}>
                {t.adminMaterialsRemove}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
