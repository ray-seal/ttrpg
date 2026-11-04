# Neon backend for Hogwarts TTRPG

The Neon migration is being developed on the Git branch `neon-migration` and Neon branch `rpg-migration`. The production app and original Supabase project remain untouched until the preview is tested.

## Services

- Managed Neon Auth (Better Auth) with the Supabase-compatible adapter.
- Neon Data API for the existing PostgREST-style `.from()` queries.
- Private Neon Object Storage bucket: `hogwarts-player-assets`.
- PostgreSQL row-level security for character ownership and shared Hogwarts data.
- Atomic, idempotent house-point awards and a permanent ledger.
- House Cup seasons, winner history, announcements and lifetime achievement thresholds.

## Local configuration

Copy `.env.example` to `.env.local`. The included URLs target the isolated migration branch:

- `VITE_NEON_AUTH_URL`
- `VITE_NEON_DATA_API_URL`

These are public endpoints, not secrets. Never put a database connection string, storage secret, or service credential in a `VITE_*` variable.

Install dependencies with `npm install`, then run `npm run dev`. The project uses `@neondatabase/neon-js` and its `SupabaseAuthAdapter()` so existing `supabase.auth` and `supabase.from()` call sites can be migrated incrementally.

## Database migrations

Apply the SQL files in `database/migrations` in filename order. They are intended for the dedicated Hogwarts RPG Neon project. Do not apply them to Speakly, CardBuddy, or any other database.

The browser role can only read shared standings, seasons, achievements and announcements. It can only read or modify the signed-in user's own character, inventory and learned spells. House points are not writable directly. The `apply_house_points` database function validates the signed-in user, their character and house, the allowed quest and one completion per character/quest before changing the shared score.

House Cup lifecycle functions are administrative-only. A trusted operator starts/activates/finalizes seasons. A unique winner creates a permanent winner record for every player in that house and updates the lifetime 1/5/10-win achievements. Ties are recorded without awarding a winner.

## Live updates

The Neon Data API does not provide Supabase Realtime channels. The current shared House Cup board polls every 15 seconds. This keeps the feature simple and avoids a permanently open connection; a Neon Function with SSE/WebSockets can replace polling later if needed.

## Migration limits

The original Supabase project referenced by the source code is not currently accessible through the connected Supabase account. No player data or auth accounts have been copied. Supabase password hashes and active sessions are not assumed to transfer; existing players will need to register on Neon unless a supported user migration is explicitly arranged.

The storage bucket exists, but no storage credentials are committed to the repository. A server-side upload/signing flow should be added only when the game actually needs player uploads.
