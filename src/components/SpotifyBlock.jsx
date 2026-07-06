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

  if (dead || (!cache.recent && !cache.top)) return null;
  const tracks = cache[feed] ?? [];

  return (
    <section>
      <SectionLabel>
        <span className="flex items-baseline justify-between">
          <span className="flex gap-4">
            {FEEDS.map(([key, label]) => (
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
                <img
                  src={t.art}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded border border-edge"
                />
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
