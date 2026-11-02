/*
  Story / UI copy for Universe Cosmos.
  Change the strings here — no need to touch Three.js code.
*/
export const story = {
  brand: "Universe Cosmos",
  loadingLabel: "Preparing your voyage…",
  startTitle: "Universe Cosmos",
  startLede:
    "A quiet scroll through starlight, suns, and distant dust. This is a placeholder story — replace it when your own words are ready.",
  scrollHint: "Scroll to begin",
  reducedMotionNote:
    "Motion is simplified because your device prefers less animation.",
  noWebglTitle: "3D view unavailable",
  noWebglBody:
    "This browser cannot run WebGL, which Universe Cosmos needs for the sky. Try the latest Chrome, Firefox, Safari, or Edge.",
};

/* Camera scroll stops (0 → 1). Scene 1 only uses the start stop for now. */
export const scrollStops = {
  start: 0,
  sun: 0.28,
  nebula: 0.55,
  galaxy: 0.78,
  finale: 1,
};

/* Particle counts — desktop vs phone. Keep mobile lower for 4G load time. */
export const particles = {
  starfieldDesktop: 4500,
  starfieldMobile: 1800,
};
