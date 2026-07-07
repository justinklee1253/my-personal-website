import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import { profile } from "../data/profile.js";

const channels = [
  { name: "email", handle: profile.email, href: `mailto:${profile.email}` },
  { name: "linkedin", handle: "in/justinklee1253", href: "https://www.linkedin.com/in/justinklee1253/" },
  { name: "github", handle: "justinklee1253", href: "https://github.com/justinklee1253" },
];

const cardCls =
  "block rounded-xl border border-edge p-5 transition-colors hover:border-ink-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function CallCard({ minutes, blurb, calLink }) {
  const inner = (
    <>
      <p className="font-mono text-sm text-ink">{minutes} min</p>
      <p className="mt-1 text-sm text-ink-body">{blurb}</p>
      <p className="mt-3 font-mono text-[11px] text-ink-dim">book a slot →</p>
    </>
  );
  if (!calLink) {
    return (
      <a
        className={cardCls}
        href={`mailto:${profile.email}?subject=${encodeURIComponent(`${minutes} min call`)}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={`${cardCls} w-full text-left`} data-cal-link={calLink}>
      {inner}
    </button>
  );
}

export default function Contact() {
  useEffect(() => {
    if (!profile.cal.fifteen && !profile.cal.thirty) return;
    (async () => {
      const cal = await getCalApi();
      cal("ui", { theme: "dark" });
    })();
  }, []);

  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">contact</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Say hello.
      </h1>
      <p className="mt-3 text-sm leading-relaxed">
        Open to interesting problems, good questions, and restaurant recommendations.
      </p>

      <SectionLabel>channels</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {channels.map((c) => {
          const external = c.href.startsWith("http");
          return (
            <a
              key={c.name}
              href={c.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={cardCls}
            >
              <p className="text-sm font-medium text-ink">{c.name}</p>
              <p className="mt-1 break-all font-mono text-xs text-ink-dim">{c.handle}</p>
            </a>
          );
        })}
      </div>

      <SectionLabel>Book a Call</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <CallCard minutes={15} blurb="Quick chat — a question, an intro, a sanity check." calLink={profile.cal.fifteen} />
        <CallCard minutes={30} blurb="A real conversation — careers, projects, ideas." calLink={profile.cal.thirty} />
      </div>

      <footer className="mt-20 border-t border-edge pt-6 font-mono text-xs text-ink-dim">
        © {new Date().getFullYear()} justin lee
      </footer>
    </Page>
  );
}
