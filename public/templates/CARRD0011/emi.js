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
  var unitInputs = document.querySelectorAll('input[name="tenure-unit"]');

  if (!amountInput || !rateInput || !tenureInput) return;

  function money(value) {
    var rounded = Math.round(Number(value) || 0);
    return "₹ " + rounded.toLocaleString("en-IN");
  }

  function currentUnit() {
    var selected = document.querySelector('input[name="tenure-unit"]:checked');
    return selected ? selected.value : "years";
  }

  function syncTenureLimits() {
    var unit = currentUnit();
    var max = unit === "years" ? 30 : 360;
    var min = 1;
    tenureRange.min = String(min);
    tenureRange.max = String(max);
    tenureInput.min = String(min);
    tenureInput.max = String(max);

    var value = Number(tenureInput.value) || min;
    if (value > max) value = max;
    if (value < min) value = min;
    tenureInput.value = String(value);
    tenureRange.value = String(value);
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

  function monthsCount() {
    var tenure = Number(tenureInput.value) || 1;
    return currentUnit() === "years" ? tenure * 12 : tenure;
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
    var result = calcEmi(amountInput.value, rateInput.value, monthsCount());
    softSet(monthlyEl, money(result.emi));
    softSet(interestEl, money(result.interest));
    softSet(totalEl, money(result.total));
  }

  amountInput.value = String(cfg.amount || 450000);
  amountRange.value = String(cfg.amount || 450000);
  rateInput.value = String(cfg.rate || 11.25);
  rateRange.value = String(cfg.rate || 11.25);
  tenureInput.value = String(cfg.tenure || 4);
  tenureRange.value = String(cfg.tenure || 4);

  unitInputs.forEach(function (input) {
    input.checked = input.value === (cfg.unit || "years");
    input.addEventListener("change", function () {
      syncTenureLimits();
      render();
    });
  });

  pair(
    amountRange,
    amountInput,
    cfg.amountMin || 50000,
    cfg.amountMax || 10000000,
    1
  );
  pair(rateRange, rateInput, cfg.rateMin || 0, cfg.rateMax || 24, 0.1);
  pair(tenureRange, tenureInput, 1, 360, 1);

  syncTenureLimits();
  render();
})();
