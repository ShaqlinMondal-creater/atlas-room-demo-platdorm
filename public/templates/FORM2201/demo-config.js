/*
  Pulse Intake — local config + fake data.
  Warm multi-step desk sample. Change values by hand.
*/
window.PULSE_INTAKE = {
  brand: {
    name: "Pulse Intake",
    mark: "PI",
  },

  steps: ["Contact", "Project", "Timing"],

  fakeLead: {
    fullName: "Asha Menon",
    email: "asha@studioexample.com",
    company: "North Clay Studio",
    projectType: "Website refresh",
    budget: "₹2L – ₹4L",
    timeline: "4–6 weeks",
    notes: "Need a calm lead form and a short case-study strip.",
  },

  projectTypes: [
    "Website refresh",
    "Landing page",
    "Lead form only",
    "Storefront sample",
  ],

  budgets: ["Under ₹1L", "₹1L – ₹2L", "₹2L – ₹4L", "₹4L+"],

  timelines: ["ASAP", "2–4 weeks", "4–6 weeks", "Flexible"],

  copy: {
    eyebrow: "Warm desk sample",
    heroTitle: "Share the brief in three calm steps",
    heroValue:
      "Contact, project shape, and timing. Demo only — nothing leaves this page.",
    formTitle: "Start an intake",
    successTitle: "Brief captured",
    successBody:
      "Demo saved locally for this session. In a live build this would open a follow-up thread.",
    privacy:
      "Portfolio sample. Fields stay on this page unless you connect a real endpoint later.",
  },
};
