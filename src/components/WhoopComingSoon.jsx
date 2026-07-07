import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel.jsx";

// Shown on deployed builds until WHOOP grants API access. Local dev renders the
// live <WhoopFeed /> instead (gated in Training.jsx via import.meta.env.DEV).
export default function WhoopComingSoon() {
  return (
    <section>
      <SectionLabel>log · via WHOOP</SectionLabel>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="rounded-xl border border-edge bg-surface p-8 text-center"
      >
        <p className="font-mono text-xs text-accent">coming soon</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-body">
          Live activity — workouts, hoops, sauna — syncing straight from my WHOOP.
        </p>
        <p className="mt-1 font-mono text-[11px] text-ink-dim">
          Waiting on WHOOP API access approval.
        </p>
      </motion.div>
    </section>
  );
}
