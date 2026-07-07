import { describe, it, expect } from "vitest";
import { getAccessToken } from "./whoop-token.mjs";

const T = 1_000_000_000_000; // fixed "now"
const now = () => T;
const env = {
  WHOOP_REFRESH_TOKEN: "ENV_R",
  WHOOP_CLIENT_ID: "cid",
  WHOOP_CLIENT_SECRET: "sec",
};

// Minimal fake Netlify Blobs store backed by a single mutable value.
function makeStore(initial = null) {
  let data = initial;
  return {
    get: async () => data,
    setJSON: async (_key, value) => {
      data = value;
    },
    _set: (v) => {
      data = v;
    },
    _get: () => data,
  };
}

function okToken({ access = "A1", refresh = "R1", expiresIn = 3600 } = {}) {
  return async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      access_token: access,
      refresh_token: refresh,
      expires_in: expiresIn,
    }),
  });
}

describe("getAccessToken", () => {
  it("reuses a cached, unexpired access token without calling fetch", async () => {
    const store = makeStore({
      accessToken: "A0",
      accessTokenExpiry: T + 3_600_000,
      refreshToken: "R0",
    });
    let called = false;
    const fetch = async () => {
      called = true;
      return okToken()();
    };
    const token = await getAccessToken({ store, env, fetch, now });
    expect(token).toBe("A0");
    expect(called).toBe(false);
  });

  it("refreshes when no access token is cached and persists the rotated tokens", async () => {
    const store = makeStore({ refreshToken: "R0" });
    let sentRefresh;
    const fetch = async (_url, opts) => {
      sentRefresh = opts.body.get("refresh_token");
      return okToken({ access: "A1", refresh: "R1", expiresIn: 3600 })();
    };
    const token = await getAccessToken({ store, env, fetch, now });
    expect(sentRefresh).toBe("R0");
    expect(token).toBe("A1");
    expect(store._get()).toEqual({
      refreshToken: "R1",
      accessToken: "A1",
      accessTokenExpiry: T + 3_600_000,
    });
  });

  it("refreshes when the cached access token is within the expiry margin", async () => {
    const store = makeStore({
      accessToken: "A0",
      accessTokenExpiry: T + 30_000, // inside the 60s safety margin -> treat as expired
      refreshToken: "R0",
    });
    const fetch = okToken({ access: "A2", refresh: "R2" });
    const token = await getAccessToken({ store, env, fetch, now });
    expect(token).toBe("A2");
  });

  it("seeds the refresh token from env when the store is empty", async () => {
    const store = makeStore(null);
    let sentRefresh;
    const fetch = async (_url, opts) => {
      sentRefresh = opts.body.get("refresh_token");
      return okToken()();
    };
    await getAccessToken({ store, env, fetch, now });
    expect(sentRefresh).toBe("ENV_R");
  });

  it("recovers from a concurrent rotation: on 400, reuses a token another request just wrote", async () => {
    const store = makeStore({ refreshToken: "R0" });
    const fetch = async () => {
      // simulate a concurrent request winning the rotation and writing fresh state
      store._set({
        refreshToken: "R1",
        accessToken: "A1",
        accessTokenExpiry: T + 3_600_000,
      });
      return { ok: false, status: 400, text: async () => "invalid_grant" };
    };
    const token = await getAccessToken({ store, env, fetch, now });
    expect(token).toBe("A1");
  });

  it("throws when refresh fails and no valid token is available", async () => {
    const store = makeStore({ refreshToken: "R0" });
    const fetch = async () => ({
      ok: false,
      status: 400,
      text: async () => "invalid_grant",
    });
    await expect(getAccessToken({ store, env, fetch, now })).rejects.toThrow(
      /400/
    );
  });

  it("reads with strong consistency so a concurrent rotation is seen (no stale 502)", async () => {
    // Model Netlify Blobs' default eventual consistency: only strong reads see
    // the latest write; eventual reads return a stale snapshot.
    let live = { refreshToken: "R0" };
    const store = {
      get: async (_key, opts) =>
        opts?.consistency === "strong" ? live : { refreshToken: "R0" },
      setJSON: async (_key, value) => {
        live = value;
      },
    };
    const fetch = async () => {
      // a concurrent request already rotated R0 -> R1 and wrote fresh state
      live = { refreshToken: "R1", accessToken: "A1", accessTokenExpiry: T + 3_600_000 };
      return { ok: false, status: 400, text: async () => "invalid_grant" };
    };
    // Only recoverable if the re-read after the 400 is strongly consistent.
    const token = await getAccessToken({ store, env, fetch, now });
    expect(token).toBe("A1");
  });

  it("retries the blob write once if the first write fails", async () => {
    let writes = 0;
    let saved = null;
    const store = {
      get: async () => ({ refreshToken: "R0" }),
      setJSON: async (_key, value) => {
        writes += 1;
        if (writes === 1) throw new Error("blob unavailable");
        saved = value;
      },
    };
    const fetch = okToken({ access: "A1", refresh: "R1" });
    const token = await getAccessToken({ store, env, fetch, now });
    expect(token).toBe("A1");
    expect(writes).toBe(2);
    expect(saved.refreshToken).toBe("R1");
  });
});
