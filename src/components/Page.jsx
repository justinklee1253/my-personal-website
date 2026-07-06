import { motion } from "framer-motion";

export default function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="pb-24"
    >
      {children}
    </motion.main>
  );
}
