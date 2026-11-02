/*
  Page chrome: copy, contact links, stats, stories, soft reveals.
*/
(function () {
  var cfg = window.QUICKLOAN_DEMO || {};
  var copy = cfg.copy || {};
  var contact = cfg.contact || {};
  var brand = cfg.brand || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function text(id, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  text("hero-eyebrow", copy.eyebrow);
  text("hero-title", copy.heroTitle);
  text("hero-value", copy.heroValue);
  text("form-title", copy.formTitle);
  text("form-lede", copy.formLede);
  text("emi-title", copy.emiTitle);
  text("emi-lede", copy.emiLede);
  text("trust-title", copy.trustTitle);
  text("trust-lede", copy.trustLede);
  text("demo-note", copy.demoNote);
  text("hero-proof-copy", copy.heroProof);
  text("layout-note", copy.formNote);
  text("brand-name", brand.name || "QuickLoan");
  text("footer-brand", brand.name || "QuickLoan");

  function wirePhone(id, display) {
    var el = document.getElementById(id);
    if (!el || !contact.phoneTel) return;
    el.href = "tel:" + contact.phoneTel;
    if (display && contact.phoneDisplay) el.textContent = contact.phoneDisplay;
  }

  wirePhone("header-call", true);
  wirePhone("footer-call", true);
  wirePhone("call-now", false);

  var callNote = document.getElementById("call-note");
  if (callNote && contact.phoneDisplay) {
    callNote.textContent = contact.phoneDisplay;
  }

  var waBtn = document.getElementById("wa-btn");
  if (waBtn && contact.whatsapp) {
    waBtn.href =
      "https://wa.me/" +
      contact.whatsapp +
      "?text=" +
      encodeURIComponent(contact.whatsappMessage || "Hello");
  }

  var stats = document.getElementById("stat-row");
  if (stats && Array.isArray(cfg.stats)) {
    stats.innerHTML = cfg.stats
      .map(function (item) {
        return (
          "<li><strong>" +
          item.value +
          "</strong><span>" +
          item.label +
          "</span></li>"
        );
      })
      .join("");
  }

  var people = cfg.people || [];

  var heroFaces = document.getElementById("hero-faces");
  if (heroFaces && people.length) {
    heroFaces.innerHTML = people
      .slice(0, 3)
      .map(function (item) {
        return (
          '<img src="' +
          item.image +
          '" alt="" width="36" height="36" loading="lazy">'
        );
      })
      .join("");
  }

  var partnerRow = document.getElementById("partner-row");
  if (partnerRow && Array.isArray(cfg.partners)) {
    partnerRow.innerHTML = cfg.partners
      .map(function (item) {
        return '<li class="partner-pill">' + (item.label || "Partner") + "</li>";
      })
      .join("");
  }

  function formatAmountLabel(value) {
    var n = Number(value) || 0;
    if (n >= 10000000) return "₹" + n / 10000000 + "Cr";
    if (n >= 100000) {
      var lakhs = n / 100000;
      return "₹" + (Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1)) + "L";
    }
    return "₹" + n.toLocaleString("en-IN");
  }

  var amountPicks = document.getElementById("amount-picks");
  var loanAmount = document.getElementById("loan-amount");
  if (amountPicks && loanAmount && Array.isArray(cfg.amountPicks)) {
    amountPicks.innerHTML = cfg.amountPicks
      .map(function (value) {
        return (
          '<button type="button" class="amount-chip" data-amount="' +
          value +
          '">' +
          formatAmountLabel(value) +
          "</button>"
        );
      })
      .join("");

    amountPicks.addEventListener("click", function (event) {
      var chip = event.target.closest(".amount-chip");
      if (!chip) return;
      var value = chip.getAttribute("data-amount");
      loanAmount.value = value;
      amountPicks.querySelectorAll(".amount-chip").forEach(function (item) {
        item.classList.toggle("is-active", item === chip);
      });
      loanAmount.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  var stories = document.getElementById("logo-row");
  if (stories && people.length) {
    stories.innerHTML = people
      .map(function (item) {
        return (
          '<li class="story-card">' +
          '<div class="story-card-top">' +
          '<img src="' +
          item.image +
          '" alt="" width="56" height="56" loading="lazy">' +
          "<div><strong>" +
          (item.name || "Customer") +
          "</strong><span>" +
          (item.role || "Loan") +
          (item.city ? " · " + item.city : "") +
          "</span></div></div>" +
          "<blockquote>" +
          (item.quote || "") +
          "</blockquote></li>"
        );
      })
      .join("");
  }

  var buttons = document.querySelectorAll("[data-product]");
  var productName = document.getElementById("selected-product");
  var productInput = document.getElementById("product-input");

  function showProductFields(product) {
    document.querySelectorAll("[data-step-product]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-step-product") !== product;
    });
  }

  function selectProduct(product) {
    buttons.forEach(function (button) {
      var selected = button.getAttribute("data-product") === product;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    if (productName) productName.textContent = product;
    if (productInput) productInput.value = product;
    showProductFields(product);
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectProduct(button.getAttribute("data-product"));
    });
  });

  selectProduct("Personal Loan");

  function revealSoft() {
    var nodes = document.querySelectorAll(".reveal-soft");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (node, index) {
      node.style.animationDelay = 0.04 + index * 0.05 + "s";
      observer.observe(node);
    });
  }

  revealSoft();

  /* Privacy / Terms modal */
  var legalModal = document.getElementById("legal-modal");
  var legalPrivacy = document.getElementById("legal-privacy");
  var legalTerms = document.getElementById("legal-terms");
  var legalTitle = document.getElementById("legal-title");
  var lastLegalFocus = null;

  function showLegalPanel(which) {
    var privacy = which !== "terms";
    if (legalPrivacy) legalPrivacy.hidden = !privacy;
    if (legalTerms) legalTerms.hidden = privacy;
    if (legalTitle) legalTitle.textContent = privacy ? "Privacy policy" : "Terms of use";
    document.querySelectorAll("[data-legal-tab]").forEach(function (tab) {
      var on = tab.getAttribute("data-legal-tab") === (privacy ? "privacy" : "terms");
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function openLegal(which) {
    if (!legalModal) return;
    lastLegalFocus = document.activeElement;
    showLegalPanel(which || "privacy");
    legalModal.hidden = false;
    document.body.classList.add("legal-open");
    var closeBtn = legalModal.querySelector(".legal-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeLegal() {
    if (!legalModal || legalModal.hidden) return;
    legalModal.hidden = true;
    document.body.classList.remove("legal-open");
    if (lastLegalFocus && lastLegalFocus.focus) lastLegalFocus.focus();
  }

  document.querySelectorAll("[data-legal]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openLegal(link.getAttribute("data-legal"));
    });
  });

  document.querySelectorAll("[data-legal-close]").forEach(function (el) {
    el.addEventListener("click", closeLegal);
  });

  document.querySelectorAll("[data-legal-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      showLegalPanel(tab.getAttribute("data-legal-tab"));
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLegal();
  });
})();
