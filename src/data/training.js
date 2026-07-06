export const training = {
  lede: "Lifting since college, running when the weather cooperates. These numbers are real and occasionally improving.",
  prs: [
    { label: "squat", value: 315, unit: "lbs" },
    { label: "bench @ 185 bw", value: 255, unit: "lbs" },
    { label: "pull-ups", value: 18, unit: "reps" },
  ],
  goal: { label: "bench 315", current: 255, target: 315 },
  // newest first — appending here is how the site gets updated
  log: [
    { date: "2026-06", text: "bench 255 lbs — new PR. 60 to go." },
    { date: "2026-03", text: "pull-ups × 18 unbroken" },
    { date: "2025-11", text: "half marathon #2 — time coming from strava" },
    { date: "2025-08", text: "squat 315 lbs — three plates, finally" },
    { date: "2024-10", text: "half marathon #1 — the one that started it" },
  ],
  // absolute or imported image URLs; empty = section hidden
  photos: [],
};
