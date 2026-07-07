// WHOOP refresh tokens are single-use and rotate: each refresh returns a NEW
// access token AND a new refresh token, invalidating the old refresh token.
// A static env var can't survive that, so we persist the rotating refresh token
// (and cache the access token) in a writable store. Only the auth token is
// stored — activity data is still fetched live and never persisted.

const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const STORE_KEY = "token";
// refresh a little before actual expiry so an in-flight request never uses a
// token that expires mid-call
const EXPIRY_MARGIN_MS = 60_000;
const DEFAULT_TTL_S = 3600;
// Netlify Blobs is eventually consistent by default; read strongly so the
// re-read after a 400 reliably observes a token a concurrent request just
// rotated, instead of a stale snapshot.
const READ_OPTS = { type: "json", consistency: "strong" };

function isFresh(state, nowMs) {
  return (
    state &&
    state.accessToken &&
    state.accessTokenExpiry &&
    nowMs < state.accessTokenExpiry - EXPIRY_MARGIN_MS
  );
}

async function persist(store, value) {
  try {
    await store.setJSON(STORE_KEY, value);
  } catch {
    // Last-writer-wins (no CAS) — safe here because WHOOP's single-use tokens
    // make a genuine concurrent double-write practically impossible. Retry once:
    // the rotation already happened at WHOOP, so losing this write would brick
    // the integration until a manual re-seed.
    await store.setJSON(STORE_KEY, value);
  }
}

async function refresh({ store, env, fetch, now, refreshToken }) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.WHOOP_CLIENT_ID,
      client_secret: env.WHOOP_CLIENT_SECRET,
      scope: "offline",
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`token exchange failed: ${res.status} ${body}`.trim());
  }
  const json = await res.json();
  await persist(store, {
    refreshToken: json.refresh_token,
    accessToken: json.access_token,
    accessTokenExpiry: now() + (json.expires_in ?? DEFAULT_TTL_S) * 1000,
  });
  return json.access_token;
}

// Returns a valid WHOOP access token, refreshing (and persisting the rotated
// refresh token) only when the cached one is missing or near expiry.
// deps: { store, env, fetch, now } — injected so this is unit-testable.
export async function getAccessToken({ store, env, fetch, now = Date.now }) {
  const state = (await store.get(STORE_KEY, READ_OPTS)) || {};
  if (isFresh(state, now())) return state.accessToken;

  const refreshToken = state.refreshToken || env.WHOOP_REFRESH_TOKEN;
  try {
    return await refresh({ store, env, fetch, now, refreshToken });
  } catch (err) {
    // A concurrent request may have rotated the token out from under us
    // (single-use tokens race). Re-read (strongly) and reuse if it left a
    // fresh one.
    const latest = (await store.get(STORE_KEY, READ_OPTS)) || {};
    if (isFresh(latest, now())) return latest.accessToken;
    throw err;
  }
}
