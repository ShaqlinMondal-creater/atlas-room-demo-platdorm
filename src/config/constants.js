/*
  ============================================================
  MAIN SHOWCASE CONFIG
  Change these values by hand. Later you can point API fields
  at a real backend and set useMock to false.
  ============================================================
*/

/** Branding shown on the catalog shell (not inside templates). */
export const APP = {
  // Pick one name and keep mark short (2 letters).
  name: "Atlas Room",
  mark: "AR",
  tagline: "Template Showcase",
  eyebrow: "Private preview desk",
  headline: "Design templates behind access codes",
  lede:
    "Click a template, enter its code, then open a new-tab preview. Each token works for a short time only.",
  catalogTitle: "Templates",
  catalogLede:
    "Every sample keeps its own colours and type. This shell uses a separate look on purpose.",
  publicTitle: "A quiet room for finished samples",
  publicLede:
    "Show a polished page, keep access short, and leave the room tidy when the timer ends.",
  builderTitle: "Adding another sample",
  builderLede:
    "Optional notes if you want to grow the room later.",
  footerNote:
    "Portfolio showcase only. Templates may use fictional brands and placeholder data. Preview tokens expire after the access window.",
  documentTitle: "Atlas Room | Template Showcase",
};

/** Access token rules for /view/:code?token=... */
export const ACCESS = {
  ttlMinutes: 15,
  // Must match public/access-gate.js STORAGE_KEY
  storageKey: "atlas-room-access",
};

/**
 * Future API wiring for the main panel.
 * Leave baseUrl empty and useMock true until the backend is ready.
 */
export const API = {
  useMock: true,
  baseUrl: "", // e.g. "https://api.yourdomain.com"
  endpoints: {
    templates: "/v1/templates",
    unlock: "/v1/templates/unlock",
    session: "/v1/sessions",
  },
  // Optional headers later: Authorization, x-api-key, etc.
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

/** Local UI defaults */
export const UI = {
  homePath: "/",
  viewPath: "/view",
};
