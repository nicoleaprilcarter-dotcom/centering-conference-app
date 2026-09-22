import { useCallback, useEffect, useRef, useState } from 'react';
import {
  resolveConfig,
  storeConfig,
  clearStoredConfig,
  createSupabaseClient,
} from './lib/supabaseClient';
import { POLL_QUESTION_ID, SESSIONS } from './data/sessions';
import { TRANSLATIONS } from './data/translations';
import { askAssistant } from './lib/ai';
import { isSessionLiveNow } from './lib/helpers';

import Setup from './screens/Setup';
import SignIn from './screens/SignIn';
import Agenda from './screens/Agenda';
import SessionDetail from './screens/SessionDetail';
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

function groupSessionFiles(rows) {
  const map = {};
  (rows || []).forEach((row) => {
    if (!map[row.session_id]) map[row.session_id] = [];
    map[row.session_id].push({
      id: row.id,
      title: row.title,
      fileUrl: row.file_url,
      thumbnailUrl: row.thumbnail_url,
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
  const [sessionFiles, setSessionFiles] = useState({});
  const [sessionNotes, setSessionNotes] = useState({});
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionQuestionVotes, setSessionQuestionVotes] = useState([]);
  const [sessionRecaps, setSessionRecaps] = useState({});
  const [sessionDetails, setSessionDetails] = useState({});
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [aiChatMsgs, setAiChatMsgs] = useState([]);
  const [aiChatSending, setAiChatSending] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiRecLoading, setAiRecLoading] = useState(false);
  const [aiRecError, setAiRecError] = useState('');
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

  const [blocks, setBlocks] = useState([]);
  const [reports, setReports] = useState([]);

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
      const [sv, ms, pp, vt, wd, pl, lb, dm, sp, sc, wr, tr, cf, sf, sn, sh, sfl, sno, sq, sqv, src, sdt, blk, rpt] = await Promise.all([
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
        c.from('session_files').select('*').order('sort'),
        c.from('session_notes').select('*').eq('user_id', uid),
        c.from('session_questions').select('*').eq('session_id', sid).order('created_at'),
        c.from('session_question_votes').select('*'),
        c.from('session_recaps').select('*'),
        c.from('session_details').select('*'),
        c.from('blocks').select('*').eq('blocker_id', uid),
        c.from('reports').select('*').order('created_at', { ascending: false }),
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
      setSessionFiles(groupSessionFiles(sfl.data));
      const notesMap = {};
      (sno.data || []).forEach((r) => {
        notesMap[r.session_id] = r.note;
      });
      setSessionNotes(notesMap);
      setSessionQuestions(sq.data || []);
      setSessionQuestionVotes(sqv.data || []);
      const recapMap = {};
      (src.data || []).forEach((r) => {
        recapMap[r.session_id] = r;
      });
      setSessionRecaps(recapMap);
      const detailMap = {};
      (sdt.data || []).forEach((r) => {
        detailMap[r.session_id] = r;
      });
      setSessionDetails(detailMap);
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
      setBlocks(blk.data || []);
      setReports(rpt.data || []);
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
      if (what === 'sessionFiles') {
        const { data } = await client.from('session_files').select('*').order('sort');
        setSessionFiles(groupSessionFiles(data));
      }
      if (what === 'sessionNotes' && user) {
        const { data } = await client.from('session_notes').select('*').eq('user_id', user.id);
        const notesMap = {};
        (data || []).forEach((r) => {
          notesMap[r.session_id] = r.note;
        });
        setSessionNotes(notesMap);
      }
      if (what === 'sessionQuestions') {
        const { data } = await client.from('session_questions').select('*').eq('session_id', sid).order('created_at');
        setSessionQuestions(data || []);
      }
      if (what === 'sessionQuestionVotes') {
        const { data } = await client.from('session_question_votes').select('*');
        setSessionQuestionVotes(data || []);
      }
      if (what === 'sessionRecaps') {
        const { data } = await client.from('session_recaps').select('*');
        const recapMap = {};
        (data || []).forEach((r) => {
          recapMap[r.session_id] = r;
        });
        setSessionRecaps(recapMap);
      }
      if (what === 'sessionDetails') {
        const { data } = await client.from('session_details').select('*');
        const detailMap = {};
        (data || []).forEach((r) => {
          detailMap[r.session_id] = r;
        });
        setSessionDetails(detailMap);
      }
      if (what === 'waitingRoomMessages') {
        const { data } = await client.from('messages').select('*').eq('session_id', WAITING_ROOM_SESSION_ID).order('created_at');
        setWaitingRoomMsgs(data || []);
      }
      if (what === 'triageMessages') {
        const { data } = await client.from('messages').select('*').eq('session_id', TRIAGE_SESSION_ID).order('created_at');
        setTriageMsgs(data || []);
      }
      if (what === 'blocks' && user) {
        const { data } = await client.from('blocks').select('*').eq('blocker_id', user.id);
        setBlocks(data || []);
      }
      if (what === 'reports') {
        const { data } = await client.from('reports').select('*').order('created_at', { ascending: false });
        setReports(data || []);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_files' }, () => reload('sessionFiles'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_notes' }, () => reload('sessionNotes'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_questions' }, () => reload('sessionQuestions'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_question_votes' }, () => reload('sessionQuestionVotes'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_recaps' }, () => reload('sessionRecaps'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_details' }, () => reload('sessionDetails'))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => reload('reports'))
      .subscribe();
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

  const blockedIdSet = new Set(blocks.map((b) => b.blocked_id));
  const visiblePeople = people.filter((p) => !blockedIdSet.has(p.id));
  const visiblePledges = pledges.filter((p) => !blockedIdSet.has(p.user_id));
  const visibleMsgs = msgs.filter((m) => !blockedIdSet.has(m.user_id));
  const visibleLobbyMsgs = lobbyMsgs.filter((m) => !blockedIdSet.has(m.user_id));
  const visibleWaitingRoomMsgs = waitingRoomMsgs.filter((m) => !blockedIdSet.has(m.user_id));
  const visibleTriageMsgs = triageMsgs.filter((m) => !blockedIdSet.has(m.user_id));
  const visibleDmThreads = dmThreads.filter((th) => !blockedIdSet.has(th.userId));
  const blockedPeople = people
    .filter((p) => blockedIdSet.has(p.id))
    .map((p) => ({ id: p.id, name: p.display_name || t.attendee }));

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

  const reportContent = async (targetType, targetId, targetOwnerId, reason, details) => {
    const { error: err } = await client.from('reports').insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: String(targetId),
      target_owner: targetOwnerId || null,
      reason,
      details: details || '',
    });
    if (err) setError('Report not sent. ' + err.message);
  };

  const blockUser = async (blockedId) => {
    if (!blockedId) return;
    const { error: err } = await client.from('blocks').insert({ blocker_id: user.id, blocked_id: blockedId });
    if (err) {
      setError('Could not block. ' + err.message);
      return;
    }
    reload('blocks');
  };

  const unblockUser = async (blockedId) => {
    await client.from('blocks').delete().eq('blocker_id', user.id).eq('blocked_id', blockedId);
    reload('blocks');
  };

  const resolveReport = async (reportId, status) => {
    await client.from('reports').update({ status }).eq('id', reportId);
    reload('reports');
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

  const saveNote = async (sessionId, note) => {
    setSessionNotes((s) => ({ ...s, [sessionId]: note }));
    const { error: err } = await client
      .from('session_notes')
      .upsert({ session_id: sessionId, user_id: user.id, note, updated_at: new Date().toISOString() }, { onConflict: 'session_id,user_id' });
    if (err) setError('Note not saved. ' + err.message);
  };

  const askQuestion = async (sessionId, body) => {
    const v = body.trim();
    if (!v) return;
    const { error: err } = await client.from('session_questions').insert({ session_id: sessionId, user_id: user.id, body: v.slice(0, 500) });
    if (err) setError('Question not sent. ' + err.message);
    reload('sessionQuestions');
  };

  const toggleQuestionVote = async (questionId) => {
    const already = sessionQuestionVotes.some((v) => v.question_id === questionId && v.user_id === user.id);
    const { error: err } = already
      ? await client.from('session_question_votes').delete().eq('question_id', questionId).eq('user_id', user.id)
      : await client.from('session_question_votes').insert({ question_id: questionId, user_id: user.id });
    if (err) setError('Vote not saved. ' + err.message);
    reload('sessionQuestionVotes');
  };

  const answerQuestion = async (questionId, answerText) => {
    const { error: err } = await client.from('session_questions').update({ answer: answerText, answered: true }).eq('id', questionId);
    if (err) setError('Answer not saved. ' + err.message);
    reload('sessionQuestions');
  };

  const generateRecap = async (sessionId, sessionTitle, transcriptMsgs) => {
    const transcript = transcriptMsgs.map((m) => `${m.user_id === user.id ? pfName : 'Attendee'}: ${m.body}`).join('\n');
    try {
      const result = await askAssistant(client, { mode: 'recap', sessionTitle, transcript });
      const { error: err } = await client.from('session_recaps').upsert({
        session_id: sessionId,
        summary_en: result.summary_en,
        summary_es: result.summary_es,
        generated_at: new Date().toISOString(),
      });
      if (err) setError('Recap generated but not saved. ' + err.message);
      reload('sessionRecaps');
    } catch (e) {
      setError('Could not generate recap. ' + e.message);
    }
  };

  const sendAiChat = async (message) => {
    const history = aiChatMsgs.map((m) => ({ role: m.role, content: m.content }));
    setAiChatMsgs((m) => [...m, { role: 'user', content: message }]);
    setAiChatSending(true);
    try {
      const result = await askAssistant(client, { mode: 'chat', message, history, lang });
      setAiChatMsgs((m) => [...m, { role: 'assistant', content: result.reply }]);
    } catch (e) {
      setAiChatMsgs((m) => [...m, { role: 'assistant', content: e.message }]);
    }
    setAiChatSending(false);
  };

  const uploadSessionFile = async (sessionId, title, file) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('That file is too large. Please choose one under 20MB.');
      return;
    }
    const ext = (file.name.split('.').pop() || 'file').toLowerCase();
    const path = `${sessionId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timed out. Check your connection and try again.')), ms));
    try {
      const { error: upErr } = await Promise.race([
        client.storage.from('session-files').upload(path, file, { cacheControl: '3600' }),
        timeout(45000),
      ]);
      if (upErr) {
        setError('File not uploaded. ' + upErr.message);
        return;
      }
      const { data } = client.storage.from('session-files').getPublicUrl(path);
      const isImage = file.type.startsWith('image/');
      const { error: insErr } = await client.from('session_files').insert({
        session_id: sessionId,
        title: title.trim() || file.name,
        file_url: data.publicUrl,
        thumbnail_url: isImage ? data.publicUrl : null,
      });
      if (insErr) setError('File uploaded but not saved. ' + insErr.message);
      reload('sessionFiles');
    } catch (e) {
      setError(e.message || 'File not uploaded. Something went wrong.');
    }
  };

  const deleteSessionFile = async (fileId) => {
    const { error: err } = await client.from('session_files').delete().eq('id', fileId);
    if (err) setError('Could not remove that file. ' + err.message);
    reload('sessionFiles');
  };

  const fetchRecommendation = async () => {
    setAiRecLoading(true);
    setAiRecError('');
    try {
      const interests = Object.keys(pfTags)
        .filter((k) => pfTags[k])
        .map((k) => TRANSLATIONS.en.interestTags[k]);
      const result = await askAssistant(client, { mode: 'recommend', interests, bio: pfBio, lang });
      setAiRecommendation(result);
    } catch (e) {
      setAiRecError(e.message);
    }
    setAiRecLoading(false);
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
    setViewingSessionId(null);
    setScreen(key);
  };

  const saveSessionDetail = async (sessionId, fields) => {
    const { error: err } = await client.from('session_details').upsert({
      session_id: sessionId,
      ...fields,
      updated_at: new Date().toISOString(),
    });
    if (err) setError('Details not saved. ' + err.message);
    reload('sessionDetails');
  };

  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const currentLiveSession = SESSIONS.find((s) => isSessionLiveNow(s, nowMin));

  return (
    <div className="app-shell">
      <Header
        name={pfName}
        avatarUrl={pfAvatarUrl}
        hideAvatar={screen === 'profile'}
        live={!!currentLiveSession}
        liveLabel={t.live}
        offlineLabel={t.offline}
        langToggle={t.langToggle}
        onToggleLang={toggleLang}
        onAvatarClick={() => navigate('profile')}
        showBack={screen !== 'agenda' || !!viewingPerson || !!viewingSessionId}
        onBack={() => navigate('agenda')}
        compact={screen !== 'agenda' || !!viewingPerson || !!viewingSessionId}
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
          onReport={viewingPerson.userId && viewingPerson.userId !== user.id ? reportContent : null}
          onBlock={viewingPerson.userId && viewingPerson.userId !== user.id ? blockUser : null}
        />
      ) : viewingSessionId ? (
        <SessionDetail
          t={t}
          lang={lang}
          session={SESSIONS.find((s) => s.id === viewingSessionId)}
          isLive={viewingSessionId === (currentLiveSession && currentLiveSession.id)}
          hosts={sessionHosts[viewingSessionId] || []}
          files={sessionFiles[viewingSessionId] || []}
          detail={sessionDetails[viewingSessionId]}
          recap={sessionRecaps[viewingSessionId]}
          isModerator={!!(profile && profile.is_moderator)}
          onBack={() => setViewingSessionId(null)}
          onOpenPerson={openPersonProfile}
          onJoinLive={() => {
            setViewingSessionId(null);
            setScreen('session');
          }}
          onSaveDetail={saveSessionDetail}
        />
      ) : (
        <>
      {screen === 'agenda' && (
        <Agenda
          t={t}
          lang={lang}
          name={pfName}
          saved={saved}
          onOpenSession={(id) => setViewingSessionId(id)}
          onToggleStar={toggleStar}
          sessionCheckins={sessionCheckins}
          onToggleSessionCheckIn={toggleSessionCheckIn}
          sessionHosts={sessionHosts}
          sessionFiles={sessionFiles}
          onOpenPerson={openPersonProfile}
          sessionNotes={sessionNotes}
          onSaveNote={saveNote}
          sessionRecaps={sessionRecaps}
          checkedInAt={checkedInAt}
          aiRecommendation={aiRecommendation}
          aiRecLoading={aiRecLoading}
          aiRecError={aiRecError}
          onFetchRecommendation={fetchRecommendation}
        />
      )}
      {screen === 'resources' && (
        <Resources
          t={t}
          lang={lang}
          checkedInAt={checkedInAt}
          onCheckIn={checkIn}
          onUndoCheckIn={undoCheckIn}
          userId={user.id}
          isModerator={!!(profile && profile.is_moderator)}
          sessionFiles={sessionFiles}
          onUploadFile={uploadSessionFile}
          onDeleteFile={deleteSessionFile}
          reports={reports}
          people={people}
          onResolveReport={resolveReport}
        />
      )}
      {screen === 'session' && (
        <Session
          t={t}
          lang={lang}
          userId={user.id}
          myName={pfName}
          myAvatarUrl={pfAvatarUrl}
          messages={visibleMsgs}
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
          questions={sessionQuestions}
          questionVotes={sessionQuestionVotes}
          onAskQuestion={(body) => askQuestion(sid, body)}
          onToggleQuestionVote={toggleQuestionVote}
          onAnswerQuestion={answerQuestion}
          isModerator={!!(profile && profile.is_moderator)}
          recap={sessionRecaps[sid]}
          onGenerateRecap={() => generateRecap(sid, 'Signature Fireside Chat', msgs)}
          onReport={reportContent}
          onBlock={blockUser}
        />
      )}
      {screen === 'wall' && (
        <Wall t={t} userId={user.id} pledges={visiblePledges} draft={pledgeDraft} setDraft={setPledgeDraft} onPost={postPledge} onReport={reportContent} onBlock={blockUser} />
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
            onReport={reportContent}
            onBlock={blockUser}
          />
        ) : (
          <Chat
            t={t}
            userId={user.id}
            myName={pfName}
            myAvatarUrl={pfAvatarUrl}
            people={people}
            waitingRoomMsgs={visibleWaitingRoomMsgs}
            waitingRoomDraft={waitingRoomDraft}
            setWaitingRoomDraft={setWaitingRoomDraft}
            onSendWaitingRoom={sendWaitingRoom}
            lobbyMsgs={visibleLobbyMsgs}
            lobbyDraft={lobbyDraft}
            setLobbyDraft={setLobbyDraft}
            onSendLobby={sendLobby}
            triageMsgs={visibleTriageMsgs}
            triageDraft={triageDraft}
            setTriageDraft={setTriageDraft}
            onSendTriage={sendTriage}
            dmThreads={visibleDmThreads}
            onOpenThread={openDirectThread}
            aiChatMsgs={aiChatMsgs}
            aiChatSending={aiChatSending}
            onSendAiChat={sendAiChat}
            onReport={reportContent}
            onBlock={blockUser}
          />
        ))}
      {screen === 'people' && (
        <People t={t} lang={lang} userId={user.id} people={visiblePeople} speakers={speakers} sponsors={sponsors} onMessage={openDirectThread} onReport={reportContent} onBlock={blockUser} />
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
            blockedPeople={blockedPeople}
            onUnblock={unblockUser}
          />
        ))}
        </>
      )}
      </div>

      <BottomNav screen={screen} onNavigate={navigate} t={t} chatUnread={chatUnread} />
    </div>
  );
}
