/*
  Shared shell: brand from config, mobile nav, WhatsApp, menu, form, access query.
*/
(function () {
  var cfg = window.CAFE_CONFIG;
  if (!cfg) {
    console.error("CAFE_CONFIG missing - load config.js first.");
    return;
  }

  function waLink(extraText) {
    var num = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    var text = encodeURIComponent(extraText || cfg.whatsappMessage || "");
    return "https://wa.me/" + num + (text ? "?text=" + text : "");
  }

  function pathOnly(href) {
    return String(href || "")
      .split("?")[0]
      .split("#")[0]
      .toLowerCase();
  }

  function fillBrand() {
    document.querySelectorAll("[data-cafe-name]").forEach(function (el) {
      el.textContent = cfg.name;
    });
    document.querySelectorAll("[data-cafe-tagline]").forEach(function (el) {
      el.textContent = cfg.tagline;
    });
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      a.href = waLink();
    });
    document.querySelectorAll("a[data-phone]").forEach(function (a) {
      a.href = "tel:" + String(cfg.phoneTel || "").replace(/\s/g, "");
      if (a.dataset.phoneLabel !== undefined) {
        a.textContent = cfg.phoneDisplay;
      }
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (el.tagName === "A") {
        el.href = "mailto:" + cfg.email;
        el.textContent = cfg.email;
      } else {
        el.textContent = cfg.email;
      }
    });
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
    document.querySelectorAll("[data-menu-note]").forEach(function (el) {
      el.textContent = cfg.menuNote || "";
    });

    var page = document.body.getAttribute("data-page") || "Home";
    document.title = cfg.name + " Cafe | " + page;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && cfg.shortPitch) {
      meta.setAttribute(
        "content",
        cfg.name + " - " + cfg.shortPitch + " View the menu or message us on WhatsApp."
      );
    }
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", cfg.name + " Cafe | " + page);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && cfg.shortPitch) ogDesc.setAttribute("content", cfg.shortPitch);
  }

  function setActiveNav() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!file) file = "index.html";
    document.querySelectorAll("[data-nav] a").forEach(function (a) {
      var href = pathOnly(a.getAttribute("href"));
      var active = href === file || (file === "" && href === "index.html");
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function bindMobileNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-panel]");
    if (!toggle || !panel) return;

    var lastFocus = null;

    function focusables() {
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
    }

    function close() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKey);
      if (lastFocus) lastFocus.focus();
    }

    function open() {
      lastFocus = document.activeElement;
      panel.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
      document.addEventListener("keydown", onKey);
      var items = focusables();
      if (items[0]) items[0].focus();
    }

    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener("click", function () {
      if (panel.classList.contains("is-open")) close();
      else open();
    });

    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  function renderAddress() {
    document.querySelectorAll("[data-address]").forEach(function (el) {
      el.innerHTML = "";
      (cfg.addressLines || []).forEach(function (line) {
        var span = document.createElement("span");
        span.textContent = line;
        el.appendChild(span);
      });
    });
  }

  function renderHours() {
    document.querySelectorAll("[data-hours]").forEach(function (el) {
      el.innerHTML = "";
      (cfg.hours || []).forEach(function (row) {
        var li = document.createElement("li");
        li.innerHTML = "<strong></strong><span></span>";
        li.querySelector("strong").textContent = row.day;
        li.querySelector("span").textContent = row.time;
        el.appendChild(li);
      });
    });
  }

  function renderSocial() {
    document.querySelectorAll("[data-social]").forEach(function (el) {
      el.innerHTML = "";
      var social = cfg.social || {};
      Object.keys(social).forEach(function (key) {
        var url = social[key];
        if (!url) return;
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        el.appendChild(a);
      });
    });
  }

  function renderGallery() {
    var root = document.querySelector("[data-gallery]");
    if (!root) return;
    root.innerHTML = "";
    (cfg.gallery || []).forEach(function (item, index) {
      var fig = document.createElement("figure");
      fig.className = "gallery__item reveal" + (index === 0 ? " gallery__item--feature" : "");
      fig.style.setProperty("--d", index * 55 + "ms");
      fig.innerHTML =
        '<div class="gallery__frame"><img loading="lazy" decoding="async" width="800" height="600" alt=""></div>' +
        "<figcaption></figcaption>";
      var img = fig.querySelector("img");
      img.src = item.src;
      img.alt = item.alt || "";
      fig.querySelector("figcaption").textContent = item.label || "";
      root.appendChild(fig);
    });
  }

  function renderMenu() {
    var root = document.querySelector("[data-menu]");
    if (!root) return;
    root.innerHTML = "";
    var menu = cfg.menu || {};
    Object.keys(menu).forEach(function (cat) {
      var section = document.createElement("section");
      section.className = "menu-block reveal";
      section.id = cat.toLowerCase().replace(/\s+/g, "-");
      section.innerHTML = "<h2></h2><ul class='menu-list'></ul>";
      section.querySelector("h2").textContent = cat;
      var ul = section.querySelector("ul");
      menu[cat].forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML =
          '<div class="menu-list__copy"><p class="menu-list__name"></p><p class="menu-list__detail"></p></div>' +
          '<p class="menu-list__price"></p>';
        li.querySelector(".menu-list__name").textContent = item.name;
        li.querySelector(".menu-list__detail").textContent = item.detail || "";
        li.querySelector(".menu-list__price").textContent = item.price || "";
        ul.appendChild(li);
      });
      root.appendChild(section);
    });

    var tabs = document.querySelector("[data-menu-tabs]");
    if (!tabs) return;

    tabs.innerHTML = "";
    Object.keys(menu).forEach(function (cat, i) {
      var a = document.createElement("a");
      var id = cat.toLowerCase().replace(/\s+/g, "-");
      a.href = "#" + id;
      a.textContent = cat;
      if (i === 0) a.classList.add("is-active");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        tabs.querySelectorAll("a").forEach(function (link) {
          link.classList.remove("is-active");
        });
        a.classList.add("is-active");
        var target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", location.pathname + location.search + "#" + id);
        }
      });
      tabs.appendChild(a);
    });

    if ("IntersectionObserver" in window) {
      var blocks = root.querySelectorAll(".menu-block");
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            tabs.querySelectorAll("a").forEach(function (link) {
              var href = link.getAttribute("href") || "";
              link.classList.toggle("is-active", href === "#" + id || href.indexOf("#" + id) !== -1);
            });
          });
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
      );
      blocks.forEach(function (b) {
        io.observe(b);
      });
    }
  }

  function renderAbout() {
    var about = cfg.about;
    if (!about) return;
    var title = document.querySelector("[data-about-title]");
    var lead = document.querySelector("[data-about-lead]");
    var body = document.querySelector("[data-about-body]");
    var values = document.querySelector("[data-about-values]");
    if (title) title.textContent = about.title;
    if (lead) lead.textContent = about.lead;
    if (body) {
      body.innerHTML = "";
      (about.body || []).forEach(function (p) {
        var el = document.createElement("p");
        el.textContent = p;
        body.appendChild(el);
      });
    }
    if (values) {
      values.innerHTML = "";
      (about.values || []).forEach(function (v) {
        var li = document.createElement("li");
        li.innerHTML = "<h3></h3><p></p>";
        li.querySelector("h3").textContent = v.title;
        li.querySelector("p").textContent = v.text;
        values.appendChild(li);
      });
    }
  }

  function renderMap() {
    var frame = document.querySelector("[data-map]");
    if (!frame || !cfg.mapEmbedUrl) return;
    frame.src = cfg.mapEmbedUrl;
    frame.title = cfg.name + " location map";
    frame.setAttribute("loading", "lazy");
  }

  function bindContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var note = form.querySelector("[data-form-note]");
    var submit = form.querySelector('[type="submit"]');

    function clearErrors() {
      form.querySelectorAll(".form-error").forEach(function (el) {
        el.remove();
      });
      form.querySelectorAll("[aria-invalid]").forEach(function (el) {
        el.removeAttribute("aria-invalid");
      });
    }

    function showError(input, message) {
      input.setAttribute("aria-invalid", "true");
      var err = document.createElement("span");
      err.className = "form-error";
      err.textContent = message;
      input.parentNode.appendChild(err);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      if (note) {
        note.hidden = true;
        note.classList.remove("is-success");
      }

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var ok = true;

      if (!name.value.trim()) {
        showError(name, "Please enter your name.");
        ok = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, "Please enter a valid email.");
        ok = false;
      }
      if (!message.value.trim() || message.value.trim().length < 8) {
        showError(message, "Please write a short message.");
        ok = false;
      }
      if (!ok) {
        var firstBad = form.querySelector("[aria-invalid='true']");
        if (firstBad) firstBad.focus();
        return;
      }

      var composed =
        "Hi " +
        cfg.name +
        " - note from " +
        name.value.trim() +
        " (" +
        email.value.trim() +
        "):\n\n" +
        message.value.trim();

      if (note) {
        note.hidden = false;
        note.classList.add("is-success");
        note.innerHTML =
          "Thanks " +
          name.value.trim().split(" ")[0] +
          ". Your note is ready - " +
          '<a data-wa-compose href="#">continue on WhatsApp</a>' +
          " for the fastest reply during open hours.";
        var link = note.querySelector("[data-wa-compose]");
        if (link) link.href = waLink(composed);
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sent";
        window.setTimeout(function () {
          submit.disabled = false;
          submit.textContent = "Send message";
        }, 2500);
      }
      form.reset();
    });
  }

  function revealOnScroll() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!nodes.length) return;

    function show(el) {
      el.classList.add("is-in");
    }

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(show);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            show(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 120px 0px" }
    );

    nodes.forEach(function (n) {
      var rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -40) show(n);
      else io.observe(n);
    });

    window.setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-in)").forEach(show);
    }, 1200);
  }

  function preserveAccessQuery() {
    var params = new URLSearchParams(window.location.search);
    var desk = params.get("desk");
    var token = params.get("token");
    if (desk !== "1" && !token) return;

    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      if (/^(https?:|mailto:|tel:|#|\/\/)/i.test(href)) return;
      if (href.charAt(0) === "/") return;

      var parts = href.split("#");
      var pathAndQuery = parts[0];
      var hash = parts[1] != null ? "#" + parts[1] : "";
      var path = pathAndQuery.split("?")[0];
      if (!/\.html$/i.test(path) && path !== "" && path !== "./") return;

      var next = new URLSearchParams(pathAndQuery.includes("?") ? pathAndQuery.split("?")[1] : "");
      if (desk === "1") next.set("desk", "1");
      if (token) next.set("token", token);
      var q = next.toString();
      a.setAttribute("href", path + (q ? "?" + q : "") + hash);
    });
  }

  fillBrand();
  setActiveNav();
  bindMobileNav();
  renderAddress();
  renderHours();
  renderSocial();
  renderGallery();
  renderMenu();
  renderAbout();
  renderMap();
  bindContactForm();
  preserveAccessQuery();
  revealOnScroll();
})();
