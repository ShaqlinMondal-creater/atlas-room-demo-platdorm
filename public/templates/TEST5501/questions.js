/*
  100 sample MCQs for Test Now (demo / portfolio only).
  Each item: { id, text, options[4], answer } — answer is 0–3.
*/
(function () {
  var bank = [
    {
      text: "Which planet is known as the Red Planet?",
      options: ["Mars", "Venus", "Jupiter", "Mercury"],
      answer: 0,
    },
    {
      text: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      answer: 2,
    },
    {
      text: "How many continents are there on Earth?",
      options: ["5", "6", "7", "8"],
      answer: 2,
    },
    {
      text: "What gas do plants absorb from the air?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      answer: 2,
    },
    {
      text: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      answer: 3,
    },
    {
      text: "What is 15 × 4?",
      options: ["45", "50", "60", "64"],
      answer: 2,
    },
    {
      text: "Who wrote Romeo and Juliet?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      answer: 1,
    },
    {
      text: "What is the chemical symbol for water?",
      options: ["O2", "CO2", "H2O", "NaCl"],
      answer: 2,
    },
    {
      text: "Which animal is known as the King of the Jungle?",
      options: ["Tiger", "Elephant", "Lion", "Leopard"],
      answer: 2,
    },
    {
      text: "How many hours are in a day?",
      options: ["12", "24", "36", "48"],
      answer: 1,
    },
    {
      text: "What is the boiling point of water at sea level (°C)?",
      options: ["90", "100", "110", "120"],
      answer: 1,
    },
    {
      text: "Which instrument has keys, pedals, and strings?",
      options: ["Guitar", "Flute", "Piano", "Drums"],
      answer: 2,
    },
    {
      text: "What colour do you get by mixing blue and yellow?",
      options: ["Purple", "Orange", "Green", "Brown"],
      answer: 2,
    },
    {
      text: "Which country is shaped like a boot?",
      options: ["Spain", "Italy", "Greece", "Portugal"],
      answer: 1,
    },
    {
      text: "What is the square root of 81?",
      options: ["7", "8", "9", "10"],
      answer: 2,
    },
    {
      text: "Which organ pumps blood through the body?",
      options: ["Lungs", "Liver", "Heart", "Kidneys"],
      answer: 2,
    },
    {
      text: "In which sport is a shuttlecock used?",
      options: ["Tennis", "Badminton", "Squash", "Cricket"],
      answer: 1,
    },
    {
      text: "What is the largest mammal?",
      options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
      answer: 1,
    },
    {
      text: "Which language is primarily spoken in Brazil?",
      options: ["Spanish", "Portuguese", "French", "English"],
      answer: 1,
    },
    {
      text: "How many sides does a hexagon have?",
      options: ["5", "6", "7", "8"],
      answer: 1,
    },
    {
      text: "What is the currency of Japan?",
      options: ["Yuan", "Won", "Yen", "Ringgit"],
      answer: 2,
    },
    {
      text: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      answer: 2,
    },
    {
      text: "What do bees collect from flowers?",
      options: ["Sap", "Nectar", "Dew", "Pollen only"],
      answer: 1,
    },
    {
      text: "Which number is a prime?",
      options: ["9", "15", "21", "23"],
      answer: 3,
    },
    {
      text: "What is the freezing point of water (°C)?",
      options: ["−10", "0", "10", "32"],
      answer: 1,
    },
  ];

  var fillers = [
    ["CPU stands for?", ["Central Processing Unit", "Computer Personal Unit", "Central Print Utility", "Control Process Utility"], 0],
    ["HTML is used to?", ["Style pages", "Structure web pages", "Query databases", "Compile apps"], 1],
    ["Which is a search engine?", ["Photoshop", "Google", "Excel", "Slack"], 1],
    ["1 kilometre equals?", ["10 metres", "100 metres", "1000 metres", "10000 metres"], 2],
    ["Which is a mammal?", ["Shark", "Crocodile", "Dolphin", "Penguin"], 2],
    ["Opposite of hot?", ["Warm", "Cold", "Mild", "Spicy"], 1],
    ["How many minutes in an hour?", ["30", "45", "60", "90"], 2],
    ["Which is a fruit?", ["Carrot", "Potato", "Apple", "Onion"], 2],
    ["Earth’s natural satellite?", ["Sun", "Mars", "Moon", "Comet"], 2],
    ["Which shape has 3 sides?", ["Square", "Triangle", "Circle", "Pentagon"], 1],
    ["Sound travels fastest through?", ["Air", "Water", "Vacuum", "Steel"], 3],
    ["Which is a primary colour?", ["Green", "Orange", "Blue", "Purple"], 2],
    ["Photosynthesis needs?", ["Darkness", "Sunlight", "Salt", "Ice"], 1],
    ["Which device stores data long-term?", ["RAM", "CPU", "Hard drive", "GPU"], 2],
    ["Which is an even number?", ["11", "17", "22", "25"], 2],
    ["Capital of India?", ["Mumbai", "Kolkata", "New Delhi", "Chennai"], 2],
    ["Which bird cannot fly?", ["Sparrow", "Eagle", "Penguin", "Parrot"], 2],
    ["HTTP is used for?", ["Printing", "Web communication", "Cooking", "GPS only"], 1],
    ["Which is a programming language?", ["HTML Table", "Python", "JPEG", "Wi-Fi"], 1],
    ["Speed of light is fastest in?", ["Water", "Glass", "Vacuum", "Air"], 2],
    ["Which vitamin comes from sunlight?", ["A", "B12", "C", "D"], 3],
    ["A decade has how many years?", ["5", "10", "20", "100"], 1],
    ["Which is a desert?", ["Amazon", "Sahara", "Pacific", "Alps"], 1],
    ["Binary uses digits?", ["0 and 1", "1 and 2", "0 to 9", "A to F only"], 0],
    ["Which is cold-blooded?", ["Dog", "Cat", "Snake", "Horse"], 2],
  ];

  function buildQuestions() {
    var list = bank.map(function (q, i) {
      return {
        id: i + 1,
        text: q.text,
        options: q.options.slice(),
        answer: q.answer,
      };
    });

    var i = list.length;
    while (i < 100) {
      var src = fillers[(i - bank.length) % fillers.length];
      var n = i + 1;
      list.push({
        id: n,
        text: src[0] + (n > 50 ? " (sample " + n + ")" : ""),
        options: src[1].slice(),
        answer: src[2],
      });
      i += 1;
    }

    // Top up any shortfall with simple arithmetic samples
    while (list.length < 100) {
      var a = (list.length % 12) + 2;
      var b = (list.length % 9) + 3;
      var correct = a + b;
      list.push({
        id: list.length + 1,
        text: "What is " + a + " + " + b + "?",
        options: [String(correct - 2), String(correct), String(correct + 1), String(correct + 3)],
        answer: 1,
      });
    }

    return list.slice(0, 100);
  }

  window.TEST_NOW_QUESTIONS = buildQuestions();
})();
