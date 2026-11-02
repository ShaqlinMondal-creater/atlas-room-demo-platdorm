/*
  Two-step lead form.
  - Next: validate step 1, create lead id, send partial (mock or sheet URL)
  - Submit: validate step 2, update same lead as complete
  Stores only the lead id for this browser session.
*/
(function () {
  var cfg = window.QUICKLOAN_DEMO || {};
  var fake = cfg.fakeLead || {};
  var form = document.getElementById("lead-form");
  if (!form) return;

  var step1 = document.getElementById("step-1");
  var step2 = document.getElementById("step-2");
  var nextBtn = document.getElementById("next-btn");
  var backBtn = document.getElementById("back-btn");
  var submitBtn = document.getElementById("submit-btn");
  var success = document.getElementById("form-success");
  var note = document.getElementById("layout-note");
  var leadKey = "quickloan-demo-lead-id";

  function $(id) {
    return document.getElementById(id);
  }

  function setError(id, message) {
    var el = $(id);
    if (!el) return false;
    if (message) {
      el.hidden = false;
      el.textContent = message;
      return false;
    }
    el.hidden = true;
    el.textContent = "";
    return true;
  }

  function valueOf(id) {
    var el = $(id);
    return el ? String(el.value || "").trim() : "";
  }

  function product() {
    return valueOf("product-input") || "Personal Loan";
  }

  function isMobile(value) {
    return /^[6-9]\d{9}$/.test(value);
  }

  function isPositiveNumber(value) {
    var n = Number(value);
    return isFinite(n) && n > 0;
  }

  function validateStep1() {
    var ok = true;

    if (!valueOf("full-name")) {
      setError("full-name-error", "Enter your full name.");
      ok = false;
    } else setError("full-name-error", "");

    if (!isMobile(valueOf("mobile"))) {
      setError("mobile-error", "Enter a valid 10-digit Indian mobile number.");
      ok = false;
    } else setError("mobile-error", "");

    if (!isPositiveNumber(valueOf("loan-amount"))) {
      setError("loan-amount-error", "Enter the required loan amount in rupees.");
      ok = false;
    } else setError("loan-amount-error", "");

    if (!$("consent").checked) {
      setError("consent-error", "Tick the consent box to continue.");
      ok = false;
    } else setError("consent-error", "");

    return ok;
  }

  function validateStep2() {
    var ok = true;
    var chosen = product();

    if (chosen === "Personal Loan") {
      if (!isPositiveNumber(valueOf("monthly-salary"))) {
        setError("monthly-salary-error", "Enter your monthly salary.");
        ok = false;
      } else setError("monthly-salary-error", "");

      if (!valueOf("employer-name")) {
        setError("employer-name-error", "Enter your employer name.");
        ok = false;
      } else setError("employer-name-error", "");
    }

    if (chosen === "Business Loan") {
      if (!isPositiveNumber(valueOf("annual-turnover"))) {
        setError("annual-turnover-error", "Enter annual turnover.");
        ok = false;
      } else setError("annual-turnover-error", "");

      if (valueOf("business-vintage") === "" || Number(valueOf("business-vintage")) < 0) {
        setError("business-vintage-error", "Enter business vintage in years.");
        ok = false;
      } else setError("business-vintage-error", "");
    }

    if (chosen === "Home Loan") {
      if (!isPositiveNumber(valueOf("monthly-income"))) {
        setError("monthly-income-error", "Enter monthly income.");
        ok = false;
      } else setError("monthly-income-error", "");

      if (!valueOf("property-city")) {
        setError("property-city-error", "Enter the property city.");
        ok = false;
      } else setError("property-city-error", "");
    }

    return ok;
  }

  function makeLeadId() {
    return "QL-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function payload(status) {
    var data = {
      status: status,
      leadId: sessionStorage.getItem(leadKey) || "",
      product: product(),
      fullName: valueOf("full-name"),
      mobile: valueOf("mobile"),
      loanAmount: valueOf("loan-amount"),
      consent: $("consent").checked ? "yes" : "no",
      monthlySalary: valueOf("monthly-salary"),
      employerName: valueOf("employer-name"),
      annualTurnover: valueOf("annual-turnover"),
      businessVintageYears: valueOf("business-vintage"),
      monthlyIncome: valueOf("monthly-income"),
      propertyCity: valueOf("property-city"),
      timestamp: new Date().toISOString(),
    };
    return data;
  }

  function mockSave(data) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({ ok: true, mock: true, leadId: data.leadId, status: data.status });
      }, 450);
    });
  }

  function saveLead(data) {
    var url = cfg.sheetWebAppUrl;
    if (!url) return mockSave(data);

    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    }).then(function () {
      return { ok: true, leadId: data.leadId, status: data.status };
    });
  }

  function setBusy(button, busy) {
    button.disabled = busy;
    button.textContent = busy ? "Sending…" : button.getAttribute("data-label");
  }

  nextBtn.setAttribute("data-label", "Continue");
  submitBtn.setAttribute("data-label", "Submit enquiry");

  function setProgress(step) {
    document.querySelectorAll("#form-progress [data-progress]").forEach(function (item) {
      var n = Number(item.getAttribute("data-progress"));
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step);
    });
  }

  function swapStep(fromEl, toEl, focusEl) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      fromEl.hidden = true;
      toEl.hidden = false;
      if (focusEl) focusEl.focus();
      return;
    }

    fromEl.classList.add("is-leaving");
    window.setTimeout(function () {
      fromEl.hidden = true;
      fromEl.classList.remove("is-leaving");
      toEl.hidden = false;
      toEl.classList.add("is-leaving");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          toEl.classList.remove("is-leaving");
        });
      });
      if (focusEl) focusEl.focus({ preventScroll: true });
    }, 180);
  }

  setProgress(1);

  // Prefill fake demo values so the page feels alive.
  $("full-name").placeholder = fake.fullName || "Riya Kapoor";
  $("mobile").placeholder = fake.mobile || "9876501234";
  $("loan-amount").placeholder = String(fake.loanAmount || 450000);
  $("monthly-salary").placeholder = String(fake.monthlySalary || 52000);
  $("employer-name").placeholder = fake.employerName || "Cedar Soft Pvt Ltd";
  $("annual-turnover").placeholder = String(fake.annualTurnover || 3800000);
  $("business-vintage").placeholder = String(fake.businessVintageYears || 5);
  $("monthly-income").placeholder = String(fake.monthlyIncome || 78000);
  $("property-city").placeholder = fake.propertyCity || "Indore";

  nextBtn.addEventListener("click", function () {
    success.hidden = true;
    if (!validateStep1()) return;

    var leadId = sessionStorage.getItem(leadKey) || makeLeadId();
    sessionStorage.setItem(leadKey, leadId);

    var data = payload("partial");
    data.leadId = leadId;

    setBusy(nextBtn, true);
    saveLead(data)
      .then(function () {
        setProgress(2);
        swapStep(step1, step2, $("step-2-label"));
        note.textContent = "Partial enquiry saved. Finish step 2 to mark it complete.";
      })
      .catch(function () {
        setError("consent-error", "Could not save just now. Try again.");
      })
      .finally(function () {
        setBusy(nextBtn, false);
      });
  });

  backBtn.addEventListener("click", function () {
    setProgress(1);
    swapStep(step2, step1, $("full-name"));
  });

  submitBtn.addEventListener("click", function () {
    success.hidden = true;
    if (!validateStep2()) return;

    var leadId = sessionStorage.getItem(leadKey) || makeLeadId();
    sessionStorage.setItem(leadKey, leadId);
    var data = payload("complete");
    data.leadId = leadId;

    setBusy(submitBtn, true);
    saveLead(data)
      .then(function () {
        success.hidden = false;
        success.textContent =
          "Thanks " +
          data.fullName.split(" ")[0] +
          ". Your sample enquiry for " +
          data.product +
          " is marked complete. This is demo data only.";
        note.textContent = "You can change the product above and try another sample enquiry.";
        form.reset();
        sessionStorage.removeItem(leadKey);
        setProgress(1);
        step2.hidden = true;
        step1.hidden = false;
        document.getElementById("selected-product").textContent = data.product;
        document.getElementById("product-input").value = data.product;
      })
      .catch(function () {
        note.textContent = "Could not finish the enquiry. Try again.";
      })
      .finally(function () {
        setBusy(submitBtn, false);
      });
  });
})();
