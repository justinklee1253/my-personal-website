import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Total time to type the whole string, in ms. Per-character speed derives
// from the length so the pacing stays even regardless of the word.
const TYPING_DURATION = 975;

export default function Typewriter({ text }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? text.length : 0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const step = TYPING_DURATION / text.length;
    let typed = 0;
    const id = setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= text.length) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [text, reduce]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden="true"
        className={`ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] bg-accent align-baseline ${
          done ? "animate-blink" : ""
        }`}
      />
    </>
  );
}
