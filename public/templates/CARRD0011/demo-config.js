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
    email: "riya.kapoor@email.com",
    loanAmount: 450000,
    employmentType: "Salaried",
    businessType: "Private Limited",
    businessName: "Cedar Traders",
    gstin: "22AAAAA0000A1Z5",
    address: "12 Lake View Road",
    city: "Indore",
    pin: "452001",
  },

  emiDefaults: {
    amount: 450000,
    rate: 11.25,
    tenure: 48,
    tenureMax: 60,
    amountMin: 50000,
    amountMax: 1500000,
    rateMin: 9.99,
    rateMax: 24,
  },

  partners: [
    { label: "Northpeak" },
    { label: "Cedar Bank" },
    { label: "Rivermint" },
    { label: "Oakline" },
    { label: "Silverpath" },
  ],

  heroFeatures: [
    {
      icon: "bolt",
      text: "Get up to ₹15 Lakhs — first check in minutes, no branch visit.",
    },
    {
      icon: "shield",
      text: "0 foreclosure charges on Personal Loan.",
    },
    {
      icon: "fee",
      text: "₹0 processing fee on eligible Personal Loan enquiries.",
    },
  ],

  benefits: [
    {
      icon: "zero",
      title: "Zero foreclosure charges",
      text: "Repay your outstanding balance when you want, without foreclosure fees on Personal Loan.",
    },
    {
      icon: "flex",
      title: "Flexible repayment options",
      text: "Choose a tenure that fits your monthly budget. Preview EMI before you submit.",
    },
    {
      icon: "bolt",
      title: "Swift first response",
      text: "Digital form, mobile OTP, then product details — so advisors call with context.",
    },
    {
      icon: "wallet",
      title: "Amount flexibility",
      text: "From ₹50K up to ₹15L based on eligibility. Pick a chip or type an exact amount.",
    },
    {
      icon: "zero",
      title: "0 processing fee",
      text: "Personal Loan enquiries show ₹0 processing fee so the EMI board stays clear.",
    },
  ],

  howSteps: [
    {
      icon: "calc",
      title: "Click Apply Now",
      text: "Open the form and pick Personal, Business or Home.",
    },
    {
      icon: "form",
      title: "Share basic details",
      text: "Name, mobile and amount are saved as a partial enquiry.",
    },
    {
      icon: "otp",
      title: "Verify your mobile",
      text: "Enter the 6-digit OTP before product fields unlock.",
    },
    {
      icon: "plan",
      title: "Choose amount & EMI",
      text: "Use the calculator to see EMI, interest and total payable.",
    },
    {
      icon: "kyc",
      title: "Finish product details",
      text: "Salary, turnover or property city — then submit complete.",
    },
  ],

  dos: [
    "Make sure you understand tenure and rate before you apply",
    "Pick a repayment tenure that fits your monthly budget",
    "Keep repayment consistent once a live offer is accepted",
    "Check eligibility first to avoid unnecessary rejections",
    "Use the digital form so advisors already have your basics",
  ],

  donts: [
    "Do not assume a smaller EMI always means lower total cost",
    "Avoid ignoring your credit score while applying",
    "Do not stack multiple loan enquiries at the same time",
    "Avoid submitting incomplete or incorrect details",
    "Do not take a loan without a repayment plan",
  ],

  knowCards: [
    {
      tone: "jade",
      icon: "rate",
      title: "Interest rates",
      text: "Rate changes your EMI and total interest. Indicative band starts near 9.99%–11.25% p.a.",
    },
    {
      tone: "amber",
      icon: "compare",
      title: "Easy loan comparison",
      text: "Compare amount, tenure and charges on the EMI board before you continue.",
    },
    {
      tone: "violet",
      icon: "plan",
      title: "Better financial planning",
      text: "Flexible tenure and zero foreclosure help you plan early exits on Personal Loan.",
    },
    {
      tone: "sky",
      icon: "elig",
      title: "Eligibility criteria",
      text: "Steady income helps. Salaried profiles often need CIBIL around 710+.",
    },
    {
      tone: "rose",
      icon: "fee",
      title: "Processing fees & charges",
      text: "Look past the headline rate — check processing fee, foreclosure and total payable.",
    },
  ],

  ratings: {
    headline: "App ratings from 2.4L+ happy users",
    play: { score: "4.9", label: "Play Store" },
    app: { score: "4.8", label: "App Store" },
  },

  people: [
    {
      name: "Riya Kapoor",
      role: "Personal loan",
      city: "Pune",
      date: "16 Dec 2025",
      rating: 5,
      quote:
        "I checked EMI first, verified my mobile, then finished salary details on my phone. Seeing monthly EMI and total interest before submit made the decision feel calm, not rushed.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Arjun Mehta",
      role: "Business loan",
      city: "Indore",
      date: "3 Jan 2026",
      rating: 5,
      quote:
        "After OTP, the form only asked turnover and vintage. No extra personal-loan fields. The EMI board helped me explain numbers to my partner before the advisor called.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Neha Sharma",
      role: "Home loan",
      city: "Nagpur",
      date: "22 Nov 2025",
      rating: 4,
      quote:
        "Consent came before anything was saved. The Do’s and Don’ts section made the next steps clear before I submitted.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Vikram Iyer",
      role: "Personal loan",
      city: "Bengaluru",
      date: "9 Feb 2026",
      rating: 5,
      quote:
        "City and salary cards matched how I search online. I picked ₹40k salary path, ran EMI for 54 months, then submitted. Advisor already knew my ticket size.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ],

  cities: [
    { name: "Mumbai", hint: "Gateway" },
    { name: "Delhi", hint: "Capital" },
    { name: "Bengaluru", hint: "Garden" },
    { name: "Chennai", hint: "Coast" },
    { name: "Pune", hint: "Deccan" },
    { name: "Hyderabad", hint: "Charminar" },
    { name: "Ahmedabad", hint: "Heritage" },
    { name: "Kolkata", hint: "Howrah" },
  ],

  salaries: [
    { amount: 30000, label: "₹30,000" },
    { amount: 35000, label: "₹35,000" },
    { amount: 40000, label: "₹40,000" },
    { amount: 50000, label: "₹50,000" },
    { amount: 60000, label: "₹60,000" },
    { amount: 75000, label: "₹75,000" },
  ],

  stats: [
    { value: "₹15L", label: "Max ticket size" },
    { value: "9.99%", label: "From indicative rate" },
    { value: "10 min", label: "First check target" },
  ],

  copy: {
    eyebrow: "Smart Personal Loan · India",
    heroTitle: "Apply for an instant Personal Loan from 9.99% p.a.",
    heroValue:
      "Check EMI, verify mobile, finish a few details. See monthly EMI and total payable before you submit.",
    heroProof: "2,400+ enquiries started this month.",
    formTitle: "Check eligibility",
    formLede: "Pick a loan type, verify mobile, then finish the short form.",
    formNote: "We use your details only to contact you about this enquiry.",
    emiTitle: "Personal Loan EMI Calculator",
    emiLede: "Live EMI · interest · total",
    trustTitle: "Hear from our loan customers",
    trustLede: "People who started with a short enquiry on their phone.",
    demoNote: "Portfolio showcase. Not a live loan offer.",
  },
};
