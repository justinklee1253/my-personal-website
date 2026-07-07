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
