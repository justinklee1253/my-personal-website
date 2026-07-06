# Personal Website Revamp — Design Spec

**Date:** 2026-07-06
**Status:** Approved by Justin (brainstorming session, visual mockups reviewed in browser companion)
**Replaces:** the current CRA single-page portfolio in this repo

---

## 1. Goals

The site's job, in priority order:

1. **Career leverage** — a hiring manager or recruiter should want to talk to Justin within 30 seconds.
2. **Professional presence** — the "when someone googles me" page; a credibility and taste signal.
3. **Personal expression** — seasoning, not the meal. Personality shows through copy, music, and training data — never through decoration.

The design must feel **sleek, minimal, intentional, and professionally playful**. The taste signal comes from restraint: what the site *doesn't* do is the point.

## 2. Design language

### Canvas
- Background `#0a0a0a` everywhere. **Dark-only** — no theme toggle.
- No decorative backgrounds of any kind. Explicitly dead from the old site: stars, particles, shooting stars, animated blobs, grid overlays, gradient text, glowing avatar rings, typewriter effects.

### Typography
- **Inter** (400 / 500 / 600) — the voice: headlines, body text, project descriptions.
- **JetBrains Mono** (400 / 500) — the data: nav links, section labels, eyebrows, dates, years, numbers, tech stacks, timestamps, metadata.
- Rule of thumb: if a human wrote it, Inter; if a system could have emitted it, mono.
- Text column ~700px max. Body ≥ 16px, line-height ~1.7. Headlines: Inter 600, tight tracking (−0.02em). Do not compress text — generous measure is a stated user requirement.

### Color
- Grays do hierarchy: `#fafafa` (headings) → `#8a8a8a` (body) → `#5c5c5c` (metadata) → `#222` (borders) → `#111` (card surfaces).
- **One accent: muted green `#9fe8b8`**, budgeted strictly. Sanctioned uses: active nav item, current-position timeline dot, latest changelog entry dot, goal progress bar, link hover states, eyebrow labels. If a screen works without the accent, it goes without.

### Motion
Rare and purposeful; framer-motion. The complete motion budget:
- Photo fan: straighten + slight lift on hover (About).
- Goal progress bar: fills on scroll-into-view (Training).
- Page transitions: soft fade (~150ms).
- Link/nav hovers: color transitions only.
Nothing else animates. No hover-scaling body text, no perpetual animations.

## 3. Information architecture

Four real routes (React Router):

```
/            home       — who I am now, links, Spotify
/about       about      — photos, career timeline, projects
/training    training   — PRs, goal, changelog, photos
/contact     contact    — channel cards, book-a-call
```

Nav: mono, top of every page — name left (`justin lee`), links right, active page in accent green. No hamburger gymnastics: the four links fit on mobile as-is (smaller size).

**No copy repeats across pages.** The bio paragraph exists on Home only.

## 4. Page specs

### 4.1 Home
Single narrow column, top to bottom:
1. Nav.
2. Small rounded-square avatar, 56–64px. A face, not a portrait.
3. Mono eyebrow: `software engineer @ rokt · nyc`.
4. Headline (Inter 600, one line on desktop): positioning statement — working draft: *"Backend engineer, building for the person on the other end of the request."*
5. Bio, 2–3 lines, human voice: current role, BC CS grad, interest in backend + end-user-minded building, mentions of music and training. Final copy needs Justin's approval.
6. Mono link row: `github · linkedin · resume · email` (resume = PDF in `/public`).
7. **Spotify block** at page bottom:
   - Header row: `recently_played` / `top_tracks` toggle (mono). Small `via spotify` label.
   - 4–6 minimal track rows: album art (~32px, rounded), track title (Inter 500), artist (mono, gray), relative timestamp (mono, dim) for recently-played.
   - **Failure mode: if the Spotify fetch errors or returns empty, the entire block unmounts.** The page must read as complete without it. No skeletons that never resolve, no error text.
   - Podcasts: cut from v1.

### 4.2 About
1. Nav.
2. Eyebrow `about` + heading `Who I am.` — no bio paragraph (Home owns it).
3. **Photo fan hero**: 4 travel/candid photos spanning the content width, each slightly rotated (−5° to +5°), overlapping edges, rounded corners, subtle border. Hover: straighten to 0° + lift. This is the page's one playful moment. (Inspired by reference, not copied: our photos are larger-radius, on the site grid, with mono caption potential later.)
4. Section label `timeline` (mono, top-bordered), then entries — one line each:
   - Layout: company (Inter 600) · role (Inter italic, gray) · years (mono, right-aligned) · one lowercase human note below (no résumé bullets — the PDF résumé carries the detail).
   - Entries: **Rokt** (Software Engineer, 2025–now, green dot) → **Content Academy** (Lead Software Engineer) → **Teamworks** (SWE Intern, Summer 2024) → **LG Electronics** (SWE Intern, Summer 2023) → **Boston College** (B.A. Computer Science, 2021–2025).
   - Dates to confirm with Justin: Rokt start date; Content Academy real range (old site says "December 2024 - May 2024", which is impossible).
5. Section label `projects`, then 2–3 quiet rows (no screenshots, no cards):
   - Row: name (Inter 600) + mono stack right-aligned; one honest sentence below; mono links `github ↗` / `live ↗`.
   - Projects: Content Academy, Polarity, (optional third: Resolve). Descriptions rewritten shorter and plainer than the current site's paragraphs.

### 4.3 Training
Nav label: `training`. Page eyebrow: `off hours`. Heading: `The training log.`
1. Short lede (1–2 lines, human, no bravado).
2. **PR stat blocks** — three cards (`#111`, `#222` border): big mono number + small mono label:
   - `315 lbs` / squat · `255 lbs` / bench @ 185 bw · `18 reps` / pull-ups
3. **Goal bar** — card: `current_goal: bench 315` (goal name in accent), `255 / 315` right-aligned, 4px progress bar (accent fill, 81%), quiet footnote ("updated when it happens, not before"). Fills on scroll-into-view.
4. Section `log` — **changelog**: reverse-chronological, left-railed like the timeline. Entry: mono date (`YYYY-MM`) + one sentence, key numbers bolded. Newest entry gets the green dot. Seed with real history (PRs, both half marathons — real times/dates from Justin's Strava/Nike app records).
5. Section `proof` — small photo strip (3–4 running/gym photos with friends, same rounded style, no fan rotation).

**Data-first design:** the whole page renders from `src/data/training.js`. Updating = appending one object. See §5.

### 4.4 Contact
1. Eyebrow `contact` + heading + one-line intro ("Let's talk" energy, not desperate).
2. **Channel cards** — three: Email (`justinklee.dev@gmail.com`, mailto), LinkedIn (`in/justinklee1253`), GitHub (`justinklee1253`). Card: icon, channel name (Inter 500), handle (mono, gray). Subtle border, hover border-lightens.
3. **`book_a_call`** section — two cards: **15 min** (quick chat) and **30 min** (real conversation). Each opens the corresponding Cal.com booking (embed popup via `@calcom/embed-react`; plain links as fallback). No 60-min tier in v1.
4. Minimal footer: mono, small: name + year. No icon farm.

**Setup task for Justin:** create a free Cal.com account with two event types (15 min, 30 min) and provide the two booking URLs.

## 5. Content & data architecture

All mutable content lives in plain data modules — updating the site means editing data, not JSX:

```
src/data/
  profile.js    — name, role, eyebrow, bio lines, social URLs, resume path
  timeline.js   — [{ company, role, years, note, current }]
  projects.js   — [{ name, description, stack: [], github, live? }]
  training.js   — { prs: [{ label, value, unit, note? }],
                    goal: { label, current, target, unit },
                    log: [{ date: 'YYYY-MM', text, highlight? }],
                    photos: [] }
```

**Future-sync seam (v2, not built now):** the `training.js` shapes are the contract. A future Whoop/Strava integration (Justin has a new Whoop) would be a scheduled function writing the same record shapes — no page changes required. A possible "today's recovery" line from Whoop is explicitly v2.

## 6. Integrations

### Spotify (v1)
- One **Netlify Function** (`netlify/functions/spotify.js`): holds `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` as env vars; exchanges refresh token for access token; proxies `recently-played` and `top-tracks`; returns a trimmed JSON payload (title, artist, album art URL, played_at, external URL).
- Cache: `Cache-Control: public, s-maxage=120` on the function response — enough to keep API usage trivial.
- Frontend: single fetch per page view; on any error → block unmounts (see §4.1).
- **Setup task for Justin:** create a Spotify developer app, run the one-time auth flow to obtain the refresh token (implementation plan will include a helper script), add the three env vars in Netlify.

### Cal.com (v1)
- `@calcom/embed-react` popup embed on the two booking cards; graceful fallback to opening the Cal.com page in a new tab.

## 7. Tech stack & migration

- **Fresh Vite + React 18 app** replacing the CRA app **in this same repo** (keeps the GitHub remote and Netlify wiring). CRA (`react-scripts`) is deprecated and goes away entirely.
- React Router for the four routes. Tailwind (3.4.x) for styling with the design tokens (§2) in the config. framer-motion only for the motion budget (§2).
- Netlify: existing `_redirects` SPA rule carries over; functions dir added; deploy previews unaffected.
- Carried over from the old app: photo assets (curated subset), `resumecv.pdf` (Justin to confirm it's current).
- Deleted: all old components, stars/particles CSS, blob keyframes, Capro font, unused deps (`react-github-calendar`, `date-fns`, testing-library boilerplate).
- New meta: real `<title>` ("Justin Lee — Software Engineer"), honest meta description, OG/Twitter card tags, new favicon (simple monogram on `#0a0a0a`).

## 8. Out of scope (v2 candidates)

- Whoop sync + "today's recovery" line; live Strava sync.
- Spotify podcasts row.
- Light theme.
- 60-minute call tier.
- Blog/writing section.
- Travel page or map (photos on About carry travel for now).

## 9. Copy guidelines

- Sentence-case headings; lowercase mono labels (`recently_played`, `current_goal`, `off hours`).
- Human notes are lowercase, wry, specific ("three plates, finally"). Numbers do the bragging; the prose stays modest.
- No résumé-speak anywhere on the site ("Led a team of 4 to architect and deploy…" is banned). The PDF résumé holds that register.
- All final copy gets Justin's sign-off before launch.

## 10. Inputs needed from Justin during implementation

| Item | For |
|---|---|
| 4 travel/candid photos | About photo fan |
| 3–4 gym/running photos | Training proof strip |
| 1 avatar photo | Home |
| Real half-marathon times + dates | Training log seed |
| Rokt start date + exact title; Content Academy true dates | Timeline |
| Current resume PDF | Home link |
| Cal.com account + 2 event links | Contact |
| Spotify developer app + refresh token (guided) | Spotify block |
| Copy approval pass | All pages |

## 11. Verification

- `npm run build` + lint clean.
- Every page eyeballed at 375px / 768px / 1280px widths.
- Spotify block verified in all three states: data present, API erroring (block absent), slow response (no layout shift when it appears).
- Cal.com both tiers open correctly.
- Lighthouse sanity pass (perf + a11y) — the design should score well by construction; fix regressions, don't chase 100s.

## 12. Decision log (from brainstorming, 2026-07-06)

| Decision | Choice | Rejected alternatives |
|---|---|---|
| Site goal | Hiring + presence, personality as seasoning | Booking-first, expression-first |
| Structure | 4 pages: home / about / training / contact | Single-page scroll |
| Typographic voice | Grotesque + mono detail (Inter + JetBrains Mono) | Pure monochrome grotesque; editorial serif |
| Accent | Muted green `#9fe8b8`, strict budget | No accent; louder accent |
| Home composition | Narrow column + small avatar | No photo; split hero with large photo |
| About composition | Photo-fan hero + quiet project rows, no repeated bio | Single portrait; screenshot project cards |
| Training concept | Dashboard + changelog hybrid | Dashboard only; changelog only |
| Fitness nav label | `training` | hobbies; off hours (kept as page eyebrow) |
| Call tiers | 15 + 30 min | +60 min; 30 only |
| Theming | Dark only | Dark + light toggle |
| Contact channels | Email, LinkedIn, GitHub | + Instagram, Discord |
