import { useRef } from 'react';
import Avatar from '../components/Avatar';
import Flourish from '../components/Flourish';
import DesignationBadge from '../components/DesignationBadge';

export default function Profile({
  t,
  name,
  pron,
  bio,
  tags,
  visible,
  saving,
  designation,
  isExisting,
  email,
  avatarUrl,
  avatarUploading,
  onAvatarSelected,
  setName,
  setPron,
  setBio,
  toggleTag,
  toggleVisible,
  onSave,
  onSignOut,
  onOpenCheckout,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="screen-pad">
      <div style={{ font: '400 12.5px/1.6 Poppins', color: '#4A3348' }}>{t.profileIntro}</div>
      {designation && (
        <div style={{ marginTop: 10 }}>
          <DesignationBadge designation={designation} t={t} />
        </div>
      )}

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20 }}>
        <Flourish color="#FFDCEF" size={130} top={-40} right={-50} opacity={0.45} rotate={15} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14, margin: '18px 0 4px' }}>
        <Avatar url={avatarUrl} name={name} size={66} fontSize={22} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="toggle-title">{t.profilePhoto}</div>
          <div className="toggle-sub">{t.profilePhotoSub}</div>
        </div>
        <div
          style={{
            flex: 'none',
            padding: '9px 14px',
            borderRadius: 999,
            background: '#F3EFF1',
            color: '#2E1035',
            font: '600 11.5px/1 Poppins',
            cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {avatarUploading ? t.uploading : avatarUrl ? t.change : t.upload}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) onAvatarSelected(file);
            e.target.value = '';
          }}
        />
        </div>
      </div>

      <div className="field-block">
        <div>
          <div className="field-title">{t.displayName}</div>
          <input
            className="field-input dark"
            type="text"
            placeholder={t.displayNamePh}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="field-title">{t.pronouns}</div>
          <input
            className="field-input dark"
            type="text"
            placeholder={t.pronounsPh}
            value={pron}
            onChange={(e) => setPron(e.target.value)}
          />
        </div>
        <div>
          <div className="field-title">{t.whatBrings}</div>
          <textarea
            className="field-input dark"
            placeholder={t.whatBringsPh}
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
      </div>
      <div className="field-title" style={{ margin: '20px 0 9px' }}>
        {t.interests}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {t.interestTags.map((label, i) => {
          const on = !!tags[i];
          return (
            <div
              className="tag-chip"
              key={label}
              style={{
                background: on ? '#2E1035' : '#fff',
                color: on ? '#fff' : '#2E1035',
                borderColor: on ? '#2E1035' : 'rgba(46,16,53,.14)',
              }}
              onClick={() => toggleTag(i)}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="toggle-row" onClick={toggleVisible}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="toggle-title">{t.showInDirectory}</div>
          <div className="toggle-sub">{t.showInDirectorySub}</div>
        </div>
        <div className="toggle-track" style={{ background: visible ? '#FF2D95' : 'rgba(46,16,53,.15)', justifyContent: visible ? 'flex-end' : 'flex-start' }}>
          <div className="toggle-knob" />
        </div>
      </div>
      <div className="primary-btn" onClick={onSave}>
        {saving ? '…' : isExisting ? t.saveChanges : t.saveAndEnter}
      </div>

      <div className="toggle-row" style={{ cursor: 'pointer' }} onClick={onOpenCheckout}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="toggle-title">{t.rateConference}</div>
          <div className="toggle-sub">{t.rateConferenceSub}</div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C0AEBA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="text-link-btn" onClick={onSignOut}>
        {t.signOut}
      </div>
      <div className="fine-note">{email ? `${t.signedInAs} ${email}` : ''}</div>
    </div>
  );
}
