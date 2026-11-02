/*
  Gate for static template pages.
  Keep STORAGE_KEY and TTL_MINUTES in sync with src/config/constants.js
*/
(function () {
  var STORAGE_KEY = "atlas-room-access";
  var TTL_MINUTES = 15;

  document.documentElement.classList.add("gate-lock");

  function readEntry(code) {
    try {
      var map = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return map[code] || null;
    } catch (err) {
      return null;
    }
  }

  function unlock() {
    document.documentElement.classList.remove("gate-lock");
  }

  function block(message) {
    document.title = "Access required";
    document.body.innerHTML =
      '<main style="min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;' +
      "font-family:Georgia,'Times New Roman',serif;background:#0f1720;color:#f5f1e8;text-align:center\">" +
      "<div><h1 style=\"margin:0\">Access blocked</h1>" +
      '<p style="max-width:36ch;line-height:1.5;margin:10px auto 0;color:#c8d0d8">' +
      message +
      "</p>" +
      '<p style="margin:16px 0 0"><a href="/" style="color:#9fd4c2">Back to showcase</a></p></div></main>';
    unlock();
  }

  function check() {
    var params = new URLSearchParams(window.location.search);
    var token = (params.get("token") || "").trim();
    var desk = params.get("desk") === "1";
    var pathMatch = window.location.pathname.match(/\/templates\/([^/]+)\//i);
    var code = pathMatch ? pathMatch[1].toUpperCase() : "";

    /* Desk embeds in the showcase modal only — not a full unlock. */
    if (desk) {
      unlock();
      return;
    }

    if (!code || !token) {
      block("Open this template from the showcase with a valid access token.");
      return;
    }

    var entry = readEntry(code);
    if (!entry || entry.token !== token) {
      block("This token is not valid for this template.");
      return;
    }

    if (Date.now() > Number(entry.expiresAt)) {
      block(
        "This access link expired after " +
          TTL_MINUTES +
          " minutes. Unlock the template again from the showcase."
      );
      return;
    }

    unlock();
  }

  if (document.body) {
    check();
  } else {
    document.addEventListener("DOMContentLoaded", check);
  }
})();
