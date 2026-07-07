import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import PhotoFan from "../components/PhotoFan.jsx";
import { timeline } from "../data/timeline.js";
import { projects } from "../data/projects.js";
import { fanPhotos } from "../data/fanPhotos.js";

export default function About() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">about</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Who I am.
      </h1>

      <PhotoFan photos={fanPhotos} />

      <SectionLabel>timeline</SectionLabel>
      <ol className="ml-1 space-y-7 border-l border-edge pl-6">
        {timeline.map((item) => (
          <li
            key={`${item.company}-${item.years}`}
            className="group relative origin-left transition-transform duration-200 ease-out hover:translate-x-1 hover:scale-[1.015]"
          >
            <span
              className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full border transition-transform duration-200 ease-out group-hover:scale-125"
              style={{
                backgroundColor: item.color,
                borderColor: item.color,
                boxShadow: `0 0 0 3px ${item.color}3d, 0 0 16px ${item.color}33`,
              }}
            />
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{item.company}</span>
              <span className="text-sm italic text-ink-body transition-colors duration-200 group-hover:text-ink">
                {item.role}
              </span>
              <span className="ml-auto font-mono text-xs text-ink-dim transition-colors duration-200 group-hover:text-ink-body">
                {item.years}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-body transition-colors duration-200 group-hover:text-ink">
              {item.note}
            </p>
          </li>
        ))}
      </ol>

      <SectionLabel>projects</SectionLabel>
      <ul>
        {projects.map((p) => (
          <li
            key={p.name}
            className="group origin-left border-b border-edge/60 py-5 transition-transform duration-200 ease-out first:pt-0 hover:translate-x-1 hover:scale-[1.015] hover:border-edge"
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold text-ink">{p.name}</span>
              <span className="ml-auto font-mono text-xs text-ink-dim transition-colors duration-200 group-hover:text-ink-body">
                {p.stack}
              </span>
            </div>
            {Array.isArray(p.description) ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed transition-colors duration-200 group-hover:text-ink">
                {p.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed transition-colors duration-200 group-hover:text-ink">
                {p.description}
              </p>
            )}
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
