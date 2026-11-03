/*
  Test Now — exam flow: start → 100 MCQs → score → review / retake
*/
(function () {
  var QUESTIONS = window.TEST_NOW_QUESTIONS || [];
  var TOTAL = QUESTIONS.length;
  var DURATION_SEC = 60 * 60;

  var state = {
    index: 0,
    answers: {},
    review: {},
    remaining: DURATION_SEC,
    timerId: null,
    finished: false,
  };

  var els = {
    start: document.getElementById("screen-start"),
    exam: document.getElementById("screen-exam"),
    results: document.getElementById("screen-results"),
    review: document.getElementById("screen-review"),
    btnStart: document.getElementById("btn-start"),
    qLabel: document.getElementById("q-label"),
    qText: document.getElementById("q-text"),
    options: document.getElementById("options"),
    mapGrid: document.getElementById("map-grid"),
    progressLabel: document.getElementById("progress-label"),
    progressFill: document.getElementById("progress-fill"),
    timerText: document.getElementById("timer-text"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnReview: document.getElementById("btn-review"),
    btnSubmitEarly: document.getElementById("btn-submit-early"),
    scoreFrac: document.getElementById("score-frac"),
    scorePct: document.getElementById("score-pct"),
    scoreRingLabel: document.getElementById("score-ring-label"),
    scoreRingValue: document.getElementById("score-ring-value"),
    statCorrect: document.getElementById("stat-correct"),
    statWrong: document.getElementById("stat-wrong"),
    statSkip: document.getElementById("stat-skip"),
    btnReviewAnswers: document.getElementById("btn-review-answers"),
    btnRetake: document.getElementById("btn-retake"),
    btnBackResults: document.getElementById("btn-back-results"),
    reviewList: document.getElementById("review-list"),
    resultsTitle: document.getElementById("results-title"),
  };

  var LETTERS = ["A", "B", "C", "D"];
  var CIRC = 2 * Math.PI * 52;

  function showScreen(name) {
    els.start.hidden = name !== "start";
    els.exam.hidden = name !== "exam";
    els.results.hidden = name !== "results";
    els.review.hidden = name !== "review";
  }

  function formatTime(sec) {
    var s = Math.max(0, sec);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.remaining = DURATION_SEC;
    els.timerText.textContent = formatTime(state.remaining) + " Remaining";
    state.timerId = window.setInterval(function () {
      state.remaining -= 1;
      els.timerText.textContent = formatTime(state.remaining) + " Remaining";
      if (state.remaining <= 0) {
        finishExam();
      }
    }, 1000);
  }

  function buildMap() {
    els.mapGrid.innerHTML = "";
    QUESTIONS.forEach(function (q, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-cell";
      btn.textContent = String(i + 1);
      btn.setAttribute("aria-label", "Go to question " + (i + 1));
      btn.addEventListener("click", function () {
        goTo(i);
      });
      els.mapGrid.appendChild(btn);
    });
  }

  function refreshMap() {
    var cells = els.mapGrid.children;
    var i;
    for (i = 0; i < cells.length; i += 1) {
      var cell = cells[i];
      cell.classList.toggle("is-current", i === state.index);
      cell.classList.toggle("is-answered", state.answers[i] != null);
      cell.classList.toggle("is-review", !!state.review[i]);
    }
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    if (!q) return;

    els.qLabel.textContent = "Question " + (state.index + 1);
    els.qText.textContent = q.text;
    els.progressLabel.textContent =
      "Question " + (state.index + 1) + " of " + TOTAL;
    els.progressFill.style.width =
      ((state.index + 1) / TOTAL) * 100 + "%";

    els.btnPrev.disabled = state.index === 0;
    els.btnNext.textContent =
      state.index === TOTAL - 1 ? "Finish ✓" : "Next →";
    els.btnReview.classList.toggle("is-on", !!state.review[state.index]);
    els.btnReview.textContent = state.review[state.index]
      ? "⚑ Marked for review"
      : "⚑ Mark for review";

    els.options.innerHTML = "";
    q.options.forEach(function (label, optIndex) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.setAttribute("role", "radio");
      var selected = state.answers[state.index] === optIndex;
      btn.classList.toggle("is-selected", selected);
      btn.setAttribute("aria-checked", selected ? "true" : "false");
      btn.innerHTML =
        '<span class="option__key">' +
        LETTERS[optIndex] +
        "</span>" +
        '<span class="option__label"></span>' +
        '<span class="option__check" aria-hidden="true">✓</span>';
      btn.querySelector(".option__label").textContent = label;
      btn.addEventListener("click", function () {
        state.answers[state.index] = optIndex;
        renderQuestion();
        refreshMap();
      });
      els.options.appendChild(btn);
    });

    refreshMap();
  }

  function goTo(index) {
    if (index < 0 || index >= TOTAL || state.finished) return;
    state.index = index;
    renderQuestion();
  }

  function scoreExam() {
    var correct = 0;
    var wrong = 0;
    var skipped = 0;
    QUESTIONS.forEach(function (q, i) {
      var picked = state.answers[i];
      if (picked == null) {
        skipped += 1;
      } else if (picked === q.answer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });
    return { correct: correct, wrong: wrong, skipped: skipped };
  }

  function finishExam() {
    if (state.finished) return;
    state.finished = true;
    stopTimer();

    var score = scoreExam();
    var pct = Math.round((score.correct / TOTAL) * 100);

    els.scoreFrac.textContent = score.correct + " / " + TOTAL;
    els.scorePct.textContent = pct + "%";
    els.scoreRingLabel.textContent = score.correct + " / " + TOTAL;
    els.statCorrect.textContent = String(score.correct);
    els.statWrong.textContent = String(score.wrong);
    els.statSkip.textContent = String(score.skipped);
    els.resultsTitle.textContent =
      pct >= 70 ? "Nice work" : pct >= 40 ? "Keep practising" : "More practice helps";

    var offset = CIRC * (1 - score.correct / TOTAL);
    els.scoreRingValue.style.strokeDasharray = String(CIRC);
    els.scoreRingValue.style.strokeDashoffset = String(offset);

    showScreen("results");
  }

  function buildReview() {
    els.reviewList.innerHTML = "";
    QUESTIONS.forEach(function (q, i) {
      var picked = state.answers[i];
      var li = document.createElement("li");
      li.className = "review-item";
      var status = "Skipped";
      if (picked == null) {
        li.classList.add("is-skip");
      } else if (picked === q.answer) {
        li.classList.add("is-correct");
        status = "Correct";
      } else {
        li.classList.add("is-wrong");
        status = "Wrong";
      }

      var your =
        picked == null
          ? "—"
          : LETTERS[picked] + ". " + q.options[picked];
      var right = LETTERS[q.answer] + ". " + q.options[q.answer];

      li.innerHTML =
        "<header><span>Q" +
        (i + 1) +
        "</span><span>" +
        status +
        "</span></header>" +
        "<p></p>" +
        '<div class="meta"></div>';
      li.querySelector("p").textContent = q.text;
      li.querySelector(".meta").textContent =
        "Your answer: " + your + " · Correct: " + right;
      els.reviewList.appendChild(li);
    });
  }

  function resetExam() {
    stopTimer();
    state.index = 0;
    state.answers = {};
    state.review = {};
    state.finished = false;
    state.remaining = DURATION_SEC;
  }

  function beginExam() {
    resetExam();
    buildMap();
    startTimer();
    showScreen("exam");
    renderQuestion();
  }

  /* Events */
  els.btnStart.addEventListener("click", beginExam);

  els.btnPrev.addEventListener("click", function () {
    goTo(state.index - 1);
  });

  els.btnNext.addEventListener("click", function () {
    if (state.index >= TOTAL - 1) {
      finishExam();
      return;
    }
    goTo(state.index + 1);
  });

  els.btnReview.addEventListener("click", function () {
    if (state.review[state.index]) {
      delete state.review[state.index];
    } else {
      state.review[state.index] = true;
    }
    renderQuestion();
  });

  els.btnSubmitEarly.addEventListener("click", function () {
    var unanswered = TOTAL - Object.keys(state.answers).length;
    var msg =
      unanswered > 0
        ? "You still have " +
          unanswered +
          " unanswered. Submit anyway?"
        : "Submit your exam and see the score?";
    if (window.confirm(msg)) finishExam();
  });

  els.btnReviewAnswers.addEventListener("click", function () {
    buildReview();
    showScreen("review");
  });

  els.btnBackResults.addEventListener("click", function () {
    showScreen("results");
  });

  els.btnRetake.addEventListener("click", beginExam);

  /* Boot */
  if (!TOTAL) {
    document.body.innerHTML =
      "<p style='padding:24px;font-family:sans-serif'>Question bank failed to load.</p>";
    return;
  }

  showScreen("start");
})();
