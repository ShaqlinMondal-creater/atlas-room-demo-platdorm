/*
  Fade scene caption cards based on scroll progress.
*/
import { scrollStops, story } from "../config.js";
import { segment } from "../utils/math.js";

export function bindCaptions() {
  var map = [
    { el: document.getElementById("caption-sun"), from: 0.14, peak: scrollStops.sun, to: 0.36 },
    { el: document.getElementById("caption-nebula"), from: 0.38, peak: scrollStops.nebula, to: 0.62 },
    { el: document.getElementById("caption-galaxy"), from: 0.62, peak: scrollStops.galaxy, to: 0.84 },
  ];

  var sunTitle = document.querySelector("#caption-sun h2");
  var sunBody = document.querySelector("#caption-sun p");
  var nebTitle = document.querySelector("#caption-nebula h2");
  var nebBody = document.querySelector("#caption-nebula p");
  var galTitle = document.querySelector("#caption-galaxy h2");
  var galBody = document.querySelector("#caption-galaxy p");

  if (sunTitle) sunTitle.textContent = story.scenes.sun.title;
  if (sunBody) sunBody.textContent = story.scenes.sun.body;
  if (nebTitle) nebTitle.textContent = story.scenes.nebula.title;
  if (nebBody) nebBody.textContent = story.scenes.nebula.body;
  if (galTitle) galTitle.textContent = story.scenes.galaxy.title;
  if (galBody) galBody.textContent = story.scenes.galaxy.body;

  return function updateCaptions(p) {
    map.forEach(function (item) {
      if (!item.el) return;
      var inFade = segment(item.from, item.peak, p);
      var outFade = 1 - segment(item.peak, item.to, p);
      var opacity = Math.min(inFade, outFade);
      item.el.style.opacity = String(opacity);
      item.el.style.pointerEvents = opacity > 0.2 ? "auto" : "none";
      item.el.classList.toggle("is-visible", opacity > 0.15);
    });
  };
}

export function fillFinaleCopy() {
  var oTitle = document.getElementById("overview-title");
  var oBody = document.getElementById("overview-body");
  var cTitle = document.getElementById("credits-title");
  var cBody = document.getElementById("credits-body");
  var kTitle = document.getElementById("contact-title");
  var kBody = document.getElementById("contact-body");
  var kLink = document.getElementById("contact-link");

  if (oTitle) oTitle.textContent = story.overview.title;
  if (oBody) oBody.textContent = story.overview.body;
  if (cTitle) cTitle.textContent = story.credits.title;
  if (cBody) cBody.textContent = story.credits.body;
  if (kTitle) kTitle.textContent = story.contact.title;
  if (kBody) kBody.textContent = story.contact.body;
  if (kLink) {
    kLink.textContent = story.contact.linkLabel;
    kLink.href = story.contact.linkHref;
  }
}
