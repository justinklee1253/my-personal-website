import Page from "../components/Page.jsx";
import { profile } from "../data/profile.js";
import avatar from "../assets/avatar.jpg";
import SpotifyBlock from "../components/SpotifyBlock.jsx";

export default function Home() {
  return (
    <Page>
      <img
        src={avatar}
        alt="Justin Lee"
        width={64}
        height={64}
        className="mt-6 h-16 w-16 rounded-xl border border-edge object-cover"
      />
      <p className="mt-8 font-mono text-xs text-accent">{profile.eyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {profile.headline}
      </h1>
      <p className="mt-6 text-base leading-relaxed">{profile.bio}</p>
      <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
        {profile.links.map(({ label, href }) => {
          const external = href.startsWith("http") || href.endsWith(".pdf");
          return (
            <li key={label}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="border-b border-edge pb-0.5 font-mono text-xs text-ink-body transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
      <SpotifyBlock />
    </Page>
  );
}
