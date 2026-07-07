# WHOOP Activity Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the manual Training-page log with a live, paginated feed of the last 30 days of WHOOP activities.

**Architecture:** Clone the existing Spotify integration. A Netlify serverless function (`/api/whoop`) exchanges a stored OAuth refresh token for an access token, pages through the last 30 days of `GET /v2/activity/workout`, trims each record via a unit-tested pure function, and returns JSON with a 5-minute CDN cache. A React component fetches once and paginates client-side with a "Load more" button. No database, no cron, no purge — the 30-day window is a query filter.

**Tech Stack:** Vite + React 18, framer-motion, Tailwind, Netlify Functions (Node 20, ESM `.mjs`), Vitest. WHOOP API v2, OAuth 2.0.

**Spec:** `docs/superpowers/specs/2026-07-07-whoop-training-feed-design.md`

---

## File Structure

**Create:**
- `netlify/functions/lib/whoop-trim.mjs` — pure payload→record mapper (tested core)
- `netlify/functions/lib/whoop-trim.test.mjs` — Vitest tests for the mapper
- `netlify/functions/whoop.mjs` — serverless endpoint at `/api/whoop`
- `scripts/whoop-auth.mjs` — one-time local refresh-token helper
- `src/components/WhoopFeed.jsx` — client feed component

**Modify:**
- `netlify.toml` — add `/api/whoop` redirect
- `.env.example` — add three `WHOOP_*` vars
- `src/data/training.js` — delete the `log` array (keep `lede`, `prs`, `goal`, `photos`)
- `src/pages/Training.jsx` — swap the `<ol>` log for `<WhoopFeed />`

---

## Task 1: WHOOP payload trimmer (pure, TDD)

**Files:**
- Create: `netlify/functions/lib/whoop-trim.mjs`
- Test: `netlify/functions/lib/whoop-trim.test.mjs`

A WHOOP workout record looks like:
```json
{
  "id": "1043",
  "start": "2026-07-06T14:00:00.000Z",
  "end": "2026-07-06T15:12:00.000Z",
  "sport_id": 233,
  "sport_name": "Sauna",
  "score_state": "SCORED",
  "score": {
    "strain": 8.4,
    "average_heart_rate": 132,
    "max_heart_rate": 170,
    "kilojoule": 2510.0
  }
}
```
`score` is `null` when `score_state !== "SCORED"`. `sport_name` may be absent on older records, so fall back to a sport-id map, then to `"Activity"`.

- [ ] **Step 1: Write the failing test**

```js
// netlify/functions/lib/whoop-trim.test.mjs
import { describe, it, expect } from "vitest";
import { trimWorkouts, SPORT_NAMES } from "./whoop-trim.mjs";

const scored = {
  id: "1043",
  start: "2026-07-06T14:00:00.000Z",
  end: "2026-07-06T15:12:00.000Z",
  sport_id: 233,
  sport_name: "Sauna",
  score_state: "SCORED",
  score: { strain: 8.4, average_heart_rate: 132, max_heart_rate: 170, kilojoule: 2510 },
};

describe("trimWorkouts", () => {
  it("maps a scored workout to the trimmed shape", () => {
    expect(trimWorkouts({ records: [scored] })).toEqual([
      {
        id: "1043",
        sport: "Sauna",
        start: "2026-07-06T14:00:00.000Z",
        durationMin: 72,
        strain: 8.4,
        avgHr: 132,
        calories: 600, // 2510 / 4.184 = 599.9 -> 600
      },
    ]);
  });

  it("returns null stats for an unscored workout", () => {
    const pending = { ...scored, score_state: "PENDING_SCORE", score: null };
    const out = trimWorkouts({ records: [pending] });
    expect(out[0].strain).toBeNull();
    expect(out[0].avgHr).toBeNull();
    expect(out[0].calories).toBeNull();
    expect(out[0].durationMin).toBe(72); // duration still computable
  });

  it("falls back to the sport-id map when sport_name is missing", () => {
    const noName = { ...scored, sport_name: undefined };
    expect(trimWorkouts({ records: [noName] })[0].sport).toBe(SPORT_NAMES[233]);
  });

  it("falls back to 'Activity' for an unknown sport with no name", () => {
    const unknown = { ...scored, sport_id: 99999, sport_name: undefined };
    expect(trimWorkouts({ records: [unknown] })[0].sport).toBe("Activity");
  });

  it("sorts newest-first", () => {
    const older = { ...scored, id: "1", start: "2026-07-01T10:00:00.000Z", end: "2026-07-01T11:00:00.000Z" };
    const newer = { ...scored, id: "2", start: "2026-07-05T10:00:00.000Z", end: "2026-07-05T11:00:00.000Z" };
    const out = trimWorkouts({ records: [older, newer] });
    expect(out.map((w) => w.id)).toEqual(["2", "1"]);
  });

  it("returns [] for a missing records array", () => {
    expect(trimWorkouts({})).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run netlify/functions/lib/whoop-trim.test.mjs`
Expected: FAIL — `Failed to resolve import "./whoop-trim.mjs"` / `trimWorkouts is not a function`.

- [ ] **Step 3: Write the minimal implementation**

```js
// netlify/functions/lib/whoop-trim.mjs

// WHOOP Sport ID -> name fallback (used only when sport_name is absent).
// Source: WHOOP official Sport ID table. Extend as needed.
export const SPORT_NAMES = {
  0: "Running",
  1: "Cycling",
  16: "Baseball",
  18: "Basketball",
  45: "Weightlifting",
  233: "Sauna",
  262: "Ice Bath",
};

const KJ_PER_KCAL = 4.184;

function shape(w) {
  if (!w?.id || !w.start || !w.end) return null;
  const durationMin = Math.round((new Date(w.end) - new Date(w.start)) / 60000);
  const sport = w.sport_name || SPORT_NAMES[w.sport_id] || "Activity";
  const score = w.score_state === "SCORED" ? w.score : null;
  return {
    id: String(w.id),
    sport,
    start: w.start,
    durationMin,
    strain: score ? score.strain : null,
    avgHr: score ? score.average_heart_rate : null,
    calories: score?.kilojoule != null ? Math.round(score.kilojoule / KJ_PER_KCAL) : null,
  };
}

export function trimWorkouts(payload) {
  return (payload.records ?? [])
    .map(shape)
    .filter(Boolean)
    .sort((a, b) => new Date(b.start) - new Date(a.start));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run netlify/functions/lib/whoop-trim.test.mjs`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/lib/whoop-trim.mjs netlify/functions/lib/whoop-trim.test.mjs
git commit -m "Add WHOOP workout trimmer with tests"
```

---

## Task 2: Netlify function `/api/whoop`

**Files:**
- Create: `netlify/functions/whoop.mjs`

Mirrors `netlify/functions/spotify.mjs`. WHOOP token refresh uses standard OAuth2 form params (client_id/client_secret in the body, not Basic auth), and must include `scope=offline` to keep the refresh token valid. The workout collection is cursor-paginated via `next_token`; page until exhausted or a safety cap.

- [ ] **Step 1: Write the function**

```js
// netlify/functions/whoop.mjs
import { trimWorkouts } from "./lib/whoop-trim.mjs";

const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const WORKOUT_URL = "https://api.prod.whoop.com/developer/v2/activity/workout";
const WINDOW_DAYS = 30;
const PAGE_LIMIT = 25;
const MAX_PAGES = 10; // safety cap: 250 workouts / 30 days is far more than real

async function getAccessToken() {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.WHOOP_REFRESH_TOKEN,
      client_id: process.env.WHOOP_CLIENT_ID,
      client_secret: process.env.WHOOP_CLIENT_SECRET,
      scope: "offline",
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  return (await res.json()).access_token;
}

async function fetchAllWorkouts(token) {
  const start = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString();
  const records = [];
  let nextToken = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(WORKOUT_URL);
    url.searchParams.set("start", start);
    url.searchParams.set("limit", String(PAGE_LIMIT));
    if (nextToken) url.searchParams.set("nextToken", nextToken);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`whoop responded ${res.status}`);
    const json = await res.json();
    records.push(...(json.records ?? []));
    nextToken = json.next_token;
    if (!nextToken) break;
  }
  return records;
}

export default async function handler() {
  try {
    const token = await getAccessToken();
    const records = await fetchAllWorkouts(token);
    const activities = trimWorkouts({ records });
    return new Response(JSON.stringify({ activities }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300",
      },
    });
  } catch (err) {
    console.error("whoop function error:", err);
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

- [ ] **Step 2: Sanity-check that the file parses**

Run: `node --check netlify/functions/whoop.mjs`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/whoop.mjs
git commit -m "Add WHOOP serverless function fetching last 30 days of workouts"
```

---

## Task 3: One-time auth helper

**Files:**
- Create: `scripts/whoop-auth.mjs`

Mirrors `scripts/spotify-auth.mjs`. Prints `WHOOP_REFRESH_TOKEN` after browser consent.

- [ ] **Step 1: Write the script**

```js
// scripts/whoop-auth.mjs
// One-time helper: prints the WHOOP_REFRESH_TOKEN for Netlify env vars.
//
// Prereqs: create an app at https://developer.whoop.com with redirect URI
// http://127.0.0.1:8889/callback and scopes read:workout offline, then run:
//   WHOOP_CLIENT_ID=xxx WHOOP_CLIENT_SECRET=yyy node scripts/whoop-auth.mjs
// and open the printed URL in a browser.
import http from "node:http";

const id = process.env.WHOOP_CLIENT_ID;
const secret = process.env.WHOOP_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET first.");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8889/callback";
const scopes = "read:workout offline";
const state = "whoop-auth-" + id.slice(0, 6); // WHOOP requires a state param
console.log(
  "Open this URL in your browser:\n\n" +
    `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${id}` +
    `&response_type=code&redirect_uri=${encodeURIComponent(redirect)}` +
    `&scope=${encodeURIComponent(scopes)}&state=${state}\n`
);

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, redirect);
    if (url.pathname !== "/callback") return res.end();
    const code = url.searchParams.get("code");
    if (!code) {
      console.error("Authorization failed or was denied.");
      res.end("Failed — check your terminal.");
      return process.exit(1);
    }
    const r = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect,
        client_id: id,
        client_secret: secret,
      }),
    });
    const json = await r.json();
    if (!json.refresh_token) {
      console.error("\nNo refresh_token returned. Did you include the 'offline' scope?");
      console.error(json);
      res.end("Failed — check your terminal.");
      return process.exit(1);
    }
    console.log("\nAdd to Netlify env vars:\n");
    console.log(`WHOOP_REFRESH_TOKEN=${json.refresh_token}\n`);
    res.end("Done — check your terminal. You can close this tab.");
    process.exit(0);
  })
  .listen(8889);
```

- [ ] **Step 2: Sanity-check that the file parses**

Run: `node --check scripts/whoop-auth.mjs`
Expected: no output, exit 0.

- [ ] **Step 3: Commit**

```bash
git add scripts/whoop-auth.mjs
git commit -m "Add one-time WHOOP OAuth refresh-token helper script"
```

---

## Task 4: Config wiring (redirect + env example)

**Files:**
- Modify: `netlify.toml`
- Modify: `.env.example`

- [ ] **Step 1: Add the redirect to `netlify.toml`**

Insert this block immediately after the existing `/api/spotify` redirect block (before the catch-all `/*` redirect):

```toml
[[redirects]]
  from = "/api/whoop"
  to = "/.netlify/functions/whoop"
  status = 200
```

- [ ] **Step 2: Add the env vars to `.env.example`**

Append:

```
# WHOOP — see scripts/whoop-auth.mjs for how to get the refresh token
WHOOP_CLIENT_ID=
WHOOP_CLIENT_SECRET=
WHOOP_REFRESH_TOKEN=
```

- [ ] **Step 3: Verify the redirect ordering**

Run: `grep -n "from = " netlify.toml`
Expected: `/api/whoop` appears BEFORE `/*` (the catch-all must stay last).

- [ ] **Step 4: Commit**

```bash
git add netlify.toml .env.example
git commit -m "Wire /api/whoop redirect and document WHOOP env vars"
```

---

## Task 5: `WhoopFeed` component

**Files:**
- Create: `src/components/WhoopFeed.jsx`

Fetches `/api/whoop` once, holds the full array, renders rich stat cards, and reveals more with a "Load more" button (client-side slicing, page size 8). Distinguishes loading / empty / error. Reuses `SectionLabel` and the site's motion + Tailwind idioms (see `SpotifyBlock.jsx` for tokens like `border-edge`, `bg-surface`, `text-ink`, `text-ink-dim`, `font-mono`).

- [ ] **Step 1: Write the component**

```jsx
// src/components/WhoopFeed.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel.jsx";

const PAGE_SIZE = 8;

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function Stat({ label, value }) {
  return (
    <span className="flex flex-col">
      <span className="font-mono text-sm text-ink">{value}</span>
      <span className="font-mono text-[10px] text-ink-dim">{label}</span>
    </span>
  );
}

function ActivityCard({ a }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-edge bg-surface p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{a.sport}</span>
        <span className="font-mono text-[11px] text-ink-dim">{fmtDate(a.start)}</span>
      </div>
      <div className="mt-3 flex gap-6">
        <Stat label="duration" value={fmtDuration(a.durationMin)} />
        {a.strain != null && <Stat label="strain" value={a.strain.toFixed(1)} />}
        {a.avgHr != null && <Stat label="avg hr" value={`${a.avgHr}`} />}
        {a.calories != null && <Stat label="cal" value={`${a.calories}`} />}
      </div>
    </motion.li>
  );
}

function Skeleton() {
  return (
    <ul className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="rounded-xl border border-edge bg-surface p-5">
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded bg-edge" />
            <div className="h-3 w-12 rounded bg-edge" />
          </div>
          <div className="mt-4 flex gap-6">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-6 w-10 rounded bg-edge" />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function WhoopFeed() {
  const [activities, setActivities] = useState(null); // null = loading
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/whoop")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((json) => {
        if (!cancelled) setActivities(json.activities ?? []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SectionLabel>log · via WHOOP</SectionLabel>
      {failed && (
        <p className="font-mono text-xs text-ink-dim">Activity feed unavailable.</p>
      )}
      {!failed && activities === null && <Skeleton />}
      {!failed && activities !== null && activities.length === 0 && (
        <p className="font-mono text-xs text-ink-dim">No activities in the last 30 days.</p>
      )}
      {!failed && activities !== null && activities.length > 0 && (
        <>
          <ul className="space-y-3">
            {activities.slice(0, visible).map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </ul>
          {visible < activities.length && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-5 rounded-full border border-edge px-4 py-1.5 font-mono text-xs text-ink-dim transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Load more
            </button>
          )}
        </>
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify it builds (lint + build)**

Run: `npm run lint && npm run build`
Expected: lint passes, Vite build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/WhoopFeed.jsx
git commit -m "Add WhoopFeed component with rich activity cards and load-more"
```

---

## Task 6: Wire the feed into the Training page

**Files:**
- Modify: `src/data/training.js`
- Modify: `src/pages/Training.jsx`

- [ ] **Step 1: Remove the `log` array from `src/data/training.js`**

Delete the `log:` array and the two comment lines above it (`// newest first ...` and `// entries may optionally carry source ...`). Keep `lede`, `prs`, `goal`, and `photos`. Result:

```js
export const training = {
  lede: "Lifting since college, running when the weather cooperates. These numbers are real and occasionally improving.",
  prs: [
    { label: "squat", value: 315, unit: "lbs" },
    { label: "bench @ 185 bw", value: 255, unit: "lbs" },
    { label: "pull-ups", value: 18, unit: "reps" },
  ],
  goal: { label: "bench 315", current: 255, target: 315 },
  // absolute or imported image URLs; empty = section hidden
  photos: [],
};
```

- [ ] **Step 2: Update `src/pages/Training.jsx`**

Add the import near the other component imports:

```jsx
import WhoopFeed from "../components/WhoopFeed.jsx";
```

Replace the entire `SectionLabel`+`<ol>` log block (lines ~61-74, from `<SectionLabel>log</SectionLabel>` through the closing `</ol>`) with:

```jsx
      <WhoopFeed />
```

Leave the PR cards, `GoalBar`, and the `proof`/photos block unchanged. Remove the now-unused `SectionLabel` import ONLY if no other usage remains (the photos block still uses it — so keep the import).

- [ ] **Step 3: Verify build and tests**

Run: `npm run lint && npm run build && npx vitest run`
Expected: lint passes, build succeeds, all Vitest tests pass (including `whoop-trim.test.mjs`).

- [ ] **Step 4: Manual smoke test with real credentials (optional but recommended)**

With `WHOOP_*` vars set in `.env`, run `npx netlify dev`, open the Training page, and confirm: skeleton → cards render, "Load more" reveals more, and a forced failure (bad token) shows "Activity feed unavailable."

- [ ] **Step 5: Commit**

```bash
git add src/data/training.js src/pages/Training.jsx
git commit -m "Replace manual training log with live WHOOP feed"
```

---

## Self-Review Notes

- **Spec coverage:** live-fetch/no-purge (Task 2 window param), last-30-days (Task 2 `WINDOW_DAYS`), pagination/load-more (Task 5), no filter (Task 5 shows all), rich cards (Task 5), keep PRs+goal (Task 6 Step 1), replace manual log (Task 6), auth helper (Task 3), tests (Task 1), CDN cache (Task 2 `s-maxage=300`), error handling (Task 2 502 + Task 5 "unavailable"). All covered.
- **Type consistency:** the record shape `{ id, sport, start, durationMin, strain, avgHr, calories }` is defined in Task 1 and consumed identically in Task 5. `trimWorkouts({ records })` signature matches between Task 1 and Task 2.
- **Endpoint host note:** WHOOP v2 data paths are under `api.prod.whoop.com/developer/v2/...`; OAuth paths under `api.prod.whoop.com/oauth/oauth2/...`. Verify against current docs during Task 2/3 if a 404/401 appears.
