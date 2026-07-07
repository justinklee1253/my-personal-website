import { describe, it, expect } from "vitest";
import { training } from "./training.js";

describe("training data invariants", () => {
  it("log is newest-first (YYYY-MM sorts lexicographically)", () => {
    const dates = training.log.map((e) => e.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("goal progress is between 0 and 100 percent", () => {
    const pct = (training.goal.current / training.goal.target) * 100;
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it("every log entry has a date and text", () => {
    for (const entry of training.log) {
      expect(entry.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
      expect(entry.text.length).toBeGreaterThan(0);
    }
  });
});
