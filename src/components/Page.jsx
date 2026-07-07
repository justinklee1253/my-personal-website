import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Page({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.main
      ref={ref}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="pb-24 outline-none"
    >
      {children}
    </motion.main>
  );
}
