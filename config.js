/* ------------------------------------------------------------------
   config.js — fill these two values in, commit, redeploy.

   The anon key is SAFE to commit publicly. It is a client-side key and
   Supabase row-level-security decides what it may do (see supabase/schema.sql).
   Never put the `service_role` key in this file — that one bypasses RLS.

   Leave both blank and the dashboard still runs, but it falls back to
   browser-only storage (this device only, not shared with the team) and
   shows an amber banner saying so.
   ------------------------------------------------------------------ */

export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

/* Names offered in the "saving as" dropdown. Edit freely. */
export const EDITORS = ['Krish', 'Vikash', 'Prity', 'Divjot', 'Dilli', 'Khalid', 'Nancy'];
