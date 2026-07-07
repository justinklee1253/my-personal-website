import { describe, it, expect } from "vitest";
import { fanPhotos } from "./fanPhotos.js";

describe("fan photos data invariants", () => {
  it("has exactly four photos for the About fan", () => {
    expect(fanPhotos).toHaveLength(4);
  });

  it("every photo has a src and full flip text", () => {
    for (const photo of fanPhotos) {
      expect(photo.src.length).toBeGreaterThan(0);
      expect(photo.date.length).toBeGreaterThan(0);
      expect(photo.location.length).toBeGreaterThan(0);
      expect(photo.caption.length).toBeGreaterThan(0);
    }
  });
});
