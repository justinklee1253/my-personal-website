# Personal Website Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the CRA portfolio with a fresh Vite + React app implementing the approved design spec (dark-only, Inter + JetBrains Mono, 4 routes, Spotify block, Cal.com booking).

**Architecture:** Static Vite SPA with React Router (4 routes), all mutable content in `src/data/` modules, one Netlify Function proxying Spotify's API (refresh-token flow, trimmed payload, 120s CDN cache), Cal.com popup embed on Contact. Same repo/branch (`feature/site-revamp`), same Netlify site.

**Tech Stack:** Vite 6, React 18, React Router 6, Tailwind 3.4, framer-motion 12, @calcom/embed-react, Vitest 3, Netlify Functions (v2 API), ESLint 9 flat config.

**Spec:** `docs/superpowers/specs/2026-07-06-website-revamp-design.md` — the design authority. When this plan and the spec disagree, the spec wins.

**Conventions for all commits:** plain-English messages, no `feat:`/`fix:` prefixes (user convention). Every commit message ends with the trailer:
`Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`

**Working directory for all commands:** `my-personal-website/` (repo root).

---

## Design tokens quick reference (used by every UI task)

| Token | Value | Tailwind usage |
|---|---|---|
| canvas | `#0a0a0a` | `bg-canvas` |
| surface | `#111111` | `bg-surface` |
| edge | `#222222` | `border-edge` |
| ink | `#fafafa` | `text-ink` (headings) |
| ink-body | `#8a8a8a` | `text-ink-body` (body) |
| ink-dim | `#5c5c5c` | `text-ink-dim` (metadata) |
| accent | `#9fe8b8` | `text-accent` / `bg-accent` — budgeted: active nav, current dots, goal bar, link hover, eyebrows |
| fonts | Inter / JetBrains Mono | `font-sans` / `font-mono` |
| column | 44rem (~704px) | `max-w-col` |

---

### Task 1: Clean out CRA, scaffold Vite + Tailwind

**Files:**
- Delete: `src/` (all), `public/index.html`, `public/logo192.png`, `public/logo512.png`, `public/manifest.json`, `public/favicon.ico`, `public/_redirects`
- Keep: `public/resumecv.pdf`, `public/robots.txt`
- Create: `package.json` (rewrite), `vite.config.js`, `index.html`, `tailwind.config.js` (rewrite), `postcss.config.js` (rewrite), `eslint.config.js`, `netlify.toml`, `.env.example`, `src/main.jsx`, `src/index.css`, `src/App.jsx`, `src/assets/avatar.jpg`, `src/assets/fan/fan-1.jpg`, `src/assets/fan/fan-2.jpg`
- Modify: `.gitignore`

- [ ] **Step 1: Stage the photo assets we're keeping before deleting `src/`**

```bash
mkdir -p /tmp/site-assets
cp src/images/profile.jpg /tmp/site-assets/avatar.jpg
cp src/images/profile2.jpg /tmp/site-assets/fan-1.jpg
cp src/images/moimsushi.png /tmp/site-assets/fan-2.jpg
```

(Interim photos only — Justin supplies 4 real travel candids + gym photos later; the components render any count.)

- [ ] **Step 2: Delete the CRA app**

```bash
git rm -r src
git rm public/index.html public/logo192.png public/logo512.png public/manifest.json public/favicon.ico public/_redirects
rm -rf node_modules package-lock.json build
```

- [ ] **Step 3: Write the new `package.json`**

```json
{
  "name": "justinlee-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "@calcom/embed-react": "^1.5.2",
    "framer-motion": "^12.4.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "globals": "^15.14.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 4: Write `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
});
```

- [ ] **Step 5: Write `index.html`** (repo root — Vite convention; final meta lands in Task 10)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0a0a" />
    <title>Justin Lee — Software Engineer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Write `tailwind.config.js`** (overwrite the CRA-era one)

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0a0a0a",
        surface: "#111111",
        edge: "#222222",
        ink: { DEFAULT: "#fafafa", body: "#8a8a8a", dim: "#5c5c5c" },
        accent: "#9fe8b8",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        col: "44rem",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Write `postcss.config.js`** (overwrite)

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Write `eslint.config.js`**

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
];
```

- [ ] **Step 9: Write `netlify.toml`** (SPA redirect replaces the deleted `_redirects`; functions config lands here too, used from Task 5)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/spotify"
  to = "/.netlify/functions/spotify"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 10: Write `.env.example`** (documents the Netlify env vars; never commit a real `.env`)

```bash
# Spotify — see scripts/spotify-auth.mjs (Task 5) for how to get the refresh token
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

- [ ] **Step 11: Update `.gitignore`** — ensure these lines exist (append any that are missing)

```
node_modules
dist
.netlify
.env
```

- [ ] **Step 12: Write `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-canvas text-ink-body font-sans antialiased;
}

::selection {
  @apply bg-accent text-canvas;
}
```

- [ ] **Step 13: Write `src/main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 14: Write a placeholder `src/App.jsx`** (replaced in Task 2)

```jsx
export default function App() {
  return <p className="p-8 font-mono text-accent">scaffold ok</p>;
}
```

- [ ] **Step 15: Restore staged photo assets**

```bash
mkdir -p src/assets/fan
cp /tmp/site-assets/avatar.jpg src/assets/avatar.jpg
cp /tmp/site-assets/fan-1.jpg src/assets/fan/fan-1.jpg
cp /tmp/site-assets/fan-2.jpg src/assets/fan/fan-2.jpg
```

- [ ] **Step 16: Install and verify**

```bash
npm install
npm run build
```

Expected: build succeeds, `dist/` produced. Then `npm run dev`, open http://localhost:5173 — black page, green mono "scaffold ok".

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "Replace CRA scaffold with Vite, Tailwind tokens, and Netlify config"
```

---

### Task 2: App shell — Nav, Page wrapper, SectionLabel, routes

**Files:**
- Create: `src/components/Nav.jsx`, `src/components/Page.jsx`, `src/components/SectionLabel.jsx`, `src/pages/Home.jsx`, `src/pages/About.jsx`, `src/pages/Training.jsx`, `src/pages/Contact.jsx`
- Modify: `src/App.jsx` (replace placeholder)

- [ ] **Step 1: Write `src/components/Nav.jsx`**

```jsx
import { NavLink } from "react-router-dom";

const links = [
  ["home", "/"],
  ["about", "/about"],
  ["training", "/training"],
  ["contact", "/contact"],
];

export default function Nav() {
  return (
    <header className="flex items-baseline justify-between py-8">
      <NavLink to="/" className="font-mono text-sm text-ink">
        justin lee
      </NavLink>
      <nav className="flex gap-4 sm:gap-6">
        {links.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `font-mono text-xs sm:text-[13px] transition-colors ${
                isActive ? "text-accent" : "text-ink-dim hover:text-ink-body"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Write `src/components/Page.jsx`** (route fade — the entire page-transition motion budget)

```jsx
import { motion } from "framer-motion";

export default function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="pb-24"
    >
      {children}
    </motion.main>
  );
}
```

- [ ] **Step 3: Write `src/components/SectionLabel.jsx`**

```jsx
export default function SectionLabel({ children }) {
  return (
    <h2 className="mt-14 mb-6 border-t border-edge pt-5 font-mono text-xs lowercase text-ink-dim">
      {children}
    </h2>
  );
}
```

- [ ] **Step 4: Write stub pages** — same pattern for all four files; shown for `src/pages/Home.jsx`, repeat with heading text "about", "training", "contact" for `src/pages/About.jsx`, `src/pages/Training.jsx`, `src/pages/Contact.jsx`:

```jsx
import Page from "../components/Page.jsx";

export default function Home() {
  return (
    <Page>
      <p className="font-mono text-xs text-ink-dim">home</p>
    </Page>
  );
}
```

- [ ] **Step 5: Replace `src/App.jsx`**

```jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Training from "./pages/Training.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-col px-5 sm:px-8">
        <Nav />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/training" element={<Training />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify**

`npm run dev` — all four nav links route with a soft fade; active link is green; others gray, lighten on hover. Check at 375px width: nav fits on one line.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add app shell with nav, routes, and page transitions"
```

---

### Task 3: Data modules (with invariant tests)

**Files:**
- Create: `src/data/profile.js`, `src/data/timeline.js`, `src/data/projects.js`, `src/data/training.js`
- Test: `src/data/training.test.js`

- [ ] **Step 1: Write `src/data/profile.js`**

```js
export const profile = {
  name: "justin lee",
  eyebrow: "software engineer @ rokt · nyc",
  headline:
    "Backend engineer, building for the person on the other end of the request.",
  bio: "I work on backend systems at Rokt in New York — Boston College CS before that. I care about services that hold up under load and products that respect the person using them. Off the clock: under a barbell chasing a 315 bench, or hunting the city's best bowl of ramen.",
  email: "justinklee.dev@gmail.com",
  links: [
    { label: "github", href: "https://github.com/justinklee1253" },
    { label: "linkedin", href: "https://www.linkedin.com/in/justinklee1253/" },
    { label: "resume", href: "/resumecv.pdf" },
    { label: "email", href: "mailto:justinklee.dev@gmail.com" },
  ],
  // Cal.com booking links, e.g. "justinlee/15min" — null hides the popup and
  // falls back to a mailto card (see Contact page). Justin fills these in.
  cal: { fifteen: null, thirty: null },
};
```

- [ ] **Step 2: Write `src/data/timeline.js`** (dates marked below need Justin's confirmation before launch)

```js
export const timeline = [
  {
    company: "Rokt",
    role: "Software Engineer",
    years: "2025 — now", // confirm start date with Justin
    note: "building for the person on the other end of the request",
    current: true,
  },
  {
    company: "Content Academy",
    role: "Lead Software Engineer",
    years: "2024 — 2025", // old site said "December 2024 - May 2024" (impossible) — confirm
    note: "led four engineers; learned that shipping beats perfect",
  },
  {
    company: "Teamworks",
    role: "Software Engineering Intern",
    years: "summer 2024",
    note: "shipped exports used by 6,300+ sports teams",
  },
  {
    company: "LG Electronics",
    role: "Software Engineering Intern",
    years: "summer 2023",
    note: "shipment validation, maps, and a lot of sql",
  },
  {
    company: "Boston College",
    role: "B.A. Computer Science",
    years: "2021 — 2025",
    note: "got the degree, kept the gym habit",
  },
];
```

- [ ] **Step 3: Write `src/data/projects.js`**

```js
export const projects = [
  {
    name: "Content Academy",
    description:
      "Gamified analytics platform for content creators — 750+ active users syncing real-time Instagram data.",
    stack: "node · postgres · redis",
    github: "https://github.com/justinklee1253/ca-3.0-frontend",
    live: "https://app.contentacademy.io/",
  },
  {
    name: "Polarity",
    description:
      "AI financial assistant that helps college students catch impulsive spending before it happens.",
    stack: "flask · plaid · langchain",
    github: "https://github.com/justinklee1253/Polarity",
  },
  {
    name: "Resolve",
    description:
      "Multi-modal complaint analysis across audio, text, image, and video.",
    stack: "flask · whisper · docker",
    github: "https://github.com/nickyim/Resolved--Spend-Ruby-Hackathon-",
  },
];
```

- [ ] **Step 4: Write `src/data/training.js`** (log dates are coarse until Justin confirms from Strava/Nike; `photos: []` renders no proof section until photos arrive — that is the designed behavior, not a gap)

```js
export const training = {
  lede: "Lifting since college, running when the weather cooperates. These numbers are real and occasionally improving.",
  prs: [
    { label: "squat", value: 315, unit: "lbs" },
    { label: "bench @ 185 bw", value: 255, unit: "lbs" },
    { label: "pull-ups", value: 18, unit: "reps" },
  ],
  goal: { label: "bench 315", current: 255, target: 315 },
  // newest first — appending here is how the site gets updated
  log: [
    { date: "2026-06", text: "bench 255 lbs — new PR. 60 to go." },
    { date: "2026-03", text: "pull-ups × 18 unbroken" },
    { date: "2025-11", text: "half marathon #2 — time coming from strava" },
    { date: "2025-08", text: "squat 315 lbs — three plates, finally" },
    { date: "2024-10", text: "half marathon #1 — the one that started it" },
  ],
  // absolute or imported image URLs; empty = section hidden
  photos: [],
};
```

- [ ] **Step 5: Write the failing invariant test `src/data/training.test.js`**

```js
import { describe, it, expect } from "vitest";
import { training } from "./training.js";

describe("training data invariants", () => {
  it("log is newest-first (YYYY-MM sorts lexicographically)", () => {
    const dates = training.log.map((e) => e.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("goal progress is between 0 and 100 percent", () => {
    const pct = (training.goal.current / training.goal.target) * 100;
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it("every log entry has a date and text", () => {
    for (const entry of training.log) {
      expect(entry.date).toMatch(/^\d{4}(-\d{2})?$/);
      expect(entry.text.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS (3 tests). These are invariant guards for future edits, not TDD-red tests — if any fails, the data in Step 4 is wrong; fix the data.

- [ ] **Step 7: Commit**

```bash
git add src/data
git commit -m "Add content data modules with training invariant tests"
```

---

### Task 4: Home page (static — Spotify block arrives in Task 6)

**Files:**
- Modify: `src/pages/Home.jsx` (replace stub)

- [ ] **Step 1: Replace `src/pages/Home.jsx`**

```jsx
import Page from "../components/Page.jsx";
import { profile } from "../data/profile.js";
import avatar from "../assets/avatar.jpg";

export default function Home() {
  return (
    <Page>
      <img
        src={avatar}
        alt="Justin Lee"
        className="mt-6 h-16 w-16 rounded-xl border border-edge object-cover"
      />
      <p className="mt-8 font-mono text-xs text-accent">{profile.eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {profile.headline}
      </h1>
      <p className="mt-6 max-w-prose text-base leading-relaxed">{profile.bio}</p>
      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
        {profile.links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="border-b border-edge pb-0.5 font-mono text-xs text-ink-body transition-colors hover:border-accent hover:text-accent"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Page>
  );
}
```

- [ ] **Step 2: Verify**

`npm run dev` — check 375 / 768 / 1280 widths: headline wraps cleanly (no mid-word breaks), body ≥16px, line-height comfortable, avatar not stretched. Confirm bio reads on one screen without scrolling at 1280.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "Build home page hero with profile data"
```

---

### Task 5: Spotify Netlify function

**Files:**
- Create: `netlify/functions/lib/trim.mjs`, `netlify/functions/spotify.mjs`, `scripts/spotify-auth.mjs`
- Test: `netlify/functions/lib/trim.test.mjs`

- [ ] **Step 1: Write the failing tests `netlify/functions/lib/trim.test.mjs`**

```js
import { describe, it, expect } from "vitest";
import { trimRecent, trimTop } from "./trim.mjs";

const track = {
  name: "Afterglow",
  artists: [{ name: "dami" }, { name: "guest" }],
  album: {
    images: [
      { url: "https://img/640" },
      { url: "https://img/300" },
      { url: "https://img/64" },
    ],
  },
  external_urls: { spotify: "https://open.spotify.com/track/x" },
};

describe("trimRecent", () => {
  it("maps items to trimmed shape with smallest album art", () => {
    const out = trimRecent({
      items: [{ track, played_at: "2026-07-06T14:00:00.000Z" }],
    });
    expect(out).toEqual([
      {
        title: "Afterglow",
        artist: "dami, guest",
        art: "https://img/64",
        url: "https://open.spotify.com/track/x",
        playedAt: "2026-07-06T14:00:00.000Z",
      },
    ]);
  });

  it("returns [] for missing items", () => {
    expect(trimRecent({})).toEqual([]);
  });
});

describe("trimTop", () => {
  it("maps bare tracks with null playedAt", () => {
    const out = trimTop({ items: [track] });
    expect(out[0].playedAt).toBeNull();
    expect(out[0].title).toBe("Afterglow");
  });

  it("tolerates missing album art", () => {
    const bare = { ...track, album: { images: [] } };
    expect(trimTop({ items: [bare] })[0].art).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './trim.mjs'`

- [ ] **Step 3: Write `netlify/functions/lib/trim.mjs`**

```js
function shape(track, playedAt) {
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    art: track.album.images.at(-1)?.url ?? null,
    url: track.external_urls.spotify,
    playedAt,
  };
}

export function trimRecent(payload) {
  return (payload.items ?? []).map(({ track, played_at }) =>
    shape(track, played_at)
  );
}

export function trimTop(payload) {
  return (payload.items ?? []).map((track) => shape(track, null));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (trim tests + training invariants).

- [ ] **Step 5: Write `netlify/functions/spotify.mjs`** (Netlify Functions v2 API — default export taking a `Request`, returning a `Response`)

```js
import { trimRecent, trimTop } from "./lib/trim.mjs";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const FEEDS = {
  recent: "https://api.spotify.com/v1/me/player/recently-played?limit=5",
  top: "https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term",
};

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status}`);
  return (await res.json()).access_token;
}

export default async function handler(req) {
  try {
    const param = new URL(req.url).searchParams.get("feed");
    const feed = param === "top" ? "top" : "recent";
    const token = await getAccessToken();
    const res = await fetch(FEEDS[feed], {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`spotify responded ${res.status}`);
    const payload = await res.json();
    const tracks = feed === "top" ? trimTop(payload) : trimRecent(payload);
    return new Response(JSON.stringify({ feed, tracks }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=120",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

- [ ] **Step 6: Write the one-time auth helper `scripts/spotify-auth.mjs`**

```js
// One-time helper: prints the SPOTIFY_REFRESH_TOKEN for Netlify env vars.
//
// Prereqs: create an app at https://developer.spotify.com/dashboard with
// redirect URI http://127.0.0.1:8888/callback, then run:
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs
// and open the printed URL in a browser.
import http from "node:http";

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const redirect = "http://127.0.0.1:8888/callback";
const scopes = "user-read-recently-played user-top-read";
console.log(
  "Open this URL in your browser:\n\n" +
    `https://accounts.spotify.com/authorize?client_id=${id}` +
    `&response_type=code&redirect_uri=${encodeURIComponent(redirect)}` +
    `&scope=${encodeURIComponent(scopes)}\n`
);

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, redirect);
    if (url.pathname !== "/callback") return res.end();
    const code = url.searchParams.get("code");
    const auth = Buffer.from(`${id}:${secret}`).toString("base64");
    const r = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirect,
      }),
    });
    const json = await r.json();
    console.log("\nAdd to Netlify env vars:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`);
    res.end("Done — check your terminal. You can close this tab.");
    process.exit(0);
  })
  .listen(8888);
```

- [ ] **Step 7: Lint and commit**

```bash
npm run lint
git add netlify scripts
git commit -m "Add Spotify Netlify function with trimmed payloads and auth helper"
```

(Live verification of the function happens in Task 6 Step 6 via `netlify dev`, and requires Justin's Spotify credentials — the error path works without them.)

---

### Task 6: Spotify block on Home

**Files:**
- Create: `src/lib/relativeTime.js`, `src/components/SpotifyBlock.jsx`
- Test: `src/lib/relativeTime.test.js`
- Modify: `src/pages/Home.jsx` (append block)

- [ ] **Step 1: Write the failing tests `src/lib/relativeTime.test.js`**

```js
import { describe, it, expect } from "vitest";
import { relativeTime } from "./relativeTime.js";

const NOW = new Date("2026-07-06T12:00:00Z").getTime();

describe("relativeTime", () => {
  it("under a minute → just now", () => {
    expect(relativeTime("2026-07-06T11:59:30Z", NOW)).toBe("just now");
  });
  it("minutes", () => {
    expect(relativeTime("2026-07-06T11:15:00Z", NOW)).toBe("45m ago");
  });
  it("hours", () => {
    expect(relativeTime("2026-07-06T04:00:00Z", NOW)).toBe("8h ago");
  });
  it("days", () => {
    expect(relativeTime("2026-07-01T12:00:00Z", NOW)).toBe("5d ago");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './relativeTime.js'`

- [ ] **Step 3: Write `src/lib/relativeTime.js`**

```js
export function relativeTime(iso, now = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (all suites).

- [ ] **Step 5: Write `src/components/SpotifyBlock.jsx`**

Behavior per spec §4.1: fetch errors or an empty track list unmount the whole block — the page must be complete without it. No skeletons, no error text.

```jsx
import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { relativeTime } from "../lib/relativeTime.js";

const FEEDS = [
  ["recent", "recently_played"],
  ["top", "top_tracks"],
];

export default function SpotifyBlock() {
  const [feed, setFeed] = useState("recent");
  const [cache, setCache] = useState({});
  const [dead, setDead] = useState(false);

  useEffect(() => {
    if (dead || cache[feed]) return;
    let cancelled = false;
    fetch(`/api/spotify?feed=${feed}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((json) => {
        if (cancelled) return;
        if (!json.tracks?.length) throw new Error("empty");
        setCache((c) => ({ ...c, [feed]: json.tracks }));
      })
      .catch(() => {
        if (!cancelled) setDead(true);
      });
    return () => {
      cancelled = true;
    };
  }, [feed, dead, cache]);

  if (dead || !cache.recent) return null;
  const tracks = cache[feed] ?? [];

  return (
    <section>
      <SectionLabel>
        <span className="flex items-baseline justify-between">
          <span className="flex gap-4">
            {FEEDS.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFeed(key)}
                className={`transition-colors ${
                  feed === key ? "text-ink-body" : "text-ink-dim hover:text-ink-body"
                }`}
              >
                {label}
              </button>
            ))}
          </span>
          <span>via spotify</span>
        </span>
      </SectionLabel>
      <ul>
        {tracks.map((t) => (
          <li key={t.url + (t.playedAt ?? "")}>
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 py-2"
            >
              {t.art && (
                <img src={t.art} alt="" className="h-8 w-8 rounded border border-edge" />
              )}
              <span className="text-sm font-medium text-ink-body transition-colors group-hover:text-ink">
                {t.title}
              </span>
              <span className="font-mono text-xs text-ink-dim">{t.artist}</span>
              {t.playedAt && (
                <span className="ml-auto font-mono text-[11px] text-ink-dim">
                  {relativeTime(t.playedAt)}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 6: Append the block to `src/pages/Home.jsx`**

Add the import at the top and the component before `</Page>`:

```jsx
import SpotifyBlock from "../components/SpotifyBlock.jsx";
```

```jsx
      {/* ...existing link row... */}
      <SpotifyBlock />
    </Page>
```

- [ ] **Step 7: Verify both states**

1. Error path (no credentials): `npm run dev` — `/api/spotify` 404s, block absent, page complete. No console spam beyond the single failed fetch.
2. Happy path (only if a local `.env` with real Spotify vars exists): `npx netlify dev`, open the printed URL — track rows render, toggle switches feeds, timestamps read like `2h ago`.

- [ ] **Step 8: Commit**

```bash
git add src/lib src/components/SpotifyBlock.jsx src/pages/Home.jsx
git commit -m "Add Spotify recently-played block with graceful absence"
```

---

### Task 7: About page — photo fan, timeline, project rows

**Files:**
- Create: `src/components/PhotoFan.jsx`
- Modify: `src/pages/About.jsx` (replace stub)

- [ ] **Step 1: Write `src/components/PhotoFan.jsx`** (hover-straighten is the page's one playful moment)

```jsx
import { motion } from "framer-motion";

const tilts = [-5, 2, -2, 5];

export default function PhotoFan({ photos }) {
  if (!photos.length) return null;
  return (
    <div className="my-12 flex justify-center">
      {photos.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt="Justin, somewhere"
          className="-mx-2 h-36 w-36 rounded-xl border border-edge object-cover shadow-lg sm:h-44 sm:w-44"
          style={{ rotate: tilts[i % tilts.length] }}
          whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/pages/About.jsx`**

```jsx
import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PhotoFan from "../components/PhotoFan.jsx";
import { timeline } from "../data/timeline.js";
import { projects } from "../data/projects.js";
import fan1 from "../assets/fan/fan-1.jpg";
import fan2 from "../assets/fan/fan-2.jpg";

const photos = [fan1, fan2]; // grows to 4 when Justin supplies travel candids

export default function About() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">about</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Who I am.
      </h1>

      <PhotoFan photos={photos} />

      <SectionLabel>timeline</SectionLabel>
      <ol className="ml-1 space-y-7 border-l border-edge pl-6">
        {timeline.map((item) => (
          <li key={item.company} className="relative">
            <span
              className={`absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border ${
                item.current ? "border-accent bg-accent" : "border-ink-dim bg-canvas"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{item.company}</span>
              <span className="text-sm italic text-ink-body">{item.role}</span>
              <span className="ml-auto font-mono text-xs text-ink-dim">
                {item.years}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-body">{item.note}</p>
          </li>
        ))}
      </ol>

      <SectionLabel>projects</SectionLabel>
      <ul>
        {projects.map((p) => (
          <li key={p.name} className="border-b border-edge/60 py-5 first:pt-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{p.name}</span>
              <span className="ml-auto font-mono text-xs text-ink-dim">
                {p.stack}
              </span>
            </div>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed">
              {p.description}
            </p>
            <p className="mt-2 flex gap-4 font-mono text-xs">
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim transition-colors hover:text-accent"
              >
                github ↗
              </a>
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  live ↗
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
```

- [ ] **Step 3: Verify**

`npm run dev` → `/about`. Fan photos tilt, straighten + lift on hover. Only Rokt's dot is green. At 375px: timeline rows wrap gracefully (years drop below the role), fan photos shrink but don't overflow.

- [ ] **Step 4: Commit**

```bash
git add src/components/PhotoFan.jsx src/pages/About.jsx
git commit -m "Build about page with photo fan, timeline, and project rows"
```

---

### Task 8: Training page

**Files:**
- Modify: `src/pages/Training.jsx` (replace stub)

- [ ] **Step 1: Replace `src/pages/Training.jsx`**

```jsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import { training } from "../data/training.js";

function GoalBar({ goal }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pct = Math.round((goal.current / goal.target) * 100);
  return (
    <div ref={ref} className="mt-4 rounded-xl border border-edge bg-surface p-5">
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-ink-body">
          current_goal: <span className="text-accent">{goal.label}</span>
        </span>
        <span className="text-ink-dim">
          {goal.current} / {goal.target}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-edge">
        <motion.div
          className="h-full rounded bg-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2.5 font-mono text-[11px] text-ink-dim">
        {pct}% — updated when it happens, not before
      </p>
    </div>
  );
}

export default function Training() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">off hours</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        The training log.
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed">{training.lede}</p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {training.prs.map((pr) => (
          <div key={pr.label} className="rounded-xl border border-edge bg-surface p-4 sm:p-5">
            <p className="font-mono text-xl font-semibold text-ink sm:text-2xl">
              {pr.value}
              <span className="ml-1 text-xs font-normal text-ink-dim">{pr.unit}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-ink-dim sm:text-[11px]">
              {pr.label}
            </p>
          </div>
        ))}
      </div>

      <GoalBar goal={training.goal} />

      <SectionLabel>log</SectionLabel>
      <ol className="ml-1 space-y-5 border-l border-edge pl-6">
        {training.log.map((entry, i) => (
          <li key={entry.date + entry.text} className="relative">
            <span
              className={`absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border ${
                i === 0 ? "border-accent bg-accent" : "border-ink-dim bg-canvas"
              }`}
            />
            <p className="font-mono text-[11px] text-ink-dim">{entry.date}</p>
            <p className="mt-0.5 text-sm text-ink-body">{entry.text}</p>
          </li>
        ))}
      </ol>

      {training.photos.length > 0 && (
        <>
          <SectionLabel>proof</SectionLabel>
          <div className="flex gap-3">
            {training.photos.map((src) => (
              <img
                key={src}
                src={src}
                alt="training"
                className="h-24 w-32 rounded-lg border border-edge object-cover"
              />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
```

- [ ] **Step 2: Verify**

`npm run dev` → `/training`. Stat numbers in mono; goal bar animates to 81% on scroll-into-view (refresh, scroll down slowly to confirm the fill triggers once). Newest log entry has the green dot. `proof` section absent (photos empty) with no visual gap. Check 375px: three stat cards stay legible.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Training.jsx
git commit -m "Build training page with PR stats, goal bar, and changelog"
```

---

### Task 9: Contact page — channels, Cal.com booking, footer

**Files:**
- Modify: `src/pages/Contact.jsx` (replace stub)

- [ ] **Step 1: Replace `src/pages/Contact.jsx`**

Booking cards use Cal.com's popup when a link exists in `profile.cal`; while those are `null` (until Justin creates the event types) they fall back to pre-filled mailto links — the page ships working either way.

```jsx
import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import { profile } from "../data/profile.js";

const channels = [
  { name: "email", handle: profile.email, href: `mailto:${profile.email}` },
  { name: "linkedin", handle: "in/justinklee1253", href: "https://www.linkedin.com/in/justinklee1253/" },
  { name: "github", handle: "justinklee1253", href: "https://github.com/justinklee1253" },
];

const cardCls =
  "block rounded-xl border border-edge p-5 transition-colors hover:border-ink-dim";

function CallCard({ minutes, blurb, calLink }) {
  const inner = (
    <>
      <p className="font-mono text-sm text-ink">{minutes} min</p>
      <p className="mt-1 text-sm text-ink-body">{blurb}</p>
      <p className="mt-3 font-mono text-[11px] text-ink-dim">book a slot →</p>
    </>
  );
  if (!calLink) {
    return (
      <a
        className={cardCls}
        href={`mailto:${profile.email}?subject=${encodeURIComponent(`${minutes} min call`)}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={`${cardCls} w-full text-left`} data-cal-link={calLink}>
      {inner}
    </button>
  );
}

export default function Contact() {
  useEffect(() => {
    if (!profile.cal.fifteen && !profile.cal.thirty) return;
    (async () => {
      const cal = await getCalApi();
      cal("ui", { theme: "dark" });
    })();
  }, []);

  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">contact</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Say hello.
      </h1>
      <p className="mt-3 max-w-prose text-sm leading-relaxed">
        Open to interesting problems, good questions, and restaurant recommendations.
      </p>

      <SectionLabel>channels</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {channels.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={cardCls}
          >
            <p className="text-sm font-medium text-ink">{c.name}</p>
            <p className="mt-1 break-all font-mono text-xs text-ink-dim">{c.handle}</p>
          </a>
        ))}
      </div>

      <SectionLabel>book_a_call</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <CallCard minutes={15} blurb="Quick chat — a question, an intro, a sanity check." calLink={profile.cal.fifteen} />
        <CallCard minutes={30} blurb="A real conversation — careers, projects, ideas." calLink={profile.cal.thirty} />
      </div>

      <footer className="mt-20 border-t border-edge pt-6 font-mono text-xs text-ink-dim">
        © {new Date().getFullYear()} justin lee
      </footer>
    </Page>
  );
}
```

- [ ] **Step 2: Verify**

`npm run dev` → `/contact`. Three channel cards link out correctly; both call cards currently open a pre-filled mailto (cal links are null). Footer renders. 375px: cards stack single-column.

To verify the Cal.com popup once real links exist: set `cal: { fifteen: "justinlee/15min", thirty: "justinlee/30min" }` in `src/data/profile.js`, reload, click a card — Cal popup opens in dark theme.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "Build contact page with channel cards and call booking"
```

---

### Task 10: Meta, favicon, README, final sweep

**Files:**
- Create: `public/favicon.svg`
- Modify: `index.html`, `README.md` (rewrite), `public/robots.txt` (verify content)

- [ ] **Step 1: Write `public/favicon.svg`** (mono monogram on canvas)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
  <text x="32" y="43" font-family="JetBrains Mono, ui-monospace, monospace" font-size="26" fill="#9fe8b8" text-anchor="middle">jl</text>
</svg>
```

- [ ] **Step 2: Final `index.html` head** — replace the `<head>` contents with:

```html
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0a0a0a" />
    <title>Justin Lee — Software Engineer</title>
    <meta
      name="description"
      content="Backend engineer at Rokt in NYC. Building for the person on the other end of the request."
    />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content="Justin Lee — Software Engineer" />
    <meta
      property="og:description"
      content="Backend engineer at Rokt in NYC. Building for the person on the other end of the request."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://justinklee.dev/" />
    <meta name="twitter:card" content="summary" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
```

(Confirm the real domain with Justin — replace `https://justinklee.dev/` in `og:url` if different.)

- [ ] **Step 3: Verify `public/robots.txt`** allows crawling:

```
User-agent: *
Allow: /
```

- [ ] **Step 4: Rewrite `README.md`**

```markdown
# justinlee — personal site

Dark, minimal, data-driven. Vite + React + Tailwind, deployed on Netlify.
Design spec: `docs/superpowers/specs/2026-07-06-website-revamp-design.md`.

## Develop

    npm install
    npm run dev        # app only (Spotify block hides itself)
    npx netlify dev    # app + Spotify function (needs .env, see .env.example)
    npm test           # vitest
    npm run build      # production build to dist/

## Updating content

Everything editable lives in `src/data/`:

- `training.js` — append a log entry (newest first) or bump a PR. Tests
  guard the format: `npm test`.
- `timeline.js`, `projects.js`, `profile.js` — career, projects, bio, links.

## Integrations

- **Spotify**: `netlify/functions/spotify.mjs`. One-time setup: create an app
  at developer.spotify.com (redirect URI `http://127.0.0.1:8888/callback`),
  run `scripts/spotify-auth.mjs`, put the three `SPOTIFY_*` vars in Netlify.
- **Cal.com**: set `cal.fifteen` / `cal.thirty` in `src/data/profile.js` to
  your Cal.com event links (e.g. `justinlee/15min`). Null = mailto fallback.
```

- [ ] **Step 5: Full verification sweep**

```bash
npm test && npm run lint && npm run build
```

Expected: all pass. Then `npm run preview` and check every page at 375 / 768 / 1280 px:
- [ ] Home: hero + links; Spotify block absent without credentials, no layout gap
- [ ] About: fan hover, timeline dots (green on Rokt only), project rows
- [ ] Training: goal bar animates once, newest log entry green
- [ ] Contact: channels + call cards + footer
- [ ] Browser tab: monogram favicon, correct title
- [ ] Accent audit: green appears only in — nav active, eyebrows, current/newest dots, goal bar, link hovers, selection highlight
- [ ] Lighthouse sanity pass (Chrome DevTools → Lighthouse on the preview URL): fix any perf/a11y regression it flags; don't chase 100s

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add favicon, meta tags, and README for the new site"
```

---

## Launch checklist (Justin's inputs — from spec §10)

Deployment works without these; each one upgrades a placeholder:

- [ ] 4 travel/candid photos → `src/assets/fan/` (replace interim two, update `photos` array in `About.jsx`)
- [ ] 3–4 gym/running photos → `src/assets/` + `training.photos`
- [ ] Better avatar crop if desired → `src/assets/avatar.jpg`
- [ ] Real half-marathon times/dates → `src/data/training.js` log entries
- [ ] Rokt start date + Content Academy true dates → `src/data/timeline.js`
- [ ] Current resume → `public/resumecv.pdf`
- [ ] Cal.com account + two event types → `src/data/profile.js` `cal` links
- [ ] Spotify app + `scripts/spotify-auth.mjs` run → three env vars in Netlify UI
- [ ] Confirm domain for `og:url` in `index.html`
- [ ] Copy approval pass over every string in `src/data/`
- [ ] Merge `feature/site-revamp` → `main` (Netlify auto-deploys)
