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
    console.error("spotify function error:", err);
    return new Response(JSON.stringify({ error: "upstream_error" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}
