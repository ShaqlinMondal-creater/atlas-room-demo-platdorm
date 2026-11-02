/*
  EMI calculator embed.
  Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  r = annualRate / 12 / 100, n = months. 0% rate = P / n.
*/
(function () {
  var cfg = (window.QUICKLOAN_DEMO && window.QUICKLOAN_DEMO.emiDefaults) || {};
  var amountRange = document.getElementById("emi-amount-range");
  var amountInput = document.getElementById("emi-amount");
  var rateRange = document.getElementById("emi-rate-range");
  var rateInput = document.getElementById("emi-rate");
  var tenureRange = document.getElementById("emi-tenure-range");
  var tenureInput = document.getElementById("emi-tenure");
  var monthlyEl = document.getElementById("emi-monthly");
  var interestEl = document.getElementById("emi-interest");
  var totalEl = document.getElementById("emi-total");

  if (!amountInput || !rateInput || !tenureInput || !amountRange || !rateRange || !tenureRange) {
    return;
  }

  var tenureMin = 1;
  var tenureMax = cfg.tenureMax || 60;
  var tenureDefault = cfg.tenure || 48;

  function money(value) {
    var rounded = Math.round(Number(value) || 0);
    return "₹ " + rounded.toLocaleString("en-IN");
  }

  function clamp(value, min, max) {
    var n = Number(value);
    if (!isFinite(n)) n = min;
    return Math.min(max, Math.max(min, n));
  }

  function pair(rangeEl, inputEl, min, max, step) {
    function fromRange() {
      inputEl.value = rangeEl.value;
      render();
    }

    function fromInput() {
      var next = clamp(inputEl.value, min, max);
      if (step) {
        next = Math.round(next / step) * step;
        next = clamp(next, min, max);
      }
      inputEl.value = String(next);
      rangeEl.value = String(next);
      render();
    }

    rangeEl.addEventListener("input", fromRange);
    inputEl.addEventListener("input", fromInput);
    inputEl.addEventListener("change", fromInput);
  }

  function calcEmi(principal, annualRate, months) {
    var p = Number(principal) || 0;
    var n = Math.max(1, Number(months) || 1);
    var yearly = Number(annualRate) || 0;

    if (p <= 0) {
      return { emi: 0, total: 0, interest: 0 };
    }

    if (yearly === 0) {
      var flat = p / n;
      return { emi: flat, total: p, interest: 0 };
    }

    var r = yearly / 12 / 100;
    var pow = Math.pow(1 + r, n);
    var emi = (p * r * pow) / (pow - 1);
    var total = emi * n;
    return { emi: emi, total: total, interest: total - p };
  }

  function softSet(el, value) {
    if (!el) return;
    el.classList.add("is-updating");
    el.textContent = value;
    window.requestAnimationFrame(function () {
      window.setTimeout(function () {
        el.classList.remove("is-updating");
      }, 90);
    });
  }

  function render() {
    var months = clamp(tenureInput.value, tenureMin, tenureMax);
    var result = calcEmi(amountInput.value, rateInput.value, months);
    softSet(monthlyEl, money(result.emi));
    softSet(interestEl, money(result.interest));
    softSet(totalEl, money(result.total));
  }

  amountInput.value = String(cfg.amount || 450000);
  amountRange.value = String(cfg.amount || 450000);
  rateInput.value = String(cfg.rate || 11.25);
  rateRange.value = String(cfg.rate || 11.25);
  tenureInput.value = String(tenureDefault);
  tenureRange.value = String(tenureDefault);
  tenureInput.min = String(tenureMin);
  tenureInput.max = String(tenureMax);
  tenureRange.min = String(tenureMin);
  tenureRange.max = String(tenureMax);

  pair(
    amountRange,
    amountInput,
    cfg.amountMin || 50000,
    cfg.amountMax || 1500000,
    1
  );
  pair(rateRange, rateInput, cfg.rateMin || 9.99, cfg.rateMax || 24, 0.1);
  pair(tenureRange, tenureInput, tenureMin, tenureMax, 1);

  render();
})();
