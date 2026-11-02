/*
  QuickLoan Demo — local config + fake data.
  Change these values by hand. When you connect Google Apps Script,
  paste the web app URL into sheetWebAppUrl.
*/
window.QUICKLOAN_DEMO = {
  brand: {
    name: "QuickLoan Demo",
    mark: "QL",
    city: "Pune",
  },

  contact: {
    phoneDisplay: "90000 11223",
    phoneTel: "+919000011223",
    whatsapp: "919000011223",
    whatsappMessage:
      "Hello QuickLoan Demo. I want to ask about a loan enquiry.",
  },

  /* Leave empty to use the local mock saver in form.js */
  sheetWebAppUrl: "",

  products: ["Personal Loan", "Business Loan", "Home Loan"],

  fakeLead: {
    fullName: "Riya Kapoor",
    mobile: "9876501234",
    loanAmount: 450000,
    monthlySalary: 52000,
    employerName: "Cedar Soft Pvt Ltd",
    annualTurnover: 3800000,
    businessVintageYears: 5,
    monthlyIncome: 78000,
    propertyCity: "Indore",
  },

  emiDefaults: {
    amount: 450000,
    rate: 11.25,
    tenure: 4,
    unit: "years",
    amountMin: 50000,
    amountMax: 10000000,
    rateMin: 0,
    rateMax: 24,
  },

  /* Portrait links used in hero stack + customer stories. */
  people: [
    {
      name: "Riya Kapoor",
      role: "Personal loan",
      city: "Pune",
      quote: "I finished the enquiry on my phone in two steps. The EMI block made the monthly number feel clear.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Arjun Mehta",
      role: "Business loan",
      city: "Indore",
      quote: "Turnover and vintage sat on step 2 only. No extra questions for a product I did not pick.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Neha Sharma",
      role: "Home loan",
      city: "Nagpur",
      quote: "I liked that consent came before anything was saved. It felt like a real product page.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ],

  stats: [
    { value: "2 steps", label: "To complete enquiry" },
    { value: "₹50K+", label: "Starting ticket size" },
    { value: "11.25%", label: "Sample rate shown" },
  ],

  copy: {
    eyebrow: "Loans for India · fast enquiry",
    heroTitle: "Get a clear loan offer path in two short steps",
    heroValue:
      "Choose Personal, Business or Home. Share a few details. See your EMI instantly.",
    formTitle: "Check eligibility",
    formLede:
      "Tell us the loan type, then finish only what that product needs.",
    emiTitle: "EMI calculator",
    emiLede:
      "Adjust amount, rate and tenure. See monthly EMI, interest and total in Indian rupees.",
    trustTitle: "People who started with a short enquiry",
    trustLede:
      "Fictional quotes for this showcase — written to feel like a finished product page.",
    privacy:
      "Demo only. Nothing is sent to a real lender. A connected version would store details only to contact you about this enquiry.",
    demoNote: "Demo page. Not a real loan offer.",
  },
};
