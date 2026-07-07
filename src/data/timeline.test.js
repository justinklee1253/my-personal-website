import { describe, it, expect } from "vitest";
import { timeline } from "./timeline.js";

describe("timeline data invariants", () => {
  it("uses the requested brand color for each company dot", () => {
    const colorsByCompany = Object.fromEntries(
      timeline.map(({ company, color }) => [company, color]),
    );

    expect(colorsByCompany).toEqual({
      Rokt: "#C20075",
      "Content Academy": "#4169E1",
      Teamworks: "#FFFFFF",
      "LG Electronics": "#FF0038",
      "Boston College": "#98002E",
    });
  });
});
