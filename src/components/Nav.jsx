import { NavLink } from "react-router-dom";

const links = [
  ["home", "/"],
  ["about", "/about"],
  ["training", "/training"],
  ["contact", "/contact"],
];

export default function Nav() {
  return (
    <header className="flex items-baseline justify-between py-8">
      <NavLink to="/" className="font-mono text-sm text-ink">
        justin lee
      </NavLink>
      <nav className="flex gap-4 sm:gap-6">
        {links.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `font-mono text-xs sm:text-[13px] transition-colors ${
                isActive ? "text-accent" : "text-ink-dim hover:text-ink-body"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
