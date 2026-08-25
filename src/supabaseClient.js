import { createClient } from "@supabase/supabase-js";

// Uses the publishable/anon key here - this one is safe to expose in the browser.
// Never put the secret/service_role key in frontend code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Session lives only for this browser tab/window - closing it signs you out.
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// How long a signed-in session is allowed to stay open, even if the tab is
// never closed. App.jsx checks this on load and periodically, and signs the
// person out once it's exceeded - so "staying logged in forever" can't happen.
export const MAX_SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours
const SESSION_STARTED_KEY = "greenhouse_session_started_at";

export function markSessionStart() {
  if (!window.sessionStorage.getItem(SESSION_STARTED_KEY)) {
    window.sessionStorage.setItem(SESSION_STARTED_KEY, String(Date.now()));
  }
}

export function clearSessionStart() {
  window.sessionStorage.removeItem(SESSION_STARTED_KEY);
}

export function isSessionExpired() {
  const startedAt = Number(window.sessionStorage.getItem(SESSION_STARTED_KEY));
  if (!startedAt) return false;
  return Date.now() - startedAt > MAX_SESSION_MS;
}
