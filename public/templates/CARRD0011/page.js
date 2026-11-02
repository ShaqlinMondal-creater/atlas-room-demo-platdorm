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

  var icons = {
    bolt: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z"/></svg>',
    fee: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4V6zm1 4h14a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a1 1 0 0 1 1-1zm7 2.2c-1.7 0-3 .9-3 2.3S10.3 17 12 17s3-.9 3-2.3-.9-2.5-3-2.5zm0 1.3c.7 0 1.2.3 1.2.9S12.7 15.3 12 15.3s-1.2-.3-1.2-.9.5-.9 1.2-.9z"/></svg>',
    zero: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2 9.5 4.1 6.2 3.5l-.4 3.4L2.9 9.1l2.1 2.7L3.8 15l3.2 1.2.9 3.3 3.3-1.1L14 21l1.1-3.5 3.3 1.1.9-3.3L22.5 15l-1.2-3.2 2.1-2.7-2.9-2.2-.4-3.4-3.3.6L12 2zm0 5.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5z"/></svg>',
    flex: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 4a8 8 0 0 1 7.5 5.2l1.8-.7A10 10 0 0 0 4.2 7.6L2.8 6.2 1.4 7.6l2.1 2.1A10 10 0 0 0 12 22v-2a8 8 0 1 1 0-16zm1 3v5.2l3.4 2-1 1.7-4.4-2.6V7h2z"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M3 7a3 3 0 0 1 3-3h11v2H6a1 1 0 0 0 0 2h13a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7zm14 6a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 17 13z"/></svg>',
    calc: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 4v3h8V6H8zm0 5v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2zm-8 4v2h2v-2H8zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/></svg>',
    form: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M5 3h11l3 3v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm10 1.5V7h2.5L15 4.5zM7 10h10v2H7v-2zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/></svg>',
    otp: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V6zm3 8.7V17h-2v-2.3a2 2 0 1 1 2 0z"/></svg>',
    plan: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2zm12 8H5v10h14V10zm-9 2h2v2H10v-2zm4 0h2v2h-2v-2zm-4 4h2v2H10v-2zm4 0h2v2h-2v-2z"/></svg>',
    kyc: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M3 5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm11 0v3h3l-3-3zM8.5 11A2.5 2.5 0 1 0 11 13.5 2.5 2.5 0 0 0 8.5 11zm7.1 7H5.9c.4-1.7 2.1-3 4.1-3h1c2 0 3.7 1.3 4.1 3z"/></svg>',
    rate: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 3 9 8H3l5 4-2 7 6-4 6 4-2-7 5-4h-6l-3-5z"/></svg>',
    compare: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M7 2h10a2 2 0 0 1 2 2v16l-7-3-7 3V4a2 2 0 0 1 2-2zm2 5v2h6V7H9zm0 4v2h6v-2H9z"/></svg>',
    elig: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 5h16v2H4V5zm0 4h10v2H4V9zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm12.6-1.4L14 18.2l-1.4-1.4L11.2 18l2.8 2.8 4.2-4.2-1.6-1.6z"/></svg>',
    city: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M3 21V7l6-4 4 3v2h2V8l6 4v9h-2v-7h-4v7H3zm2-2h6v-7H9v-2.2L5 12.5V19z"/></svg>',
    salary: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 3.5A2.5 2.5 0 1 0 14.5 8 2.5 2.5 0 0 0 12 5.5z"/></svg>',
  };

  function iconHtml(name) {
    return icons[name] || icons.bolt;
  }

  var heroFeatures = document.getElementById("hero-features");
  if (heroFeatures && Array.isArray(cfg.heroFeatures)) {
    heroFeatures.innerHTML = cfg.heroFeatures
      .map(function (item) {
        return (
          '<li><span class="hero-check-icon" aria-hidden="true">' +
          iconHtml(item.icon) +
          "</span><span>" +
          item.text +
          "</span></li>"
        );
      })
      .join("");
  }

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

  function stars(count) {
    var n = Math.max(0, Math.min(5, Number(count) || 5));
    var out = "";
    for (var i = 0; i < 5; i += 1) out += i < n ? "★" : "☆";
    return out;
  }

  var benefitGrid = document.getElementById("benefit-grid");
  if (benefitGrid && Array.isArray(cfg.benefits)) {
    benefitGrid.innerHTML = cfg.benefits
      .map(function (item) {
        return (
          '<li class="benefit-card">' +
          '<span class="benefit-icon" aria-hidden="true">' +
          iconHtml(item.icon) +
          "</span><strong>" +
          item.title +
          "</strong><p>" +
          item.text +
          "</p></li>"
        );
      })
      .join("");
  }

  var processTrack = document.getElementById("process-track");
  if (processTrack && Array.isArray(cfg.howSteps)) {
    processTrack.innerHTML = cfg.howSteps
      .map(function (item, index) {
        return (
          '<li class="process-step">' +
          '<span class="process-icon" aria-hidden="true">' +
          iconHtml(item.icon) +
          '</span><span class="process-label">Step ' +
          (index + 1) +
          "</span><strong>" +
          item.title +
          "</strong><p>" +
          item.text +
          "</p></li>"
        );
      })
      .join("");
  }

  function fillGuideList(id, items, kind) {
    var list = document.getElementById(id);
    if (!list || !Array.isArray(items)) return;
    list.innerHTML = items
      .map(function (text) {
        return (
          "<li><span class=\"guide-mark guide-mark--" +
          kind +
          '" aria-hidden="true">' +
          (kind === "do" ? "✓" : "×") +
          "</span><span>" +
          text +
          "</span></li>"
        );
      })
      .join("");
  }

  fillGuideList("dos-list", cfg.dos, "do");
  fillGuideList("donts-list", cfg.donts, "dont");

  var knowRail = document.getElementById("know-rail");
  if (knowRail && Array.isArray(cfg.knowCards)) {
    knowRail.innerHTML = cfg.knowCards
      .map(function (item) {
        return (
          '<li class="know-card know-card--' +
          (item.tone || "jade") +
          '"><span class="know-icon" aria-hidden="true">' +
          iconHtml(item.icon) +
          "</span><strong>" +
          item.title +
          "</strong><p>" +
          item.text +
          "</p></li>"
        );
      })
      .join("");
  }

  var ratingPair = document.getElementById("rating-pair");
  if (ratingPair && cfg.ratings) {
    var ratingsTitle = document.getElementById("ratings-title");
    if (ratingsTitle && cfg.ratings.headline) ratingsTitle.textContent = cfg.ratings.headline;
    ratingPair.innerHTML = ["play", "app"]
      .map(function (key) {
        var item = cfg.ratings[key] || {};
        return (
          '<div class="rating-card"><span class="rating-wreath" aria-hidden="true">❧</span><div><strong>' +
          (item.score || "4.8") +
          " ★</strong><span>" +
          (item.label || "Store") +
          '</span></div><span class="rating-wreath rating-wreath--flip" aria-hidden="true">❧</span></div>'
        );
      })
      .join("");
  }

  var stories = document.getElementById("logo-row");
  if (stories && people.length) {
    stories.innerHTML = people
      .map(function (item) {
        return (
          '<li class="story-card story-card--quote">' +
          "<blockquote>" +
          (item.quote || "") +
          "</blockquote>" +
          '<div class="story-card-foot">' +
          '<img src="' +
          item.image +
          '" alt="" width="48" height="48" loading="lazy">' +
          "<div><strong>" +
          (item.name || "Customer") +
          '</strong><span class="story-stars" aria-label="' +
          (item.rating || 5) +
          ' stars">' +
          stars(item.rating) +
          '</span><span class="story-meta">' +
          (item.role || "Loan") +
          (item.city ? " · " + item.city : "") +
          (item.date ? " · " + item.date : "") +
          "</span></div></div>" +
          '<span class="story-quote-mark" aria-hidden="true">”</span></li>'
        );
      })
      .join("");
  }

  var cityRail = document.getElementById("city-rail");
  if (cityRail && Array.isArray(cfg.cities)) {
    cityRail.innerHTML = cfg.cities
      .map(function (item) {
        return (
          '<li class="chip-card"><span class="chip-badge" aria-hidden="true">' +
          iconHtml("city") +
          '</span><div><span class="chip-kicker">Personal loan in</span><strong>' +
          item.name +
          "</strong></div></li>"
        );
      })
      .join("");
  }

  var salaryRail = document.getElementById("salary-rail");
  if (salaryRail && Array.isArray(cfg.salaries)) {
    salaryRail.innerHTML = cfg.salaries
      .map(function (item) {
        return (
          '<li class="chip-card"><span class="chip-badge" aria-hidden="true">' +
          iconHtml("salary") +
          '</span><div><span class="chip-kicker">Personal loan for</span><strong>' +
          item.label +
          " salary</strong></div></li>"
        );
      })
      .join("");
  }

  function wireSlider(root) {
    var viewport = root.querySelector(".slider-viewport");
    var track = root.querySelector(".slider-track");
    var thumb = root.querySelector(".slider-thumb");
    var trackUi = root.querySelector(".slider-track-ui");
    if (!viewport || !track) return;

    function maxScroll() {
      return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    }

    function updateThumb() {
      var max = maxScroll();
      var left = viewport.scrollLeft;
      root.classList.toggle("is-scrollable", max > 8);
      root.querySelectorAll("[data-slide='-1']").forEach(function (btn) {
        btn.disabled = left <= 2;
      });
      root.querySelectorAll("[data-slide='1']").forEach(function (btn) {
        btn.disabled = left >= max - 2;
      });
      if (!thumb || !trackUi) return;
      var ratio = max > 0 ? left / max : 0;
      var travel = Math.max(0, trackUi.clientWidth - thumb.offsetWidth);
      thumb.style.transform = "translateX(" + ratio * travel + "px)";
    }

    function scrollToRatio(ratio) {
      var max = maxScroll();
      viewport.scrollLeft = Math.max(0, Math.min(1, ratio)) * max;
      updateThumb();
    }

    root.querySelectorAll("[data-slide]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = Number(btn.getAttribute("data-slide")) || 1;
        viewport.scrollBy({
          left: dir * Math.max(220, Math.min(viewport.clientWidth * 0.72, 320)),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    });

    if (trackUi && thumb) {
      var dragging = false;

      function ratioFromClientX(clientX) {
        var rect = trackUi.getBoundingClientRect();
        var x = clientX - rect.left - thumb.offsetWidth / 2;
        var travel = Math.max(1, rect.width - thumb.offsetWidth);
        return x / travel;
      }

      trackUi.addEventListener("pointerdown", function (event) {
        dragging = true;
        trackUi.setPointerCapture(event.pointerId);
        scrollToRatio(ratioFromClientX(event.clientX));
      });

      trackUi.addEventListener("pointermove", function (event) {
        if (!dragging) return;
        scrollToRatio(ratioFromClientX(event.clientX));
      });

      function endDrag(event) {
        dragging = false;
        if (trackUi.hasPointerCapture(event.pointerId)) {
          trackUi.releasePointerCapture(event.pointerId);
        }
      }

      trackUi.addEventListener("pointerup", endDrag);
      trackUi.addEventListener("pointercancel", endDrag);
    }

    viewport.addEventListener("scroll", updateThumb, { passive: true });
    window.addEventListener("resize", updateThumb);
    window.requestAnimationFrame(updateThumb);
  }

  document.querySelectorAll("[data-slider]").forEach(wireSlider);

  /* Apply / Check eligibility modal */
  var applyModal = document.getElementById("apply-modal");
  var lastApplyFocus = null;

  function openApply(event) {
    if (event) event.preventDefault();
    if (!applyModal) return;
    lastApplyFocus = document.activeElement;
    applyModal.hidden = false;
    document.body.classList.add("apply-open");
    var title = document.getElementById("form-title");
    if (title) title.focus();
  }

  function closeApply() {
    if (!applyModal || applyModal.hidden) return;
    applyModal.hidden = true;
    document.body.classList.remove("apply-open");
    if (lastApplyFocus && lastApplyFocus.focus) lastApplyFocus.focus();
  }

  document.querySelectorAll("[data-open-apply]").forEach(function (el) {
    el.addEventListener("click", openApply);
  });

  document.querySelectorAll("[data-apply-close]").forEach(function (el) {
    el.addEventListener("click", closeApply);
  });

  if (window.location.hash === "#apply") {
    openApply();
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
    if (event.key !== "Escape") return;
    if (applyModal && !applyModal.hidden) {
      closeApply();
      return;
    }
    closeLegal();
  });
})();
