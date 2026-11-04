/*
  ═══════════════════════════════════════════════════════════
  EDIT THIS FILE to update café business details.
  WhatsApp · phone · address · map · menu · photos · social
  ═══════════════════════════════════════════════════════════
*/
window.CAFE_CONFIG = {
  /* Brand */
  name: "Harbour Bean",
  tagline: "Slow coffee, fresh plates, open mornings.",
  shortPitch:
    "A neighbourhood cafe on Quay Lane for quiet mornings, careful coffee, and a short kitchen list.",

  /* Contact — WhatsApp: country code + number, digits only (no + or spaces) */
  phoneDisplay: "+91 98765 43210",
  phoneTel: "+919876543210",
  whatsappNumber: "919876543210",
  whatsappMessage: "Hi Harbour Bean — I’d like to ask about today’s menu.",
  email: "hello@harbourbean.example",

  /* Location */
  addressLines: ["12 Quay Lane", "Fort Kochi, Kerala 682001", "India"],
  hours: [
    { day: "Mon – Fri", time: "7:30 am – 8:00 pm" },
    { day: "Sat – Sun", time: "8:00 am – 9:00 pm" },
  ],

  /*
    Google Maps embed URL (Share → Embed a map → copy src).
  */
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Fort%20Kochi%20Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed",

  /* Social — leave blank string to hide */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },

  /* Home gallery — paths relative to this template folder */
  gallery: [
    {
      src: "assets/gallery-coffee.jpg",
      alt: "Espresso in a ceramic cup on a wooden table",
      label: "Coffee",
    },
    {
      src: "assets/gallery-food.jpg",
      alt: "Fresh plate with greens and roast vegetables",
      label: "Food",
    },
    {
      src: "assets/gallery-dessert.jpg",
      alt: "Layered chocolate cake slice",
      label: "Desserts",
    },
    {
      src: "assets/gallery-room.jpg",
      alt: "Sunlit cafe seating and warm interior light",
      label: "Atmosphere",
    },
    {
      src: "assets/gallery-bar.jpg",
      alt: "Coffee beans and barista tools on the bar",
      label: "Bar",
    },
    {
      src: "assets/gallery-garden.jpg",
      alt: "Warm dining room with soft evening light",
      label: "Evening room",
    },
  ],

  /* Menu categories */
  menuNote:
    "A short list we cook fresh each day. Prices may change with the market. Ask the counter about allergens.",
  menu: {
    Coffee: [
      { name: "House filter", detail: "Daily brew, medium body", price: "₹120" },
      { name: "Espresso", detail: "Single or double", price: "₹100" },
      { name: "Flat white", detail: "Double shot, steamed milk", price: "₹160" },
      { name: "Cold brew", detail: "12-hour steep, served over ice", price: "₹180" },
      { name: "Spiced chai latte", detail: "House chai, steamed milk", price: "₹150" },
    ],
    Food: [
      { name: "Avocado toast", detail: "Sourdough, chilli flakes, lemon", price: "₹240" },
      { name: "Herb omelette", detail: "Three eggs, garden herbs, toast", price: "₹220" },
      { name: "Grain bowl", detail: "Quinoa, roast veg, tahini", price: "₹280" },
      { name: "Chicken sandwich", detail: "Soft roll, greens, house mayo", price: "₹260" },
      { name: "Soup of the day", detail: "Ask the counter", price: "₹180" },
    ],
    Desserts: [
      { name: "Banana bread", detail: "Warm slice, butter", price: "₹140" },
      { name: "Chocolate brownie", detail: "Walnut, sea salt", price: "₹160" },
      { name: "Citrus cake", detail: "Yoghurt glaze", price: "₹170" },
      { name: "Seasonal tart", detail: "Changes with the market", price: "₹190" },
    ],
  },

  /* About page copy */
  about: {
    title: "A quiet harbour cafe",
    lead:
      "We opened on Quay Lane for people who want a slower morning — careful coffee, a short kitchen, and a room with good light.",
    body: [
      "We roast in small batches and keep the kitchen list short so everything stays fresh. Mornings are for coffee and breakfast plates; afternoons settle into sandwiches, cakes, and a slower cup.",
      "The room is built for conversation — window light, wood tables, and a bar you can watch. Bring a laptop if you need to, or leave it and sit with a book.",
    ],
    values: [
      { title: "Careful coffee", text: "Clear recipes, trained baristas, beans you can ask about." },
      { title: "Short kitchen", text: "A focused menu — fewer dishes, better timing." },
      { title: "Open door", text: "Locals, travellers, and remote workers are all welcome." },
    ],
  },
};
