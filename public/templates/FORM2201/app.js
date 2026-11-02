(function () {
  var cfg = window.PULSE_INTAKE || {};
  var form = document.getElementById("intake-form");
  var progress = document.getElementById("progress");
  var panels = Array.prototype.slice.call(
    form.querySelectorAll(".step-panel[data-step]")
  );
  var step = 0;

  function text(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  function fillCopy() {
    var brand = cfg.brand || {};
    var copy = cfg.copy || {};
    text("brand-name", brand.name);
    text("hero-eyebrow", copy.eyebrow);
    text("hero-title", copy.heroTitle);
    text("hero-value", copy.heroValue);
    text("form-title", copy.formTitle);
    text("success-title", copy.successTitle);
    text("success-body", copy.successBody);
    text("privacy", copy.privacy);
  }

  function renderProgress() {
    var steps = cfg.steps || ["Contact", "Project", "Timing"];
    progress.innerHTML = steps
      .map(function (label, index) {
        var state =
          step === "done"
            ? "is-done"
            : index < step
              ? "is-done"
              : index === step
                ? "is-active"
                : "";
        return (
          "<li class=\"" +
          state +
          "\"><strong>0" +
          (index + 1) +
          "</strong>" +
          label +
          "</li>"
        );
      })
      .join("");
  }

  function showStep(next) {
    step = next;
    panels.forEach(function (panel) {
      var key = panel.getAttribute("data-step");
      var match = String(next) === key || (next === "done" && key === "done");
      panel.hidden = !match;
    });
    renderProgress();
    form.querySelector(".step-panel:not([hidden])")?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }

  function setError(id, message) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = message;
  }

  function clearErrors() {
    [
      "full-name-error",
      "email-error",
      "company-error",
      "project-type-error",
      "budget-error",
      "timeline-error",
    ].forEach(function (id) {
      setError(id, "");
    });
  }

  function renderChoices(containerId, options, inputId) {
    var host = document.getElementById(containerId);
    var input = document.getElementById(inputId);
    if (!host || !input) return;

    host.innerHTML = (options || [])
      .map(function (option) {
        return (
          "<button type=\"button\" class=\"choice\" data-value=\"" +
          option.replace(/"/g, "&quot;") +
          "\" aria-pressed=\"false\">" +
          option +
          "</button>"
        );
      })
      .join("");

    host.addEventListener("click", function (event) {
      var button = event.target.closest(".choice");
      if (!button) return;
      host.querySelectorAll(".choice").forEach(function (item) {
        item.setAttribute("aria-pressed", "false");
      });
      button.setAttribute("aria-pressed", "true");
      input.value = button.getAttribute("data-value") || "";
    });
  }

  function seedFake() {
    var fake = cfg.fakeLead || {};
    var name = document.getElementById("full-name");
    var email = document.getElementById("email");
    var company = document.getElementById("company");
    var notes = document.getElementById("notes");
    if (name) name.placeholder = fake.fullName || name.placeholder;
    if (email) email.placeholder = fake.email || email.placeholder;
    if (company) company.placeholder = fake.company || company.placeholder;
    if (notes) notes.placeholder = fake.notes || notes.placeholder;
  }

  function validateStep(current) {
    clearErrors();
    var ok = true;

    if (current === 0) {
      var name = document.getElementById("full-name").value.trim();
      var email = document.getElementById("email").value.trim();
      var company = document.getElementById("company").value.trim();
      if (name.length < 2) {
        setError("full-name-error", "Add a name.");
        ok = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email-error", "Use a valid email.");
        ok = false;
      }
      if (company.length < 2) {
        setError("company-error", "Add a studio or company.");
        ok = false;
      }
    }

    if (current === 1) {
      if (!document.getElementById("project-type").value) {
        setError("project-type-error", "Pick a project type.");
        ok = false;
      }
      if (!document.getElementById("budget").value) {
        setError("budget-error", "Pick a budget range.");
        ok = false;
      }
    }

    if (current === 2) {
      if (!document.getElementById("timeline").value) {
        setError("timeline-error", "Pick a timing.");
        ok = false;
      }
    }

    return ok;
  }

  function fillSummary() {
    var data = {
      Name: document.getElementById("full-name").value.trim(),
      Email: document.getElementById("email").value.trim(),
      Company: document.getElementById("company").value.trim(),
      Project: document.getElementById("project-type").value,
      Budget: document.getElementById("budget").value,
      Timing: document.getElementById("timeline").value,
      Notes: document.getElementById("notes").value.trim() || "—",
    };
    var host = document.getElementById("summary");
    host.innerHTML = Object.keys(data)
      .map(function (key) {
        return "<dt>" + key + "</dt><dd>" + data[key] + "</dd>";
      })
      .join("");
  }

  form.addEventListener("click", function (event) {
    if (event.target.matches("[data-next]")) {
      if (!validateStep(step)) return;
      showStep(step + 1);
    }
    if (event.target.matches("[data-back]")) {
      clearErrors();
      showStep(Math.max(0, step - 1));
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateStep(2)) return;
    fillSummary();
    showStep("done");
  });

  document.getElementById("reset-form").addEventListener("click", function () {
    form.reset();
    document.getElementById("project-type").value = "";
    document.getElementById("budget").value = "";
    document.getElementById("timeline").value = "";
    document.querySelectorAll(".choice").forEach(function (item) {
      item.setAttribute("aria-pressed", "false");
    });
    clearErrors();
    showStep(0);
  });

  fillCopy();
  seedFake();
  renderChoices("project-types", cfg.projectTypes, "project-type");
  renderChoices("budgets", cfg.budgets, "budget");
  renderChoices("timelines", cfg.timelines, "timeline");
  showStep(0);
})();
