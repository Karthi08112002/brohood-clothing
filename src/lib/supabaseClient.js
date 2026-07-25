import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True only once real project credentials are supplied via .env.
// Until then, src/lib/api.js transparently falls back to local demo data
// so every page stays fully functional out of the box.
export const isSupabaseConfigured = Boolean(
  url && anonKey && !url.includes('your-project-ref')
);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
