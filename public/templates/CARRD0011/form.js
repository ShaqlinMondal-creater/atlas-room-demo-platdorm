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
  var stepOtp = document.getElementById("step-otp");
  var step2 = document.getElementById("step-2");
  var nextBtn = document.getElementById("next-btn");
  var backBtn = document.getElementById("back-btn");
  var otpBackBtn = document.getElementById("otp-back-btn");
  var otpVerifyBtn = document.getElementById("otp-verify-btn");
  var otpResend = document.getElementById("otp-resend");
  var otpTimer = document.getElementById("otp-timer");
  var otpLede = document.getElementById("otp-lede");
  var submitBtn = document.getElementById("submit-btn");
  var success = document.getElementById("form-success");
  var note = document.getElementById("layout-note");
  var leadKey = "quickloan-demo-lead-id";
  var otpKey = "quickloan-demo-otp";
  var otpVerifiedKey = "quickloan-demo-otp-ok";
  var otpTimerId = null;
  var otpDigits = [0, 1, 2, 3, 4, 5].map(function (n) {
    return $("otp-" + n);
  });

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

  function setBusy(button, busy, busyLabel) {
    button.disabled = busy;
    button.textContent = busy ? busyLabel || "Sending…" : button.getAttribute("data-label");
  }

  nextBtn.setAttribute("data-label", "Continue");
  otpVerifyBtn.setAttribute("data-label", "Verify & continue");
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

  function maskMobile(value) {
    var digits = String(value || "").replace(/\D/g, "");
    if (digits.length < 4) return "your mobile";
    return "+91 ••••• " + digits.slice(-4);
  }

  function clearOtpInputs() {
    otpDigits.forEach(function (input) {
      if (input) input.value = "";
    });
    setError("otp-error", "");
  }

  function readOtp() {
    return otpDigits
      .map(function (input) {
        return input ? String(input.value || "").replace(/\D/g, "") : "";
      })
      .join("");
  }

  function issueOtp() {
    var code = String(100000 + Math.floor(Math.random() * 900000));
    sessionStorage.setItem(otpKey, code);
    sessionStorage.removeItem(otpVerifiedKey);
    if (otpLede) {
      otpLede.textContent = "Enter the 6-digit code sent to " + maskMobile(valueOf("mobile")) + ".";
    }
    clearOtpInputs();
    startResendTimer(30);
    /* Soft local verify for the showcase — no SMS gateway. */
    window.__quickloanOtpHint = code;
  }

  function startResendTimer(seconds) {
    var left = seconds;
    if (otpTimerId) window.clearInterval(otpTimerId);
    if (otpResend) otpResend.disabled = true;
    function tick() {
      if (otpTimer) {
        otpTimer.textContent = left > 0 ? "Resend in " + left + "s" : "";
      }
      if (left <= 0) {
        window.clearInterval(otpTimerId);
        otpTimerId = null;
        if (otpResend) otpResend.disabled = false;
        return;
      }
      left -= 1;
    }
    tick();
    otpTimerId = window.setInterval(tick, 1000);
  }

  function wireOtpInputs() {
    otpDigits.forEach(function (input, index) {
      if (!input) return;

      input.addEventListener("input", function () {
        var digit = String(input.value || "").replace(/\D/g, "").slice(-1);
        input.value = digit;
        setError("otp-error", "");
        if (digit && otpDigits[index + 1]) otpDigits[index + 1].focus();
      });

      input.addEventListener("keydown", function (event) {
        if (event.key === "Backspace" && !input.value && otpDigits[index - 1]) {
          otpDigits[index - 1].focus();
        }
        if (event.key === "Enter") {
          event.preventDefault();
          otpVerifyBtn.click();
        }
      });

      input.addEventListener("paste", function (event) {
        var text = (event.clipboardData || window.clipboardData).getData("text") || "";
        var digits = text.replace(/\D/g, "").slice(0, 6);
        if (digits.length < 2) return;
        event.preventDefault();
        otpDigits.forEach(function (box, i) {
          if (box) box.value = digits.charAt(i) || "";
        });
        var focusIndex = Math.min(digits.length, 5);
        if (otpDigits[focusIndex]) otpDigits[focusIndex].focus();
      });
    });
  }

  setProgress(1);
  wireOtpInputs();

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
        issueOtp();
        setProgress(2);
        swapStep(step1, stepOtp, $("otp-0"));
        note.textContent = "Code sent. Verify your mobile to continue.";
      })
      .catch(function () {
        setError("consent-error", "Could not save just now. Try again.");
      })
      .finally(function () {
        setBusy(nextBtn, false);
      });
  });

  otpBackBtn.addEventListener("click", function () {
    setProgress(1);
    swapStep(stepOtp, step1, $("full-name"));
  });

  otpResend.addEventListener("click", function () {
    issueOtp();
    note.textContent = "A new code was sent to " + maskMobile(valueOf("mobile")) + ".";
    if (otpDigits[0]) otpDigits[0].focus();
  });

  otpVerifyBtn.addEventListener("click", function () {
    var entered = readOtp();
    var expected = sessionStorage.getItem(otpKey) || "";

    if (entered.length !== 6) {
      setError("otp-error", "Enter the 6-digit code.");
      return;
    }

    /* Soft local check: any complete 6-digit code passes (no SMS gateway). */
    if (!/^\d{6}$/.test(entered)) {
      setError("otp-error", "Enter the 6-digit code.");
      return;
    }
    void expected;

    setBusy(otpVerifyBtn, true, "Verifying…");
    window.setTimeout(function () {
      sessionStorage.setItem(otpVerifiedKey, "1");
      setProgress(3);
      swapStep(stepOtp, step2, $("step-2-label"));
      note.textContent = "Mobile verified. Finish product details to complete your enquiry.";
      setBusy(otpVerifyBtn, false);
    }, 420);
  });

  backBtn.addEventListener("click", function () {
    setProgress(2);
    swapStep(step2, stepOtp, $("otp-0"));
  });

  submitBtn.addEventListener("click", function () {
    success.hidden = true;
    if (!validateStep2()) return;

    var leadId = sessionStorage.getItem(leadKey) || makeLeadId();
    sessionStorage.setItem(leadKey, leadId);
    var data = payload("complete");
    data.leadId = leadId;
    data.mobileVerified = sessionStorage.getItem(otpVerifiedKey) === "1" ? "yes" : "no";

    setBusy(submitBtn, true);
    saveLead(data)
      .then(function () {
        success.hidden = false;
        success.textContent =
          "Thanks " +
          data.fullName.split(" ")[0] +
          ". Your enquiry for " +
          data.product +
          " is in. Our team will call you on the mobile you shared.";
        note.textContent = "Need a different product? Change the loan type above and start again.";
        form.reset();
        sessionStorage.removeItem(leadKey);
        sessionStorage.removeItem(otpKey);
        sessionStorage.removeItem(otpVerifiedKey);
        setProgress(1);
        step2.hidden = true;
        stepOtp.hidden = true;
        step1.hidden = false;
        clearOtpInputs();
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
