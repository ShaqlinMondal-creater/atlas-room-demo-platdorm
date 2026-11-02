/*
  QuickLoan — local config + lead/EMI defaults.
  Change these values by hand. When you connect Google Apps Script,
  paste the web app URL into sheetWebAppUrl.
*/
window.QUICKLOAN_DEMO = {
  brand: {
    name: "QuickLoan",
    mark: "QL",
    city: "Pune",
  },

  contact: {
    phoneDisplay: "90000 11223",
    phoneTel: "+919000011223",
    whatsapp: "919000011223",
    whatsappMessage: "Hello QuickLoan. I want to ask about a loan enquiry.",
  },

  /* Leave empty to use the local mock saver in form.js */
  sheetWebAppUrl: "",

  products: ["Personal Loan", "Business Loan", "Home Loan"],

  amountPicks: [100000, 300000, 500000, 1000000],

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

  partners: [
    { label: "Northpeak" },
    { label: "Cedar Bank" },
    { label: "Rivermint" },
    { label: "Oakline" },
    { label: "Silverpath" },
  ],

  people: [
    {
      name: "Riya Kapoor",
      role: "Personal loan",
      city: "Pune",
      quote:
        "I verified my mobile and finished on my phone. Seeing the monthly EMI before I submitted made the decision easier.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Arjun Mehta",
      role: "Business loan",
      city: "Indore",
      quote:
        "After verify, it only asked for turnover and vintage. No extra fields for a product I did not choose.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Neha Sharma",
      role: "Home loan",
      city: "Nagpur",
      quote:
        "Consent came before anything was saved. The form felt clear, not rushed.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ],

  stats: [
    { value: "3 steps", label: "To complete enquiry" },
    { value: "₹50K+", label: "Starting ticket size" },
    { value: "11.25%", label: "Indicative rate" },
  ],

  copy: {
    eyebrow: "Loans for India · fast enquiry",
    heroTitle: "Get a clear loan offer path in a few short steps",
    heroValue:
      "Choose Personal, Business or Home. Share a few details. See your EMI instantly.",
    heroProof: "2,400+ enquiries started this month.",
    formTitle: "Check eligibility",
    formLede:
      "Tell us the loan type, then finish only what that product needs.",
    formNote: "We use your details only to contact you about this enquiry.",
    emiTitle: "EMI calculator",
    emiLede:
      "Adjust amount, rate and tenure. See monthly EMI, interest and total in Indian rupees.",
    trustTitle: "People who started with a short enquiry",
    trustLede: "Recent customers share how the first check felt on their phone.",
    demoNote: "Portfolio showcase sample. Not a live loan offer.",
  },
};
