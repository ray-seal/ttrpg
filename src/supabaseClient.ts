import { createClient, SupabaseAuthAdapter } from "@neondatabase/neon-js";

// These are public branch-specific endpoints. Never put a database password
// or a storage secret in VITE_* variables.
const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

if (!authUrl || !dataApiUrl) {
  throw new Error(
    "Neon is not configured. Set VITE_NEON_AUTH_URL and VITE_NEON_DATA_API_URL."
  );
}

// neon-js provides the Supabase-compatible auth and PostgREST APIs used by
// the existing game, so the rest of the migration can happen incrementally.
export const supabase = createClient({
  auth: {
    adapter: SupabaseAuthAdapter(),
    url: authUrl,
  },
  dataApi: {
    url: dataApiUrl,
  },
});
