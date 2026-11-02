/*
  Story / UI copy for Universe Cosmos.
  Edit these strings anytime — no Three.js changes needed.
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
  audioOn: "Sound on",
  audioOff: "Sound off",
  scenes: {
    sun: {
      title: "A living star",
      body: "Placeholder: our sun holds a small family of worlds. Orbits here are simple shapes — swap in your own myth later.",
    },
    nebula: {
      title: "Painted gas",
      body: "Placeholder: soft clouds of colour where new stars may one day wake. Replace this line with your nebula story.",
    },
    galaxy: {
      title: "Spiral home",
      body: "Placeholder: a whirl of light on a cosmic scale. This stand-in spiral is made of particles you can tune in config.js.",
    },
  },
  overview: {
    title: "Overview",
    body: "Universe Cosmos is a scroll-driven three.js sketch for Atlas Room. It shows how a static site can feel like a short voyage — starfield, star system, nebula, then galaxy — without a heavy game engine.",
  },
  credits: {
    title: "Credits",
    body: "Built with Vite-friendly vanilla JavaScript and three.js. Procedural geometry and particles only — no copyrighted textures or music. Placeholder copy is yours to rewrite.",
  },
  contact: {
    title: "Contact",
    body: "Replace this with your email or portfolio link.",
    linkLabel: "Back to Atlas Room",
    linkHref: "/",
  },
};

/* Scroll stops as 0→1 progress along the page */
export const scrollStops = {
  start: 0,
  sun: 0.22,
  nebula: 0.48,
  galaxy: 0.72,
  finale: 0.9,
};

export const particles = {
  starfieldDesktop: 4200,
  starfieldMobile: 1600,
  nebulaDesktop: 2200,
  nebulaMobile: 900,
  galaxyDesktop: 5000,
  galaxyMobile: 2000,
};
