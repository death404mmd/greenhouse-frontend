import { createClient } from "@supabase/supabase-js";

// Uses the publishable/anon key here - this one is safe to expose in the browser.
// Never put the secret/service_role key in frontend code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Session lives only for this browser tab/window - closing it signs you
    // out, instead of staying signed in forever like the default behavior.
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
