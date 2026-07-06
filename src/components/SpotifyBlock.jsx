import { useEffect, useState } from "react";
import SectionLabel from "./SectionLabel.jsx";
import { relativeTime } from "../lib/relativeTime.js";
import { useAlbumColor, wash } from "../lib/albumColor.js";

const FEEDS = [
  ["recent", "Recently Played"],
  ["top", "Top Tracks"],
];

const cardFocus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function FeaturedTrack({ track, label }) {
  // color comes from the small thumb (16x16 downsample makes it sufficient);
  // the card displays artLarge — don't "fix" this to extract from artLarge
  const color = useAlbumColor(track.art);
  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group mb-3 flex items-center gap-5 rounded-xl border border-edge bg-surface p-5 transition-colors duration-500 ${cardFocus}`}
      style={color ? { backgroundColor: wash(color, 0.22), borderColor: wash(color, 0.4) } : undefined}
    >
      {(track.artLarge ?? track.art) && (
        <img
          src={track.artLarge ?? track.art}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          className="h-24 w-24 rounded-lg border border-edge object-cover"
        />
      )}
      <span className="min-w-0">
        <span className="block font-mono text-[11px] text-ink-dim">{label}</span>
        <span className="mt-1.5 block truncate text-xl font-semibold text-ink">
          {track.title}
        </span>
        <span className="mt-1 block truncate font-mono text-xs text-ink-body">{track.artist}</span>
      </span>
    </a>
  );
}

function TrackRow({ track, rank }) {
  const color = useAlbumColor(track.art);
  return (
    <li>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-3 rounded-lg border border-edge bg-surface p-3 transition-colors duration-500 ${cardFocus}`}
        style={color ? { backgroundColor: wash(color, 0.1), borderColor: wash(color, 0.25) } : undefined}
      >
        {track.art && (
          <img
            src={track.art}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 rounded border border-edge object-cover"
          />
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink-body transition-colors group-hover:text-ink">
            {track.title}
          </span>
          <span className="block truncate font-mono text-xs text-ink-dim">{track.artist}</span>
        </span>
        {rank != null && (
          <span className="font-mono text-[11px] text-ink-dim">{String(rank).padStart(2, "0")}</span>
        )}
        {track.playedAt && (
          <span className="font-mono text-[11px] text-ink-dim">{relativeTime(track.playedAt)}</span>
        )}
      </a>
    </li>
  );
}

export default function SpotifyBlock() {
  const [feed, setFeed] = useState("recent");
  const [cache, setCache] = useState({});
  const [failed, setFailed] = useState({});

  useEffect(() => {
    let cancelled = false;
    for (const [key] of FEEDS) {
      fetch(`/api/spotify?feed=${key}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
        .then((json) => {
          if (cancelled) return;
          if (!json.tracks?.length) throw new Error("empty");
          setCache((c) => ({ ...c, [key]: json.tracks }));
        })
        .catch(() => {
          if (!cancelled) setFailed((f) => ({ ...f, [key]: true }));
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // if the active feed failed but the other one loaded, switch to it
  useEffect(() => {
    if (!failed[feed]) return;
    const alt = FEEDS.find(([key]) => key !== feed && !failed[key]);
    if (alt) setFeed(alt[0]);
  }, [failed, feed]);

  if (!cache.recent && !cache.top) return null;

  const list = cache[feed] ?? [];
  const featured = list[0];
  const rows = list.slice(1);
  const toggles = FEEDS.filter(([key]) => !failed[key]);

  return (
    <section>
      <SectionLabel>
        <span className="flex items-baseline justify-between">
          <span className="flex gap-4">
            {toggles.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={feed === key}
                onClick={() => setFeed(key)}
                className={`transition-colors ${
                  feed === key ? "text-ink-body" : "text-ink-dim hover:text-ink-body"
                }`}
              >
                {label}
              </button>
            ))}
          </span>
          <span>via Spotify</span>
        </span>
      </SectionLabel>
      {featured && (
        <FeaturedTrack
          track={featured}
          label={
            feed === "top"
              ? "#1 This Month"
              : featured.playedAt
                ? `Last Played · ${relativeTime(featured.playedAt)}`
                : "Last Played"
          }
        />
      )}
      <ul className="space-y-2">
        {rows.map((t, i) => (
          <TrackRow
            key={t.url + (t.playedAt ?? i)}
            track={t}
            rank={feed === "top" ? i + 2 : null}
          />
        ))}
      </ul>
    </section>
  );
}
