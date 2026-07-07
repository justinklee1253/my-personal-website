// netlify/functions/whoop.mjs
import { getStore } from "@netlify/blobs";
import { getAccessToken } from "./lib/whoop-token.mjs";
import { trimWorkouts } from "./lib/whoop-trim.mjs";

const WORKOUT_URL = "https://api.prod.whoop.com/developer/v2/activity/workout";
const WINDOW_DAYS = 30;
const PAGE_LIMIT = 25;
const MAX_PAGES = 10; // safety cap: 250 workouts / 30 days is far more than real

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
    const store = getStore("whoop-auth");
    const token = await getAccessToken({ store, env: process.env, fetch });
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
    // TEMP DIAGNOSTIC: surface the real error in the response so we can curl
    // it in prod. REVERT this `detail` field once the root cause is found.
    return new Response(
      JSON.stringify({ error: "upstream_error", detail: String(err?.message ?? err) }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
