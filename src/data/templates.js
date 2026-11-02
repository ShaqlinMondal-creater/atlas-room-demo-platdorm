/*
  Template registry (catalog cards).
  Later this can be loaded from API.templates when API.useMock is false.
*/

export const templates = [
  {
    code: "CARRD0011",
    name: "QuickLoan Demo",
    category: "Landing page",
    stack: "HTML · CSS · JS",
    summary:
      "Fictional loan lead page for India: two-step enquiry, live EMI calculator, trust strip, Call Now and WhatsApp actions.",
    previewPath: "/templates/CARRD0011/index.html",
    thumbnail: "/thumbnails/CARRD0011.png",
    available: true,
    status: "demo ready",
    tags: ["India", "Lead form", "EMI"],
    theme: {
      accent: "#3a47c9",
      soft: "#ecefff",
      label: "Indigo jade · Fraunces",
    },
  },
  {
    code: "COSMOS9898",
    name: "Universe Cosmos",
    category: "3D experience",
    stack: "HTML · CSS · JS · three.js",
    summary:
      "Scroll-driven three.js voyage: starfield, sun with moons and satellites, nebula, glowing galaxy, and Overview / Credits / Contact.",
    previewPath: "/templates/COSMOS9898/index.html",
    thumbnail: "/thumbnails/COSMOS9898.svg",
    available: true,
    status: "demo ready",
    tags: ["Three.js", "Space", "Scroll"],
    theme: {
      accent: "#3d7fd4",
      soft: "#e8eef8",
      label: "Void blue · System UI",
    },
  },

  {
    code: "FORM2201",
    name: "Pulse Intake",
    category: "Lead form",
    stack: "HTML · CSS · JS",
    summary:
      "Compact multi-step intake form with progress marks and calm warm neutrals. Contact, project shape, and timing in three steps.",
    previewPath: "/templates/FORM2201/index.html",
    thumbnail: "/thumbnails/FORM2201.png",
    available: true,
    status: "demo ready",
    tags: ["Form", "Steps", "Warm"],
    theme: {
      accent: "#c45c26",
      soft: "#f7f3ee",
      label: "Warm clay · Source Sans",
    },
  },
  {
    code: "SHOP3301",
    name: "Marketfold",
    category: "Storefront",
    stack: "HTML · CSS · JS",
    summary:
      "Product-led storefront landing with hero merchandising blocks and a soft green retail palette. Placeholder sample.",
    previewPath: "",
    thumbnail: "/thumbnails/SHOP3301.svg",
    available: false,
    status: "coming soon",
    tags: ["Shop", "Hero", "Retail"],
    theme: {
      accent: "#2f8f6b",
      soft: "#e8f5ef",
      label: "Retail green · Manrope",
    },
  },
];

export function findTemplate(code) {
  const clean = String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  return templates.find((item) => item.code === clean) || null;
}

export function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}
