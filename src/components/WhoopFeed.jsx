import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel.jsx";

const PAGE_SIZE = 8;

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function Stat({ label, value }) {
  return (
    <span className="flex flex-col">
      <span className="font-mono text-sm text-ink">{value}</span>
      <span className="font-mono text-[10px] text-ink-dim">{label}</span>
    </span>
  );
}

function ActivityCard({ a }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-edge bg-surface p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-ink">{a.sport}</span>
        <span className="font-mono text-[11px] text-ink-dim">{fmtDate(a.start)}</span>
      </div>
      <div className="mt-3 flex gap-6">
        <Stat label="duration" value={fmtDuration(a.durationMin)} />
        {a.strain != null && <Stat label="strain" value={a.strain.toFixed(1)} />}
        {a.avgHr != null && <Stat label="avg hr" value={`${a.avgHr}`} />}
        {a.calories != null && <Stat label="cal" value={`${a.calories}`} />}
      </div>
    </motion.li>
  );
}

function Skeleton() {
  return (
    <ul className="space-y-3 animate-pulse" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="rounded-xl border border-edge bg-surface p-5">
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded bg-edge" />
            <div className="h-3 w-12 rounded bg-edge" />
          </div>
          <div className="mt-4 flex gap-6">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-6 w-10 rounded bg-edge" />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function WhoopFeed() {
  const [activities, setActivities] = useState(null); // null = loading
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/whoop")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
      .then((json) => {
        if (!cancelled) setActivities(json.activities ?? []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SectionLabel>log · via WHOOP</SectionLabel>
      {failed && (
        <p className="font-mono text-xs text-ink-dim">Activity feed unavailable.</p>
      )}
      {!failed && activities === null && <Skeleton />}
      {!failed && activities !== null && activities.length === 0 && (
        <p className="font-mono text-xs text-ink-dim">No activities in the last 30 days.</p>
      )}
      {!failed && activities !== null && activities.length > 0 && (
        <>
          <ul className="space-y-3">
            {activities.slice(0, visible).map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </ul>
          {visible < activities.length && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-5 rounded-full border border-edge px-4 py-1.5 font-mono text-xs text-ink-dim transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Load more
            </button>
          )}
        </>
      )}
    </>
  );
}
