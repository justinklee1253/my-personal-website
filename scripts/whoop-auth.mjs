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
