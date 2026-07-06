import { motion } from "framer-motion";

const tilts = [-5, 2, -2, 5];

export default function PhotoFan({ photos }) {
  if (!photos.length) return null;
  // z-index in whileHover works because these imgs are flex items
  // (static-position z-index exception) — keep the parent display:flex
  return (
    <div className="my-12 flex justify-center">
      {photos.map((src, i) => (
        <motion.img
          key={src}
          src={src}
          alt=""
          width={176}
          height={176}
          className="-mx-2 h-36 w-36 rounded-xl border border-edge object-cover shadow-lg sm:h-44 sm:w-44"
          style={{ rotate: tilts[i % tilts.length] }}
          whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      ))}
    </div>
  );
}
