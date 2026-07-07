import { useState } from "react";
import { motion } from "framer-motion";

const tilts = [-5, 2, -2, 5];

const fanVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { x: "-110vw" },
  show: { x: 0, transition: { type: "spring", stiffness: 170, damping: 26 } },
};

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Card({ photo, tilt }) {
  const [hovered, setHovered] = useState(false);
  // tap (touch) / Enter (keyboard) pin the flip open; hover is mouse-only
  const [pinned, setPinned] = useState(false);
  const flipped = hovered || pinned;

  return (
    <motion.div
      variants={cardVariants}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${photo.location} — ${photo.caption}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTap={(e) => {
        if (e.pointerType === "touch") setPinned((p) => !p);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setPinned((p) => !p);
        }
      }}
      onBlur={() => setPinned(false)}
      className={`-mx-2 h-36 w-36 cursor-pointer rounded-xl sm:h-44 sm:w-44 ${focusRing}`}
      style={{ zIndex: flipped ? 10 : undefined }}
    >
      <motion.div
        className="h-full w-full [perspective:800px]"
        animate={{
          rotate: flipped ? 0 : tilt,
          y: flipped ? -8 : 0,
          scale: flipped ? 1.04 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <img
            src={photo.src}
            alt=""
            width={176}
            height={176}
            className="absolute inset-0 h-full w-full rounded-xl border border-edge object-cover shadow-lg [backface-visibility:hidden]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-edge bg-surface p-3 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <span className="font-mono text-[10px] text-ink-dim">{photo.date}</span>
            <span className="font-mono text-xs text-ink">{photo.location}</span>
            <span className="whitespace-pre-line font-mono text-[10px] leading-relaxed text-ink-body">
              {photo.caption}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoFan({ photos }) {
  if (!photos.length) return null;
  // z-index on flipped cards works because these are flex items
  // (static-position z-index exception) — keep the parent display:flex
  return (
    <motion.div
      className="my-12 flex justify-center"
      variants={fanVariants}
      initial="hidden"
      animate="show"
    >
      {photos.map((photo, i) => (
        <Card key={photo.src} photo={photo} tilt={tilts[i % tilts.length]} />
      ))}
    </motion.div>
  );
}
