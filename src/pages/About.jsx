import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PhotoFan from "../components/PhotoFan.jsx";
import { timeline } from "../data/timeline.js";
import { projects } from "../data/projects.js";
import fan1 from "../assets/fan/fan-1.jpg";
import fan2 from "../assets/fan/fan-2.jpg";

const photos = [fan1, fan2]; // grows to 4 when Justin supplies travel candids

export default function About() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">about</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Who I am.
      </h1>

      <PhotoFan photos={photos} />

      <SectionLabel>timeline</SectionLabel>
      <ol className="ml-1 space-y-7 border-l border-edge pl-6">
        {timeline.map((item) => (
          <li key={item.company} className="relative">
            <span
              className={`absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border ${
                item.current ? "border-accent bg-accent" : "border-ink-dim bg-canvas"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{item.company}</span>
              <span className="text-sm italic text-ink-body">{item.role}</span>
              <span className="ml-auto font-mono text-xs text-ink-dim">
                {item.years}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-body">{item.note}</p>
          </li>
        ))}
      </ol>

      <SectionLabel>projects</SectionLabel>
      <ul>
        {projects.map((p) => (
          <li key={p.name} className="border-b border-edge/60 py-5 first:pt-0">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{p.name}</span>
              <span className="ml-auto font-mono text-xs text-ink-dim">
                {p.stack}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">{p.description}</p>
            <p className="mt-2 flex gap-4 font-mono text-xs">
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-dim transition-colors hover:text-accent"
              >
                github ↗
              </a>
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-dim transition-colors hover:text-accent"
                >
                  live ↗
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Page>
  );
}
