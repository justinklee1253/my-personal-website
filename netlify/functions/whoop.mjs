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
