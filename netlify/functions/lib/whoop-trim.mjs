// WHOOP Sport ID -> name fallback (used only when sport_name is absent).
// Source: WHOOP official Sport ID table. Extend as needed.
export const SPORT_NAMES = {
  0: "Running",
  1: "Cycling",
  16: "Baseball",
  18: "Basketball",
  45: "Weightlifting",
  233: "Sauna",
  262: "Ice Bath",
};

const KJ_PER_KCAL = 4.184;

// Friendly display names for WHOOP sport slugs (keyed by normalized slug).
// Only needed where the desired label differs from the prettified slug.
const SPORT_OVERRIDES = {
  weightlifting: "lift",
  weightlifting_msk: "lift",
  infrared_sauna: "sauna",
};

// Turn a raw WHOOP sport slug (e.g. "weightlifting_msk", "infrared-sauna")
// into a lowercase, human-friendly label.
function displaySport(raw) {
  if (!raw) return "activity";
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return SPORT_OVERRIDES[key] ?? key.replace(/_+/g, " ").trim();
}

function shape(w) {
  if (!w?.id || !w.start || !w.end) return null;
  const durationMin = Math.round((new Date(w.end) - new Date(w.start)) / 60000);
  const sport = displaySport(w.sport_name || SPORT_NAMES[w.sport_id]);
  const score = w.score_state === "SCORED" ? w.score : null;
  return {
    id: String(w.id),
    sport,
    start: w.start,
    durationMin,
    strain: score ? score.strain : null,
    avgHr: score ? score.average_heart_rate : null,
    calories: score?.kilojoule != null ? Math.round(score.kilojoule / KJ_PER_KCAL) : null,
  };
}

export function trimWorkouts(payload) {
  return (payload.records ?? [])
    .map(shape)
    .filter(Boolean)
    .sort((a, b) => new Date(b.start) - new Date(a.start));
}
