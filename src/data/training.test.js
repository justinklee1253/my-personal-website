import { describe, it, expect } from "vitest";
import { training } from "./training.js";

describe("training data invariants", () => {
  it("goal progress is between 0 and 100 percent", () => {
    const pct = (training.goal.current / training.goal.target) * 100;
    expect(pct).toBeGreaterThan(0);
    expect(pct).toBeLessThanOrEqual(100);
  });
});
