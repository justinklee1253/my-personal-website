import { describe, it, expect } from "vitest";
import { trimWorkouts, SPORT_NAMES } from "./whoop-trim.mjs";

const scored = {
  id: "1043",
  start: "2026-07-06T14:00:00.000Z",
  end: "2026-07-06T15:12:00.000Z",
  sport_id: 233,
  sport_name: "Sauna",
  score_state: "SCORED",
  score: { strain: 8.4, average_heart_rate: 132, max_heart_rate: 170, kilojoule: 2510 },
};

describe("trimWorkouts", () => {
  it("maps a scored workout to the trimmed shape", () => {
    expect(trimWorkouts({ records: [scored] })).toEqual([
      {
        id: "1043",
        sport: "sauna",
        start: "2026-07-06T14:00:00.000Z",
        durationMin: 72,
        strain: 8.4,
        avgHr: 132,
        calories: 600, // 2510 / 4.184 = 599.9 -> 600
      },
    ]);
  });

  it("maps weightlifting slugs to 'lift'", () => {
    const lift = { ...scored, sport_id: 45, sport_name: "weightlifting_msk" };
    expect(trimWorkouts({ records: [lift] })[0].sport).toBe("lift");
  });

  it("maps infrared-sauna slugs to 'sauna'", () => {
    const infrared = { ...scored, sport_id: 233, sport_name: "infrared-sauna" };
    expect(trimWorkouts({ records: [infrared] })[0].sport).toBe("sauna");
  });

  it("prettifies and lowercases unknown slugs", () => {
    const hiit = { ...scored, sport_id: 999, sport_name: "high_intensity_interval_training" };
    expect(trimWorkouts({ records: [hiit] })[0].sport).toBe("high intensity interval training");
  });

  it("returns null stats for an unscored workout", () => {
    const pending = { ...scored, score_state: "PENDING_SCORE", score: null };
    const out = trimWorkouts({ records: [pending] });
    expect(out[0].strain).toBeNull();
    expect(out[0].avgHr).toBeNull();
    expect(out[0].calories).toBeNull();
    expect(out[0].durationMin).toBe(72); // duration still computable
  });

  it("falls back to the sport-id map when sport_name is missing", () => {
    const noName = { ...scored, sport_name: undefined };
    expect(trimWorkouts({ records: [noName] })[0].sport).toBe(SPORT_NAMES[233].toLowerCase());
  });

  it("falls back to 'activity' for an unknown sport with no name", () => {
    const unknown = { ...scored, sport_id: 99999, sport_name: undefined };
    expect(trimWorkouts({ records: [unknown] })[0].sport).toBe("activity");
  });

  it("sorts newest-first", () => {
    const older = { ...scored, id: "1", start: "2026-07-01T10:00:00.000Z", end: "2026-07-01T11:00:00.000Z" };
    const newer = { ...scored, id: "2", start: "2026-07-05T10:00:00.000Z", end: "2026-07-05T11:00:00.000Z" };
    const out = trimWorkouts({ records: [older, newer] });
    expect(out.map((w) => w.id)).toEqual(["2", "1"]);
  });

  it("returns [] for a missing records array", () => {
    expect(trimWorkouts({})).toEqual([]);
  });
});
