import { describe, it, expect } from "vitest";
import { trimRecent, trimTop } from "./trim.mjs";

const track = {
  name: "Afterglow",
  artists: [{ name: "dami" }, { name: "guest" }],
  album: {
    images: [
      { url: "https://img/640" },
      { url: "https://img/300" },
      { url: "https://img/64" },
    ],
  },
  external_urls: { spotify: "https://open.spotify.com/track/x" },
};

describe("trimRecent", () => {
  it("maps items to trimmed shape with smallest album art", () => {
    const out = trimRecent({
      items: [{ track, played_at: "2026-07-06T14:00:00.000Z" }],
    });
    expect(out).toEqual([
      {
        title: "Afterglow",
        artist: "dami, guest",
        art: "https://img/64",
        url: "https://open.spotify.com/track/x",
        playedAt: "2026-07-06T14:00:00.000Z",
      },
    ]);
  });

  it("returns [] for missing items", () => {
    expect(trimRecent({})).toEqual([]);
  });
});

describe("trimTop", () => {
  it("maps bare tracks with null playedAt", () => {
    const out = trimTop({ items: [track] });
    expect(out[0].playedAt).toBeNull();
    expect(out[0].title).toBe("Afterglow");
  });

  it("tolerates missing album art", () => {
    const bare = { ...track, album: { images: [] } };
    expect(trimTop({ items: [bare] })[0].art).toBeNull();
  });
});
