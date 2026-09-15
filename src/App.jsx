import { useCallback, useEffect, useRef, useState } from 'react';
import {
  resolveConfig,
  storeConfig,
  clearStoredConfig,
  createSupabaseClient,
} from './lib/supabaseClient';
import { POLL_QUESTION_ID } from './data/sessions';
import { TRANSLATIONS } from './data/translations';

import Setup from './screens/Setup';
import SignIn from './screens/SignIn';
import Agenda from './screens/Agenda';
import Resources from './screens/Resources';
import Session from './screens/Session';
import Wall from './screens/Wall';
import People from './screens/People';
import Chat from './screens/Chat';
import DirectThread from './screens/DirectThread';
import Profile from './screens/Profile';
import Checkout from './screens/Checkout';
import PersonProfile from './screens/PersonProfile';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ErrorBanner from './components/ErrorBanner';

const LOBBY_SESSION_ID = 'lobby';
const WAITING_ROOM_SESSION_ID = 'waiting-room';
const TRIAGE_SESSION_ID = 'triage';

function readStoredLang() {
  try {
    return localStorage.getItem('cwoc_lang') || 'en';
  } catch {
    return 'en';
  }
}

function readLastDmRead() {
  try {
    return localStorage.getItem('cwoc_dm_read_at') || '';
  } catch {
    return '';
  }
}

function groupSessionHosts(rows) {
  const map = {};
  (rows || []).forEach((row) => {
    const profile = row.profile;
    if (!map[row.session_id]) map[row.session_id] = [];
    map[row.session_id].push({
      userId: profile ? profile.id : null,
      name: row.name || (profile && profile.display_name) || '',
      avatarUrl: row.photo_url || (profile && profile.avatar_url) || '',
      pronouns: profile && profile.pronouns,
      bio: profile && profile.bio,
      interests: profile && profile.interests,
      designation: profile && profile.designation,
      roleEn: row.role_en,
      roleEs: row.role_es,
    });
  });
  return map;
}

export default function App() {
  const [config, setConfig] = useState(null); // { url, key, fromEnv }
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sending, setSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const [screen, setScreen] = useState('agenda');
  const [sid] = useState('s8'); // the fireside chat is the one "live" session with chat + poll wired up
  const [saved, setSaved] = useState({});
  const [msgs, setMsgs] = useState([]);
  const [people, setPeople] = useState([]);
  const [votes, setVotes] = useState([]);
  const [words, setWords] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [live, setLive] = useState(false);

  const [draft, setDraft] = useState('');
  const [word, setWord] = useState('');
  const [pledgeDraft, setPledgeDraft] = useState('');

  const [pfName, setPfName] = useState('');
  const [pfPron, setPfPron] = useState('');
  const [pfBio, setPfBio] = useState('');
  const [pfTags, setPfTags] = useState({});
  const [pfVisible, setPfVisible] = useState(true);
  const [pfAvatarUrl, setPfAvatarUrl] = useState('');
  const [pfSaving, setPfSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [lobbyMsgs, setLobbyMsgs] = useState([]);
  const [lobbyDraft, setLobbyDraft] = useState('');
  const [dmMsgs, setDmMsgs] = useState([]);
  const [dmDraft, setDmDraft] = useState('');
  const [activeDmUserId, setActiveDmUserId] = useState(null);

  const [lang, setLang] = useState(readStoredLang);
  const [checkedInAt, setCheckedInAt] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [sessionHosts, setSessionHosts] = useState({});
  const [lastDmReadAt, setLastDmReadAt] = useState(readLastDmRead);

  const [sessionCheckins, setSessionCheckins] = useState({});
  const [waitingRoomMsgs, setWaitingRoomMsgs] = useState([]);
  const [waitingRoomDraft, setWaitingRoomDraft] = useState('');
  const [triageMsgs, setTriageMsgs] = useState([]);
  const [triageDraft, setTriageDraft] = useState('');

  const [showCheckout, setShowCheckout] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [sessionRatings, setSessionRatings] = useState({});

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const channelRef = useRef(null);

  // ---------- bootstrap ----------
  useEffect(() => {
    const cfg = resolveConfig();
    if (cfg) {
      setConfig(cfg);
    } else {
      setLoading(false);
    }
  }, []);

  const connect = useCallback((cfg) => {
    if (!cfg) return;
    let c;
    try {
      c = createSupabaseClient(cfg.url, cfg.key);
    } catch (e) {
      setError('That URL or key does not look right. ' + e.message);
      setLoading(false);
      return;
    }
    setClient(c);
    setError('');
    (async () => {
      const { data } = await c.auth.getSession();
      c.auth.onAuthStateChange((_event, session) => {
        setUser(session ? session.user : null);
        setLinkSent(false);
        if (!session) setProfile(null);
      });
      if (data && data.session) {
        setUser(data.session.user);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (config) connect(config);
  }, [config, connect]);

  // ---------- after sign-in ----------
  const loadAll = useCallback(
    async (c, uid) => {
      const [sv, ms, pp, vt, wd, pl, lb, dm, sp, sc, wr, tr, cf, sf, sn, sh] = await Promise.all([
        c.from('saved_sessions').select('session_id').eq('user_id', uid),
        c.from('messages').select('*').eq('session_id', sid).order('created_at'),
        c.from('profiles').select('*').eq('visible', true),
        c.from('poll_votes').select('*').eq('question_id', POLL_QUESTION_ID),
        c.from('cloud_words').select('*').order('created_at'),
        c.from('pledges').select('*').order('created_at', { ascending: false }),
        c.from('messages').select('*').eq('session_id', LOBBY_SESSION_ID).order('created_at'),
        c.from('direct_messages').select('*').or(`sender_id.eq.${uid},recipient_id.eq.${uid}`).order('created_at'),
        c.from('speakers').select('*').order('sort').order('created_at'),
        c.from('session_checkins').select('session_id').eq('user_id', uid),
        c.from('messages').select('*').eq('session_id', WAITING_ROOM_SESSION_ID).order('created_at'),
        c.from('messages').select('*').eq('session_id', TRIAGE_SESSION_ID).order('created_at'),
        c.from('conference_feedback').select('*').eq('user_id', uid).maybeSingle(),
        c.from('session_feedback').select('*').eq('user_id', uid),
        c.from('sponsors').select('*').order('sort').order('created_at'),
        c.from('session_hosts').select('*, profile:profiles(id, display_name, avatar_url, pronouns, bio, interests, designation)').order('sort'),
      ]);
      const savedMap = {};
      (sv.data || []).forEach((r) => {
        savedMap[r.session_id] = true;
      });
      setSaved(savedMap);
      setMsgs(ms.data || []);
      setPeople(pp.data || []);
      setVotes(vt.data || []);
      setWords(wd.data || []);
      setPledges(pl.data || []);
      setLobbyMsgs(lb.data || []);
      setDmMsgs(dm.data || []);
      setSpeakers(sp.data || []);
      setSponsors(sn.data || []);
      setSessionHosts(groupSessionHosts(sh.data));
      const checkinMap = {};
      (sc.data || []).forEach((r) => {
        checkinMap[r.session_id] = true;
      });
      setSessionCheckins(checkinMap);
      setWaitingRoomMsgs(wr.data || []);
      setTriageMsgs(tr.data || []);
      if (cf.data) {
        setFeedbackRating(cf.data.rating);
        setFeedbackComments(cf.data.comments || '');
        setFeedbackSaved(true);
      }
      const ratingMap = {};
      (sf.data || []).forEach((r) => {
        ratingMap[r.session_id] = r.rating;
      });
      setSessionRatings(ratingMap);
    },
    [sid],
  );

  const reload = useCallback(
    async (what) => {
      if (!client) return;
      if (what === 'messages') {
        const { data } = await client.from('messages').select('*').eq('session_id', sid).order('created_at');
        setMsgs(data || []);
      }
      if (what === 'votes') {
        const { data } = await client.from('poll_votes').select('*').eq('question_id', POLL_QUESTION_ID);
        setVotes(data || []);
      }
      if (what === 'words') {
        const { data } = await client.from('cloud_words').select('*').order('created_at');
        setWords(data || []);
      }
      if (what === 'pledges') {
        const { data } = await client.from('pledges').select('*').order('created_at', { ascending: false });
        setPledges(data || []);
      }
      if (what === 'people') {
        const { data } = await client.from('profiles').select('*').eq('visible', true);
        setPeople(data || []);
      }
      if (what === 'lobbyMessages') {
        const { data } = await client.from('messages').select('*').eq('session_id', LOBBY_SESSION_ID).order('created_at');
        setLobbyMsgs(data || []);
      }
      if (what === 'directMessages' && user) {
        const { data } = await client
          .from('direct_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at');
        setDmMsgs(data || []);
      }
      if (what === 'speakers') {
        const { data } = await client.from('speakers').select('*').order('sort').order('created_at');
        setSpeakers(data || []);
      }
      if (what === 'sponsors') {
        const { data } = await client.from('sponsors').select('*').order('sort').order('created_at');
        setSponsors(data || []);
      }
      if (what === 'sessionHosts') {
        const { data } = await client.from('session_hosts').select('*, profile:profiles(id, display_name, avatar_url, pronouns, bio, interests, designation)').order('sort');
        setSessionHosts(groupSessionHosts(data));
      }
      if (what === 'waitingRoomMessages') {
        const { data } = await client.from('messages').select('*').eq('session_id', WAITING_ROOM_SESSION_ID).order('created_at');
        setWaitingRoomMsgs(data || []);
      }
      if (what === 'triageMessages') {
        const { data } = await client.from('messages').select('*').eq('session_id', TRIAGE_SESSION_ID).order('created_at');
        setTriageMsgs(data || []);
      }
    },
    [client, sid, user],
  );

  const subscribe = useCallback(() => {
    if (!client) return;
    if (channelRef.current) client.removeChannel(channelRef.current);
    const ch = client
      .channel('cwoc-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        reload('messages');
        reload('lobbyMessages');
        reload('waitingRoomMessages');
        reload('triageMessages');
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'poll_votes' }, () => reload('votes'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud_words' }, () => reload('words'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pledges' }, () => reload('pledges'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => reload('people'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'direct_messages' }, () => reload('directMessages'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'speakers' }, () => reload('speakers'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sponsors' }, () => reload('sponsors'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_hosts' }, () => reload('sessionHosts'))
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));
    channelRef.current = ch;
  }, [client, reload]);

  useEffect(() => {
    return () => {
      if (channelRef.current && client) client.removeChannel(channelRef.current);
    };
  }, [client]);

  useEffect(() => {
    if (!client || !user) return;
    (async () => {
      const { data: prof, error: profErr } = await client.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (profErr && profErr.message && /relation|does not exist/i.test(profErr.message)) {
        setError('Connected, but the tables are missing. Run supabase-schema.sql in the SQL Editor.');
        setLoading(false);
        return;
      }
      if (prof) {
        const tagMap = {};
        (prof.interests || []).forEach((x) => {
          const i = TRANSLATIONS.en.interestTags.indexOf(x);
          if (i >= 0) tagMap[i] = true;
        });
        setProfile(prof);
        setPfName(prof.display_name || '');
        setPfPron(prof.pronouns || '');
        setPfBio(prof.bio || '');
        setPfTags(tagMap);
        setPfVisible(prof.visible);
        setPfAvatarUrl(prof.avatar_url || '');
        setCheckedInAt(prof.checked_in_at || null);
        if (prof.language) {
          setLang(prof.language);
          try {
            localStorage.setItem('cwoc_lang', prof.language);
          } catch {
            // ignore
          }
        }
        setScreen(prof.display_name ? 'agenda' : 'profile');
      } else {
        setScreen('profile');
      }
      setLoading(false);
      loadAll(client, user.id);
      subscribe();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, user]);

  // ---------- handlers ----------
  const handleConnectSetup = (url, key) => {
    storeConfig(url, key);
    setConfig({ url, key, fromEnv: false });
  };

  const handleChangeDatabase = () => {
    clearStoredConfig();
    setConfig(null);
    setClient(null);
    setUser(null);
    setError('');
  };

  const handleSendLink = async (emailValue) => {
    const em = emailValue.trim();
    if (!em) {
      setError('Enter your email first.');
      return;
    }
    setSending(true);
    setError('');
    const { error: sendErr } = await client.auth.signInWithOtp({
      email: em,
      options: { emailRedirectTo: window.location.origin },
    });
    setSending(false);
    setLinkSent(!sendErr);
    setError(sendErr ? sendErr.message : '');
  };

  const toggleStar = async (sessionId) => {
    const uid = user.id;
    const on = !!saved[sessionId];
    setSaved((s) => ({ ...s, [sessionId]: !on }));
    const { error: err } = on
      ? await client.from('saved_sessions').delete().eq('user_id', uid).eq('session_id', sessionId)
      : await client.from('saved_sessions').insert({ user_id: uid, session_id: sessionId });
    if (err) {
      setSaved((s) => ({ ...s, [sessionId]: on }));
      setError('Could not update your schedule. ' + err.message);
    }
  };

  const openSession = () => setScreen('session');

  const sendMessage = async () => {
    const v = draft.trim();
    if (!v) return;
    setDraft('');
    const { error: err } = await client.from('messages').insert({ session_id: sid, user_id: user.id, body: v });
    if (err) {
      setDraft(v);
      setError('Message not sent. ' + err.message);
    }
    reload('messages');
  };

  const vote = async (optionId) => {
    const { error: err } = await client
      .from('poll_votes')
      .upsert({ question_id: POLL_QUESTION_ID, user_id: user.id, option_id: optionId });
    if (err) setError('Vote not saved. ' + err.message);
    reload('votes');
  };

  const addWord = async () => {
    const v = word.trim();
    if (!v) return;
    setWord('');
    const { error: err } = await client.from('cloud_words').insert({ user_id: user.id, word: v.slice(0, 24) });
    if (err) {
      setWord(v);
      setError('Word not added. ' + err.message);
    }
    reload('words');
  };

  const postPledge = async () => {
    const v = pledgeDraft.trim();
    if (!v) return;
    setPledgeDraft('');
    const { error: err } = await client.from('pledges').insert({ user_id: user.id, body: v.slice(0, 300) });
    if (err) {
      setPledgeDraft(v);
      setError('Pledge not posted. ' + err.message);
    }
    reload('pledges');
  };

  const toggleProfileTag = (i) => setPfTags((t) => ({ ...t, [i]: !t[i] }));

  const handleAvatarSelected = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('That image is too large. Please choose one under 5MB.');
      return;
    }
    setAvatarUploading(true);
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await client.storage.from('avatars').upload(path, file, { cacheControl: '3600' });
    if (upErr) {
      setAvatarUploading(false);
      setError('Photo not uploaded. ' + upErr.message);
      return;
    }
    const { data } = client.storage.from('avatars').getPublicUrl(path);
    setPfAvatarUrl(data.publicUrl);
    setAvatarUploading(false);
  };

  const saveProfile = async () => {
    if (!pfName.trim()) {
      setError('A display name is required.');
      return;
    }
    setPfSaving(true);
    const interests = Object.keys(pfTags)
      .filter((k) => pfTags[k])
      .map((k) => TRANSLATIONS.en.interestTags[k]);
    const row = {
      id: user.id,
      display_name: pfName.trim(),
      pronouns: pfPron.trim(),
      bio: pfBio.trim(),
      interests,
      visible: pfVisible,
      avatar_url: pfAvatarUrl || null,
      updated_at: new Date().toISOString(),
    };
    const { data, error: err } = await client.from('profiles').upsert(row).select().maybeSingle();
    setPfSaving(false);
    setProfile(err ? profile : data || row);
    setScreen(err ? 'profile' : 'agenda');
    setError(err ? 'Could not save your profile. ' + err.message : '');
    reload('people');
  };

  const signOut = async () => {
    await client.auth.signOut();
    setUser(null);
    setProfile(null);
    setScreen('agenda');
  };

  const sendLobby = async () => {
    const v = lobbyDraft.trim();
    if (!v) return;
    setLobbyDraft('');
    const { error: err } = await client.from('messages').insert({ session_id: LOBBY_SESSION_ID, user_id: user.id, body: v });
    if (err) {
      setLobbyDraft(v);
      setError('Message not sent. ' + err.message);
    }
    reload('lobbyMessages');
  };

  const openDirectThread = (otherId) => {
    setActiveDmUserId(otherId);
    setScreen('chat');
  };

  const [viewingPerson, setViewingPerson] = useState(null);

  const openPersonProfile = (host) => {
    setViewingPerson(host);
  };

  const sendDirect = async () => {
    const v = dmDraft.trim();
    if (!v || !activeDmUserId) return;
    setDmDraft('');
    const { error: err } = await client
      .from('direct_messages')
      .insert({ sender_id: user.id, recipient_id: activeDmUserId, body: v });
    if (err) {
      setDmDraft(v);
      setError('Message not sent. ' + err.message);
    }
    reload('directMessages');
  };

  const dmThreads = (() => {
    const byOther = {};
    dmMsgs.forEach((m) => {
      const otherId = m.sender_id === user?.id ? m.recipient_id : m.sender_id;
      if (!byOther[otherId] || m.created_at > byOther[otherId].created_at) {
        byOther[otherId] = m;
      }
    });
    return Object.keys(byOther)
      .map((otherId) => {
        const p = people.find((x) => x.id === otherId);
        return {
          userId: otherId,
          name: p && p.display_name ? p.display_name : t.attendee,
          avatarUrl: p ? p.avatar_url : null,
          lastMessage: byOther[otherId].body,
          lastAt: byOther[otherId].created_at,
        };
      })
      .sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
  })();

  const chatUnread = dmMsgs.some((m) => m.recipient_id === user?.id && m.created_at > lastDmReadAt);

  // Mark direct messages as read whenever the Chat screen is open.
  useEffect(() => {
    if (screen !== 'chat' || !user) return;
    const now = new Date().toISOString();
    setLastDmReadAt(now);
    try {
      localStorage.setItem('cwoc_dm_read_at', now);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, user, dmMsgs.length]);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    try {
      localStorage.setItem('cwoc_lang', next);
    } catch {
      // ignore
    }
    if (client && user) {
      client
        .from('profiles')
        .update({ language: next })
        .eq('id', user.id)
        .then(({ error: err }) => {
          if (err) setError('Could not save language preference. ' + err.message);
        });
    }
  };

  const checkIn = async () => {
    const now = new Date().toISOString();
    setCheckedInAt(now);
    const { error: err } = await client.from('profiles').update({ checked_in_at: now }).eq('id', user.id);
    if (err) {
      setCheckedInAt(null);
      setError('Could not check in. ' + err.message);
    }
  };

  const undoCheckIn = async () => {
    const prev = checkedInAt;
    setCheckedInAt(null);
    const { error: err } = await client.from('profiles').update({ checked_in_at: null }).eq('id', user.id);
    if (err) {
      setCheckedInAt(prev);
      setError('Could not undo check-in. ' + err.message);
    }
  };

  const toggleSessionCheckIn = async (sessionId) => {
    const uid = user.id;
    const on = !!sessionCheckins[sessionId];
    setSessionCheckins((s) => ({ ...s, [sessionId]: !on }));
    const { error: err } = on
      ? await client.from('session_checkins').delete().eq('user_id', uid).eq('session_id', sessionId)
      : await client.from('session_checkins').insert({ user_id: uid, session_id: sessionId });
    if (err) {
      setSessionCheckins((s) => ({ ...s, [sessionId]: on }));
      setError('Could not update session check-in. ' + err.message);
    }
  };

  const sendWaitingRoom = async () => {
    const v = waitingRoomDraft.trim();
    if (!v) return;
    setWaitingRoomDraft('');
    const { error: err } = await client.from('messages').insert({ session_id: WAITING_ROOM_SESSION_ID, user_id: user.id, body: v });
    if (err) {
      setWaitingRoomDraft(v);
      setError('Message not sent. ' + err.message);
    }
    reload('waitingRoomMessages');
  };

  const sendTriage = async () => {
    const v = triageDraft.trim();
    if (!v) return;
    setTriageDraft('');
    const { error: err } = await client.from('messages').insert({ session_id: TRIAGE_SESSION_ID, user_id: user.id, body: v });
    if (err) {
      setTriageDraft(v);
      setError('Message not sent. ' + err.message);
    }
    reload('triageMessages');
  };

  const saveOverallFeedback = async () => {
    if (!feedbackRating) {
      setError('Pick a star rating first.');
      return;
    }
    setFeedbackSaving(true);
    const { error: err } = await client.from('conference_feedback').upsert({
      user_id: user.id,
      rating: feedbackRating,
      comments: feedbackComments.trim(),
      updated_at: new Date().toISOString(),
    });
    setFeedbackSaving(false);
    if (err) {
      setError('Could not save feedback. ' + err.message);
      return;
    }
    setFeedbackSaved(true);
  };

  const rateSession = async (sessionId, rating) => {
    const prev = sessionRatings[sessionId];
    setSessionRatings((s) => ({ ...s, [sessionId]: rating }));
    const { error: err } = await client.from('session_feedback').upsert({ user_id: user.id, session_id: sessionId, rating });
    if (err) {
      setSessionRatings((s) => ({ ...s, [sessionId]: prev }));
      setError('Could not save that rating. ' + err.message);
    }
  };

  // ---------- render ----------
  if (loading) {
    return (
      <div className="app-shell">
        <div className="hero" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="hero-eyebrow">{t.signInEyebrow}</div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="app-shell">
        <Setup onConnect={handleConnectSetup} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-shell">
        <SignIn
          t={t}
          onSendLink={handleSendLink}
          sending={sending}
          linkSent={linkSent}
          error={error}
          onChangeDatabase={handleChangeDatabase}
        />
      </div>
    );
  }

  const activeDmPerson = activeDmUserId ? people.find((p) => p.id === activeDmUserId) : null;
  const inDmThread = screen === 'chat' && !!activeDmUserId;

  const navigate = (key) => {
    setActiveDmUserId(null);
    setShowCheckout(false);
    setViewingPerson(null);
    setScreen(key);
  };

  return (
    <div className="app-shell">
      <Header
        name={pfName}
        avatarUrl={pfAvatarUrl}
        hideAvatar={screen === 'profile'}
        live={live}
        liveLabel={t.live}
        offlineLabel={t.offline}
        langToggle={t.langToggle}
        onToggleLang={toggleLang}
        onAvatarClick={() => navigate('profile')}
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="content-sheet">
      {viewingPerson ? (
        <PersonProfile
          t={t}
          lang={lang}
          person={viewingPerson}
          onBack={() => setViewingPerson(null)}
          onMessage={viewingPerson.userId ? () => openDirectThread(viewingPerson.userId) : null}
        />
      ) : (
        <>
      {screen === 'agenda' && (
        <Agenda
          t={t}
          lang={lang}
          saved={saved}
          onOpenSession={openSession}
          onToggleStar={toggleStar}
          sessionCheckins={sessionCheckins}
          onToggleSessionCheckIn={toggleSessionCheckIn}
          sessionHosts={sessionHosts}
          onOpenPerson={openPersonProfile}
        />
      )}
      {screen === 'resources' && (
        <Resources t={t} checkedInAt={checkedInAt} onCheckIn={checkIn} onUndoCheckIn={undoCheckIn} userId={user.id} />
      )}
      {screen === 'session' && (
        <Session
          t={t}
          lang={lang}
          userId={user.id}
          myName={pfName}
          myAvatarUrl={pfAvatarUrl}
          messages={msgs}
          votes={votes}
          words={words}
          people={people}
          draft={draft}
          setDraft={setDraft}
          onSend={sendMessage}
          onVote={vote}
          word={word}
          setWord={setWord}
          onAddWord={addWord}
        />
      )}
      {screen === 'wall' && (
        <Wall t={t} userId={user.id} pledges={pledges} draft={pledgeDraft} setDraft={setPledgeDraft} onPost={postPledge} />
      )}
      {screen === 'chat' &&
        (inDmThread ? (
          <DirectThread
            t={t}
            userId={user.id}
            myName={pfName}
            myAvatarUrl={pfAvatarUrl}
            otherId={activeDmUserId}
            otherName={(activeDmPerson && activeDmPerson.display_name) || t.attendee}
            otherAvatarUrl={activeDmPerson && activeDmPerson.avatar_url}
            messages={dmMsgs.filter(
              (m) =>
                (m.sender_id === activeDmUserId && m.recipient_id === user.id) ||
                (m.sender_id === user.id && m.recipient_id === activeDmUserId),
            )}
            draft={dmDraft}
            setDraft={setDmDraft}
            onSend={sendDirect}
            onBack={() => setActiveDmUserId(null)}
          />
        ) : (
          <Chat
            t={t}
            userId={user.id}
            myName={pfName}
            myAvatarUrl={pfAvatarUrl}
            people={people}
            waitingRoomMsgs={waitingRoomMsgs}
            waitingRoomDraft={waitingRoomDraft}
            setWaitingRoomDraft={setWaitingRoomDraft}
            onSendWaitingRoom={sendWaitingRoom}
            lobbyMsgs={lobbyMsgs}
            lobbyDraft={lobbyDraft}
            setLobbyDraft={setLobbyDraft}
            onSendLobby={sendLobby}
            triageMsgs={triageMsgs}
            triageDraft={triageDraft}
            setTriageDraft={setTriageDraft}
            onSendTriage={sendTriage}
            dmThreads={dmThreads}
            onOpenThread={openDirectThread}
          />
        ))}
      {screen === 'people' && (
        <People t={t} lang={lang} userId={user.id} people={people} speakers={speakers} sponsors={sponsors} onMessage={openDirectThread} />
      )}
      {screen === 'profile' &&
        (showCheckout ? (
          <Checkout
            t={t}
            lang={lang}
            onBack={() => setShowCheckout(false)}
            rating={feedbackRating}
            setRating={setFeedbackRating}
            comments={feedbackComments}
            setComments={setFeedbackComments}
            saving={feedbackSaving}
            saved={feedbackSaved}
            onSaveOverall={saveOverallFeedback}
            sessionRatings={sessionRatings}
            onRateSession={rateSession}
          />
        ) : (
          <Profile
            t={t}
            name={pfName}
            pron={pfPron}
            bio={pfBio}
            tags={pfTags}
            visible={pfVisible}
            saving={pfSaving}
            designation={profile && profile.designation}
            isExisting={!!(profile && profile.display_name)}
            email={user.email}
            avatarUrl={pfAvatarUrl}
            avatarUploading={avatarUploading}
            onAvatarSelected={handleAvatarSelected}
            setName={setPfName}
            setPron={setPfPron}
            setBio={setPfBio}
            toggleTag={toggleProfileTag}
            toggleVisible={() => setPfVisible((v) => !v)}
            onSave={saveProfile}
            onSignOut={signOut}
            onOpenCheckout={() => setShowCheckout(true)}
          />
        ))}
        </>
      )}
      </div>

      <BottomNav screen={screen} onNavigate={navigate} t={t} chatUnread={chatUnread} />
    </div>
  );
}
