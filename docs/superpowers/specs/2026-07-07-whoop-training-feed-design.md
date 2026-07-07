# WHOOP Activity Feed → Training Log

**Date:** 2026-07-07
**Status:** Approved design, ready for planning

## Goal

Automatically surface WHOOP activities (workouts, basketball sessions, sauna,
recovery activities, etc.) on the Training tab. Show the last 30 days,
reverse-chronological, paginated with a "Load more" button. No lag.

## Key decision: live fetch, no storage

Because we only ever want the last 30 days, the serverless function requests
`workouts since 30 days ago` on every load. There is nothing to store and
nothing to purge — the 30-day window is enforced by the request itself. This
avoids a database, a cron job, and cleanup logic entirely.

No-lag is achieved the same way the existing Spotify block achieves it:
serverless function + CDN cache (`s-maxage`) + a client-side skeleton loader.

## WHOOP API facts (confirmed July 2026)

- **Endpoint:** `GET /v2/activity/workout` (collection) returns individual
  workouts, each with `sport_id` + `sport_name`. Supports `start`/`end` time
  filters, `limit`, and cursor pagination via `next_token`.
- **Activity types:** basketball, weightlifting/strength, HIIT, yoga, and
  passive/wellness items. Sauna is Sport ID 233.
- **Auth:** OAuth 2.0. Register an app in the WHOOP Developer Dashboard.
  Scopes needed: `read:workout` + `offline` (offline is required to receive a
  refresh token). Auth URL `https://api.prod.whoop.com/oauth/oauth2/auth`,
  token URL `https://api.prod.whoop.com/oauth/oauth2/token`.
- **Rate limits:** 100 req/min, 10,000 req/day — irrelevant at personal-site
  traffic.
- **Caveats:** exact access-token TTL isn't officially published (~1hr; we
  refresh per-request so it doesn't matter). WHOOP requires app approval for
  *public* apps, but testing under your own account works without it, which is
  all a single-user personal site needs.

## Architecture

Mirror the existing Spotify integration (`netlify/functions/spotify.mjs` +
`src/components/SpotifyBlock.jsx`).

### New files

1. **`scripts/whoop-auth.mjs`** — one-time local script. Spins up a localhost
   callback server, opens the WHOOP consent URL with scopes
   `read:workout offline`, captures the authorization code, exchanges it for a
   refresh token, and prints `WHOOP_REFRESH_TOKEN`. Mirror of the existing
   Spotify auth script referenced in `.env.example`.

2. **`netlify/functions/whoop.mjs`** — serverless endpoint at `/api/whoop`.
   - Exchanges `WHOOP_REFRESH_TOKEN` for an access token (same flow as
     `spotify.mjs`'s `getAccessToken`).
   - Calls `GET /v2/activity/workout?start=<30d ago ISO>&limit=25`, following
     `next_token` server-side until the 30-day window is exhausted (a handful
     of requests).
   - Returns trimmed JSON `{ activities: [...] }` with
     `Cache-Control: public, s-maxage=300` (5-minute CDN cache).
   - On upstream failure returns `502 { error: "upstream_error" }`.

3. **`netlify/functions/lib/whoop-trim.mjs`** (+ `whoop-trim.test.mjs`) — pure
   function mapping raw WHOOP payload → clean records. Unit-tested core.
   Each record:
   ```
   { id, sport, start, durationMin, strain, avgHr, calories }
   ```
   - `sport` from `sport_name`, with a small sport-id → name fallback map.
   - `durationMin` from `end − start`.
   - `calories` = `kilojoule ÷ 4.184`, rounded.
   - `strain` / `avgHr` from the workout `score` object.
   - Sorted newest-first.

4. **`src/components/WhoopFeed.jsx`** — replaces the manual `log` on the
   Training page.
   - Fetches `/api/whoop` once on mount.
   - Shows a skeleton while loading (reuse the site's existing skeleton idiom).
   - Renders rich stat cards: sport · duration · day strain · avg HR ·
     calories.
   - Reverse-chronological. A "Load more" button reveals the next page
     **client-side** (fetch-once, slice locally — no extra requests). Page size
     ~8.
   - On error, shows a quiet "Activity feed unavailable" line rather than a
     blank section (it is now the page centerpiece, so it should not silently
     vanish the way the optional Spotify block does).

### Changed files

- **`netlify.toml`** — add redirect `/api/whoop` → `/.netlify/functions/whoop`.
- **`.env.example`** — add `WHOOP_CLIENT_ID`, `WHOOP_CLIENT_SECRET`,
  `WHOOP_REFRESH_TOKEN`.
- **`src/data/training.js`** — delete the `log` array. **Keep** `lede`, `prs`,
  `goal`, and `photos` (these are manual highlights WHOOP cannot source — PRs
  are one-rep maxes, not sessions).
- **`src/pages/Training.jsx`** — replace the `<ol>` log block with
  `<WhoopFeed />`. Keep the PR stat cards and goal bar unchanged.

## Data flow

1. Client mounts `WhoopFeed`, fetches `/api/whoop`.
2. Netlify function refreshes the access token, pages through the last 30 days
   of workouts, trims them, returns the array (CDN-cached 5 min).
3. Client holds the full array, renders the first page of cards, "Load more"
   slices in the next page locally.

## Error handling

- Function: `502` + `{ error: "upstream_error" }` on token or fetch failure;
  errors logged via `console.error`.
- Client: distinguishes loading (skeleton), loaded-empty ("No activities in
  the last 30 days"), and failed ("Activity feed unavailable").

## Testing

Vitest on `whoop-trim.mjs` with a sample WHOOP payload:
- duration math (end − start → minutes)
- kJ → kcal conversion
- `sport_name` passthrough and sport-id fallback mapping
- empty-payload handling
- newest-first ordering

Matches the existing `netlify/functions/lib/trim.test.mjs` approach.

## Out of scope (YAGNI)

- No database / persistence / purge (window is a query filter).
- No category filter UI (feed shows everything).
- No recovery/sleep/strain-trend dashboards — workouts only.
- No webhooks (poll-on-load is sufficient; nothing to keep in sync).
