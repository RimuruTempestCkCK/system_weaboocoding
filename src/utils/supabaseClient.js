import { createClient } from "@supabase/supabase-js";

// Retrieve URL & Key from Environment Variables or Local Storage
export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== "undefined" ? localStorage.getItem("weaboo_supabase_url") : null;
  const localKey = typeof window !== "undefined" ? localStorage.getItem("weaboo_supabase_anon_key") : null;

  const url = localUrl || envUrl || "";
  const anonKey = localKey || envKey || "";

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
    isFromEnv: Boolean(envUrl && envKey),
    isFromLocal: Boolean(localUrl && localKey)
  };
}

let credentials = getSupabaseCredentials();

export const isSupabaseConfigured = credentials.isConfigured;

export let supabase = isSupabaseConfigured
  ? createClient(credentials.url, credentials.anonKey)
  : null;

export function reinitSupabaseClient(url, key) {
  if (url && key) {
    localStorage.setItem("weaboo_supabase_url", url);
    localStorage.setItem("weaboo_supabase_anon_key", key);
  } else {
    localStorage.removeItem("weaboo_supabase_url");
    localStorage.removeItem("weaboo_supabase_anon_key");
  }
  
  credentials = getSupabaseCredentials();
  supabase = credentials.isConfigured
    ? createClient(credentials.url, credentials.anonKey)
    : null;
  
  return credentials;
}

