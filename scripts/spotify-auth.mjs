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
    if (!code) {
      console.error("Authorization failed or was denied.");
      res.end("Failed — check your terminal.");
      return process.exit(1);
    }
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
