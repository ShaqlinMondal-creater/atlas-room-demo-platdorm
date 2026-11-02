/*
  Eligibility flow: Mobile → OTP → product details → processing → success.
*/
(function () {
  var cfg = window.QUICKLOAN_DEMO || {};
  var fake = cfg.fakeLead || {};
  var form = document.getElementById("lead-form");
  if (!form) return;

  var step1 = document.getElementById("step-1");
  var stepOtp = document.getElementById("step-otp");
  var step2 = document.getElementById("step-2");
  var stepProcessing = document.getElementById("step-processing");
  var stepSuccess = document.getElementById("step-success");
  var productTabs = document.getElementById("product-tabs");
  var formProgress = document.getElementById("form-progress");
  var formLede = document.getElementById("form-lede");
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

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isPositiveNumber(value) {
    var n = Number(value);
    return isFinite(n) && n > 0;
  }

  function isGstin(value) {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i.test(value);
  }

  function isPin(value) {
    return /^[1-9][0-9]{5}$/.test(value);
  }

  function money(value) {
    return "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");
  }

  /* Deterministic 10–15% haircut so the offer feels steady, not random. */
  function offeredAmount(requested) {
    var amount = Math.max(0, Number(requested) || 0);
    var pct = 0.1 + ((Math.round(amount) % 6) / 100);
    return Math.max(1000, Math.round((amount * (1 - pct)) / 1000) * 1000);
  }

  function validateMobile() {
    if (!isMobile(valueOf("mobile"))) {
      setError("mobile-error", "Enter a valid 10-digit Indian mobile number.");
      return false;
    }
    setError("mobile-error", "");
    return true;
  }

  function validateDetails() {
    var ok = true;
    var chosen = product();

    if (!isEmail(valueOf("email"))) {
      setError("email-error", "Enter a valid email.");
      ok = false;
    } else setError("email-error", "");

    if (!valueOf("full-name")) {
      setError("full-name-error", "Enter your full name.");
      ok = false;
    } else setError("full-name-error", "");

    if (chosen === "Personal Loan") {
      if (!valueOf("employment-type")) {
        setError("employment-type-error", "Select employment type.");
        ok = false;
      } else setError("employment-type-error", "");
    }

    if (chosen === "Business Loan") {
      if (!valueOf("business-type")) {
        setError("business-type-error", "Select business type.");
        ok = false;
      } else setError("business-type-error", "");

      if (!valueOf("business-name")) {
        setError("business-name-error", "Enter business name.");
        ok = false;
      } else setError("business-name-error", "");

      if (!isGstin(valueOf("gstin"))) {
        setError("gstin-error", "Enter a valid 15-character GSTIN.");
        ok = false;
      } else setError("gstin-error", "");
    }

    if (chosen === "Home Loan") {
      if (!valueOf("address")) {
        setError("address-error", "Enter property address.");
        ok = false;
      } else setError("address-error", "");

      if (!valueOf("city")) {
        setError("city-error", "Enter city.");
        ok = false;
      } else setError("city-error", "");

      if (!isPin(valueOf("pin"))) {
        setError("pin-error", "Enter a valid 6-digit PIN.");
        ok = false;
      } else setError("pin-error", "");
    }

    if (!isPositiveNumber(valueOf("loan-amount"))) {
      setError("loan-amount-error", "Enter the required loan amount.");
      ok = false;
    } else setError("loan-amount-error", "");

    if (!$("consent") || !$("consent").checked) {
      setError("consent-error", "Agree to the policy to continue.");
      ok = false;
    } else setError("consent-error", "");

    return ok;
  }

  function makeLeadId() {
    return "QL-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  function payload(status, offered) {
    return {
      status: status,
      leadId: sessionStorage.getItem(leadKey) || "",
      product: product(),
      mobile: valueOf("mobile"),
      email: valueOf("email"),
      fullName: valueOf("full-name"),
      loanAmount: valueOf("loan-amount"),
      offeredAmount: offered || "",
      employmentType: valueOf("employment-type"),
      businessType: valueOf("business-type"),
      businessName: valueOf("business-name"),
      gstin: valueOf("gstin").toUpperCase(),
      address: valueOf("address"),
      city: valueOf("city"),
      pin: valueOf("pin"),
      consent: $("consent") && $("consent").checked ? "yes" : "no",
      timestamp: new Date().toISOString(),
    };
  }

  function mockSave(data) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        resolve({ ok: true, mock: true, leadId: data.leadId, status: data.status });
      }, 420);
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
    if (!button) return;
    button.disabled = busy;
    button.textContent = busy ? busyLabel || "Sending…" : button.getAttribute("data-label");
  }

  nextBtn.setAttribute("data-label", "Send OTP");
  otpVerifyBtn.setAttribute("data-label", "Verify & continue");
  submitBtn.setAttribute("data-label", "Submit");

  function setProgress(step) {
    document.querySelectorAll("#form-progress [data-progress]").forEach(function (item) {
      var n = Number(item.getAttribute("data-progress"));
      var mark = item.querySelector("strong");
      item.classList.toggle("is-active", n === step);
      item.classList.toggle("is-done", n < step);
      if (mark) mark.textContent = n < step ? "✓" : String(n);
    });
  }

  function syncProductChip() {
    var chip = $("product-chip");
    if (!chip) return;
    chip.textContent = product();
    chip.setAttribute("data-product", product());
  }

  function showChrome(mode) {
    /* "mobile" | "otp" | "details" | "done" */
    var isMobile = mode === "mobile";
    var isOtp = mode === "otp";
    var isDone = mode === "done";
    if (productTabs) productTabs.hidden = !isMobile;
    if (formLede) formLede.hidden = !isMobile;
    if (formProgress) formProgress.hidden = isDone;
    if (note) note.hidden = !isMobile;
    var chip = $("product-chip");
    if (chip) {
      chip.hidden = !isOtp;
      if (!chip.hidden) syncProductChip();
    }
  }

  function hideAllSteps() {
    [step1, stepOtp, step2, stepProcessing, stepSuccess].forEach(function (el) {
      if (!el) return;
      el.hidden = true;
      el.classList.remove("is-leaving");
    });
  }

  function swapStep(fromEl, toEl, focusEl) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !fromEl || fromEl.hidden) {
      hideAllSteps();
      toEl.hidden = false;
      if (focusEl) focusEl.focus({ preventScroll: true });
      return;
    }

    fromEl.classList.add("is-leaving");
    window.setTimeout(function () {
      hideAllSteps();
      toEl.hidden = false;
      toEl.classList.add("is-leaving");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          toEl.classList.remove("is-leaving");
        });
      });
      if (focusEl) focusEl.focus({ preventScroll: true });
    }, 160);
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

  function buildSuccessHtml(data, offered) {
    var first = (data.fullName || "there").split(" ")[0];
    var asked = money(data.loanAmount);
    var get = money(offered);

    if (data.product === "Home Loan") {
      return (
        "<p class=\"success__kicker\">Home loan path ready</p>" +
        "<p class=\"success__title\">Thanks, " +
        first +
        ".</p>" +
        "<p>You asked for <strong>" +
        asked +
        "</strong>. Based on a first check, we can take this forward near <strong>" +
        get +
        "</strong>.</p>" +
        "<ul class=\"success__list\">" +
        "<li>Keep sale deed / allotment letter ready</li>" +
        "<li>Carry KYC, income proof and property papers</li>" +
        "<li>Visit the partner bank branch to complete documentation</li>" +
        "</ul>" +
        "<p class=\"success__note\">An advisor will call " +
        maskMobile(data.mobile) +
        " to schedule your bank visit.</p>"
      );
    }

    if (data.product === "Business Loan") {
      return (
        "<p class=\"success__kicker\">Business loan first check</p>" +
        "<p class=\"success__title\">Good news, " +
        first +
        ".</p>" +
        "<p>You requested <strong>" +
        asked +
        "</strong>. Indicative eligibility is around <strong>" +
        get +
        "</strong> after GST and business review.</p>" +
        "<p class=\"success__note\">We will call " +
        maskMobile(data.mobile) +
        " with next steps for " +
        (data.businessName || "your business") +
        ".</p>"
      );
    }

    return (
      "<p class=\"success__kicker\">Personal loan first check</p>" +
      "<p class=\"success__title\">You're cleared to continue, " +
      first +
      ".</p>" +
      "<p>Requested <strong>" +
      asked +
      "</strong>. Indicative offer band is about <strong>" +
      get +
      "</strong> (about 10–15% below your ask after a soft check).</p>" +
      "<p class=\"success__note\">Our team will call " +
      maskMobile(data.mobile) +
      " shortly.</p>"
    );
  }

  function resetToStart(keepProduct) {
    var current = keepProduct || product();
    form.reset();
    sessionStorage.removeItem(leadKey);
    sessionStorage.removeItem(otpKey);
    sessionStorage.removeItem(otpVerifiedKey);
    clearOtpInputs();
    showChrome("mobile");
    hideAllSteps();
    step1.hidden = false;
    setProgress(1);
    document.getElementById("selected-product").textContent = current;
    document.getElementById("product-input").value = current;
    document.querySelectorAll("[data-product]").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-product") === current ? "true" : "false");
    });
    document.querySelectorAll("[data-step-product]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-step-product") !== current;
    });
    if (note) {
      note.textContent = "We use your details only to contact you about this enquiry.";
    }
  }

  showChrome("mobile");
  setProgress(1);
  wireOtpInputs();

  if ($("mobile")) $("mobile").placeholder = fake.mobile || "9876501234";
  if ($("email")) $("email").placeholder = fake.email || "riya@email.com";
  if ($("full-name")) $("full-name").placeholder = fake.fullName || "Riya Kapoor";
  if ($("loan-amount")) $("loan-amount").placeholder = String(fake.loanAmount || 450000);
  if ($("business-name")) $("business-name").placeholder = fake.businessName || "Cedar Traders";
  if ($("gstin")) $("gstin").placeholder = fake.gstin || "22AAAAA0000A1Z5";
  if ($("address")) $("address").placeholder = fake.address || "12 Lake View Road";
  if ($("city")) $("city").placeholder = fake.city || "Indore";
  if ($("pin")) $("pin").placeholder = fake.pin || "452001";

  nextBtn.addEventListener("click", function () {
    if (!validateMobile()) return;

    var leadId = sessionStorage.getItem(leadKey) || makeLeadId();
    sessionStorage.setItem(leadKey, leadId);

    var data = payload("partial");
    data.leadId = leadId;

    setBusy(nextBtn, true);
    saveLead(data)
      .then(function () {
        issueOtp();
        showChrome("otp");
        setProgress(2);
        swapStep(step1, stepOtp, $("otp-0"));
      })
      .catch(function () {
        setError("mobile-error", "Could not send OTP just now. Try again.");
      })
      .finally(function () {
        setBusy(nextBtn, false);
      });
  });

  otpBackBtn.addEventListener("click", function () {
    showChrome("mobile");
    setProgress(1);
    swapStep(stepOtp, step1, $("mobile"));
  });

  otpResend.addEventListener("click", function () {
    issueOtp();
    if (otpDigits[0]) otpDigits[0].focus();
  });

  otpVerifyBtn.addEventListener("click", function () {
    var entered = readOtp();
    if (!/^\d{6}$/.test(entered)) {
      setError("otp-error", "Enter the 6-digit code.");
      return;
    }

    setBusy(otpVerifyBtn, true, "Verifying…");
    window.setTimeout(function () {
      sessionStorage.setItem(otpVerifiedKey, "1");
      showChrome("details");
      setProgress(3);
      swapStep(stepOtp, step2, $("email"));
      setBusy(otpVerifyBtn, false);
    }, 420);
  });

  backBtn.addEventListener("click", function () {
    showChrome("otp");
    setProgress(2);
    swapStep(step2, stepOtp, $("otp-0"));
  });

  submitBtn.addEventListener("click", function () {
    if (!validateDetails()) return;

    var leadId = sessionStorage.getItem(leadKey) || makeLeadId();
    sessionStorage.setItem(leadKey, leadId);
    var offered = offeredAmount(valueOf("loan-amount"));
    var data = payload("complete", offered);
    data.leadId = leadId;
    data.mobileVerified = sessionStorage.getItem(otpVerifiedKey) === "1" ? "yes" : "no";

    setBusy(submitBtn, true, "Submitting…");
    showChrome("done");
    swapStep(step2, stepProcessing, $("processing-label"));

    saveLead(data)
      .then(function () {
        window.setTimeout(function () {
          success.innerHTML = buildSuccessHtml(data, offered);
          showChrome("done");
          swapStep(stepProcessing, stepSuccess, null);
          setBusy(submitBtn, false);
        }, 1100);
      })
      .catch(function () {
        showChrome("details");
        setProgress(3);
        swapStep(stepProcessing, step2, $("loan-amount"));
        setBusy(submitBtn, false);
      });
  });

  document.querySelectorAll("[data-product]").forEach(function (button) {
    button.addEventListener("click", function () {
      window.setTimeout(syncProductChip, 0);
    });
  });

  document.querySelectorAll("[data-apply-close]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (!stepSuccess.hidden) {
        window.setTimeout(function () {
          resetToStart(product());
        }, 120);
      }
    });
  });
})();
