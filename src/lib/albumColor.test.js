import { describe, it, expect } from "vitest";
import { pickDominant, wash } from "./albumColor.js";

const px = (...rgbs) => new Uint8ClampedArray(rgbs.flatMap(([r, g, b]) => [r, g, b, 255]));

describe("pickDominant", () => {
  it("picks a saturated mid-lightness color over gray", () => {
    expect(pickDominant(px([120, 120, 120], [200, 40, 40], [130, 130, 130]))).toEqual([200, 40, 40]);
  });
  it("falls back to the average for grayscale art", () => {
    expect(pickDominant(px([40, 40, 40], [80, 80, 80]))).toEqual([60, 60, 60]);
  });
  it("returns null for empty input", () => {
    expect(pickDominant(null)).toBeNull();
    expect(pickDominant(new Uint8ClampedArray(0))).toBeNull();
  });
});

describe("wash", () => {
  it("formats rgba", () => {
    expect(wash([16, 32, 48], 0.1)).toBe("rgba(16, 32, 48, 0.1)");
  });
});
