import Page from "../components/Page.jsx";
import SectionLabel from "../components/SectionLabel.jsx";
import { profile } from "../data/profile.js";

export default function Privacy() {
  return (
    <Page>
      <p className="mt-6 font-mono text-xs text-accent">legal</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Privacy policy.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-body">
        This is a personal website operated by {profile.name}. It connects to
        the WHOOP API to display the owner&apos;s own recent fitness activity on
        the training page. This policy explains exactly what that involves.
      </p>
      <p className="mt-2 font-mono text-[11px] text-ink-dim">Last updated: July 2026</p>

      <SectionLabel>who this applies to</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        This is a single-user, personal project. The only WHOOP account
        connected to it is the owner&apos;s own. There is no sign-in or account
        creation for visitors — no one else can connect a WHOOP account or
        authenticate through this site. Visitors can only view the activity the
        owner chooses to display.
      </p>

      <SectionLabel>what data is accessed</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        With the owner&apos;s authorization, the site uses read-only access
        (WHOOP scope <span className="font-mono text-xs">read:workout</span>) to
        the owner&apos;s own workout activities. This includes each
        activity&apos;s type, start time, duration, and, when available, day
        strain, average heart rate, and calories. No other WHOOP data is
        requested.
      </p>

      <SectionLabel>what is stored</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        Nothing is stored in a database. Activity data is fetched live from the
        WHOOP API each time the training page is loaded and is not persisted or
        logged. For performance, responses may be cached briefly at the content
        delivery network edge (up to five minutes) and are then discarded. Only
        activities from the past 30 days are ever requested.
      </p>

      <SectionLabel>how it is used and shared</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        The data is used solely to display the owner&apos;s recent activity on
        this website. It is not sold, and it is not shared with any third party.
        WHOOP access credentials are kept server-side and are never exposed to
        visitors.
      </p>

      <SectionLabel>revoking access</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        The owner can revoke this application&apos;s access at any time from the
        WHOOP account settings, which immediately stops all data access.
      </p>

      <SectionLabel>contact</SectionLabel>
      <p className="text-sm leading-relaxed text-ink-body">
        Questions about this policy can be sent to{" "}
        <a
          href={`mailto:${profile.email}`}
          className="text-accent underline decoration-edge underline-offset-2 transition-colors hover:decoration-accent"
        >
          {profile.email}
        </a>
        .
      </p>
    </Page>
  );
}
