import { describe, it, expect } from "vitest";
import { relativeTime } from "./relativeTime.js";

const NOW = new Date("2026-07-06T12:00:00Z").getTime();

describe("relativeTime", () => {
  it("under a minute → just now", () => {
    expect(relativeTime("2026-07-06T11:59:30Z", NOW)).toBe("just now");
  });
  it("minutes", () => {
    expect(relativeTime("2026-07-06T11:15:00Z", NOW)).toBe("45m ago");
  });
  it("hours", () => {
    expect(relativeTime("2026-07-06T04:00:00Z", NOW)).toBe("8h ago");
  });
  it("days", () => {
    expect(relativeTime("2026-07-01T12:00:00Z", NOW)).toBe("5d ago");
  });
});
