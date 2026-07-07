import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import { training } from "../data/training.js";
import WhoopFeed from "../components/WhoopFeed.jsx";
import WhoopComingSoon from "../components/WhoopComingSoon.jsx";

function GoalBar({ goal }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const pct = Math.round((goal.current / goal.target) * 100);
  return (
    <div ref={ref} className="mt-4 rounded-xl border border-edge bg-surface p-5">
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="text-ink-body">
          Current Goal: <span className="text-accent">{goal.label}</span>
        </span>
        <span className="text-ink-dim">
          {goal.current} / {goal.target}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded bg-edge">
        <motion.div
          className="h-full rounded bg-accent"
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2.5 font-mono text-[11px] text-ink-dim">
        {pct}%
      </p>
    </div>
  );
}

export default function Training() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">off hours</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        The training log.
      </h1>
      <p className="mt-3 text-sm leading-relaxed">{training.lede}</p>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {training.prs.map((pr) => (
          <div key={pr.label} className="rounded-xl border border-edge bg-surface p-4 sm:p-5">
            <p className="font-mono text-xl font-semibold text-ink sm:text-2xl">
              {pr.value}
              <span className="ml-1 text-xs font-normal text-ink-dim">{pr.unit}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] text-ink-dim sm:text-[11px]">
              {pr.label}
            </p>
          </div>
        ))}
      </div>

      <GoalBar goal={training.goal} />

      {/* Live feed locally; "coming soon" on deployed builds until WHOOP API access is approved */}
      {import.meta.env.DEV ? <WhoopFeed /> : <WhoopComingSoon />}

      {training.photos.length > 0 && (
        <>
          <SectionLabel>proof</SectionLabel>
          <div className="flex gap-3">
            {training.photos.map((src) => (
              <img
                key={src}
                src={src}
                alt="training"
                loading="lazy"
                className="h-24 w-32 rounded-lg border border-edge object-cover"
              />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
