import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionNavLink = motion.create(NavLink);

const links = [
  ["home", "/"],
  ["about", "/about"],
  ["training", "/training"],
  ["contact", "/contact"],
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function Nav() {
  return (
    <header className="flex items-baseline justify-between py-8">
      <NavLink to="/" className={`font-mono text-sm text-ink ${focusRing}`}>
        justin lee
      </NavLink>
      <nav className="-mr-2.5 flex gap-0 sm:gap-1">
        {links.map(([label, to]) => (
          <MotionNavLink
            key={to}
            to={to}
            end={to === "/"}
            whileTap={{ scale: 0.96 }}
            className={({ isActive }) =>
              `relative rounded-full px-2.5 py-1 font-mono text-xs transition-colors sm:text-[13px] ${focusRing} ${
                isActive ? "text-accent" : "text-ink-dim hover:text-ink-body"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-accent/30 bg-accent/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{label}</span>
              </>
            )}
          </MotionNavLink>
        ))}
      </nav>
    </header>
  );
}
