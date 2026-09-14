import { createClient } from '@supabase/supabase-js';

const ENV_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const STORAGE_URL_KEY = 'cwoc_sb_url';
const STORAGE_ANON_KEY = 'cwoc_sb_key';

export function hasEnvConfig() {
  return Boolean(ENV_URL && ENV_KEY);
}

export function getStoredConfig() {
  try {
    return {
      url: localStorage.getItem(STORAGE_URL_KEY) || '',
      key: localStorage.getItem(STORAGE_ANON_KEY) || '',
    };
  } catch {
    return { url: '', key: '' };
  }
}

export function storeConfig(url, key) {
  try {
    localStorage.setItem(STORAGE_URL_KEY, url);
    localStorage.setItem(STORAGE_ANON_KEY, key);
  } catch {
    // localStorage unavailable (private mode, etc.) — config just won't persist.
  }
}

export function clearStoredConfig() {
  try {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_ANON_KEY);
  } catch {
    // ignore
  }
}

export function resolveConfig() {
  if (hasEnvConfig()) return { url: ENV_URL, key: ENV_KEY, fromEnv: true };
  const stored = getStoredConfig();
  if (stored.url && stored.key) return { url: stored.url, key: stored.key, fromEnv: false };
  return null;
}

export function createSupabaseClient(url, key) {
  return createClient(url.trim(), key.trim());
}
