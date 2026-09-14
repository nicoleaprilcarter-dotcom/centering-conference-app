import { useRef } from 'react';
import { INTEREST_TAGS } from '../data/sessions';
import Avatar from '../components/Avatar';

export default function Profile({
  name,
  pron,
  bio,
  tags,
  visible,
  saving,
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
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="screen-pad">
      <div style={{ font: '400 12.5px/1.6 Poppins', color: '#4A3348' }}>
        Only what you want to share. Everything here saves to your account.
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '18px 0 4px' }}>
        <Avatar url={avatarUrl} name={name} size={66} fontSize={22} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="toggle-title">Profile photo</div>
          <div className="toggle-sub">Optional. Helps people find you at the vendor fair.</div>
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
          {avatarUploading ? 'Uploading…' : avatarUrl ? 'Change' : 'Upload'}
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

      <div className="field-block">
        <div>
          <div className="field-title">Display name</div>
          <input
            className="field-input dark"
            type="text"
            placeholder="How you want to be greeted"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className="field-title">Pronouns</div>
          <input
            className="field-input dark"
            type="text"
            placeholder="Optional — she/her, they/them"
            value={pron}
            onChange={(e) => setPron(e.target.value)}
          />
        </div>
        <div>
          <div className="field-title">What brings you today</div>
          <textarea
            className="field-input dark"
            placeholder="One or two lines. Skip it if you would rather not."
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>
      </div>
      <div className="field-title" style={{ margin: '20px 0 9px' }}>
        Interests
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {INTEREST_TAGS.map((label, i) => {
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
          <div className="toggle-title">Show me in the attendee directory</div>
          <div className="toggle-sub">Off means no one can find you.</div>
        </div>
        <div className="toggle-track" style={{ background: visible ? '#1F7A78' : 'rgba(46,16,53,.15)', justifyContent: visible ? 'flex-end' : 'flex-start' }}>
          <div className="toggle-knob" />
        </div>
      </div>
      <div className="primary-btn" onClick={onSave}>
        {saving ? 'Saving…' : isExisting ? 'Save changes' : 'Save and enter'}
      </div>
      <div className="text-link-btn" onClick={onSignOut}>
        Sign out
      </div>
      <div className="fine-note">{email ? `Signed in as ${email}` : ''}</div>
    </div>
  );
}
