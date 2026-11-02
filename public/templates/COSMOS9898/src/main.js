/*
  Universe Cosmos — full scroll voyage (Scenes 1–4 + finale).
*/
import * as THREE from "three";
import { story } from "./config.js";
import { createAmbientToggle } from "./audio/ambient.js";
import { createStarfield } from "./scenes/starfield.js";
import { createSolarSystem } from "./scenes/solarSystem.js";
import { createNebula } from "./scenes/nebula.js";
import { createGalaxy } from "./scenes/galaxy.js";
import { bindCaptions, fillFinaleCopy } from "./ui/captions.js";
import { sampleCameraPath } from "./utils/cameraPath.js";
import { cappedPixelRatio } from "./utils/device.js";
import { segment } from "./utils/math.js";
import { prefersReducedMotion } from "./utils/motion.js";
import { canUseWebGL } from "./utils/webgl.js";

var loaderEl = document.getElementById("loader");
var loaderBar = document.getElementById("loader-bar");
var loaderLabel = document.getElementById("loader-label");
var fallbackEl = document.getElementById("fallback");
var hudEl = document.getElementById("hud");
var canvas = document.getElementById("webgl");
var audioBtn = document.getElementById("audio-toggle");

function setProgress(pct, label) {
  if (loaderBar) loaderBar.style.width = Math.max(0, Math.min(100, pct)) + "%";
  if (loaderLabel && label) loaderLabel.textContent = label;
}

function fillCopy() {
  var title = document.getElementById("start-title");
  var lede = document.getElementById("start-lede");
  var hint = document.getElementById("scroll-hint");
  var brand = document.getElementById("start-brand");
  if (brand) brand.textContent = story.brand;
  if (title) title.textContent = story.startTitle;
  if (lede) lede.textContent = story.startLede;
  if (hint) hint.innerHTML = story.scrollHint + "<span>↓</span>";
  if (loaderLabel) loaderLabel.textContent = story.loadingLabel;
  var noTitle = document.getElementById("no-webgl-title");
  var noBody = document.getElementById("no-webgl-body");
  if (noTitle) noTitle.textContent = story.noWebglTitle;
  if (noBody) noBody.textContent = story.noWebglBody;
  fillFinaleCopy();
}

fillCopy();

var ambient = createAmbientToggle(audioBtn);

if (!canUseWebGL()) {
  if (loaderEl) loaderEl.classList.add("is-done");
  if (fallbackEl) fallbackEl.hidden = false;
  throw new Error("WebGL unavailable");
}

setProgress(12, "Creating the night sky…");

var reducedMotion = prefersReducedMotion();
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x05070f, 0.0038);

var camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 0, 28);

var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: false,
  powerPreference: "high-performance",
  alpha: false,
});
renderer.setPixelRatio(cappedPixelRatio());
renderer.setSize(window.innerWidth, window.innerHeight, false);

setProgress(28, "Placing the stars…");
var starfield = createStarfield({ reducedMotion: reducedMotion });
scene.add(starfield.object);

setProgress(45, "Lighting the sun…");
var solar = createSolarSystem({ reducedMotion: reducedMotion });
scene.add(solar.object);

setProgress(62, "Gathering nebula dust…");
var nebula = createNebula({ reducedMotion: reducedMotion });
scene.add(nebula.object);

setProgress(78, "Spinning the galaxy…");
var galaxy = createGalaxy({ reducedMotion: reducedMotion });
scene.add(galaxy.object);

setProgress(90, "Warming the engines…");

var updateCaptions = bindCaptions();

var pointer = { x: 0, y: 0, tx: 0, ty: 0 };

function onPointerMove(event) {
  if (reducedMotion) return;
  var clientX = event.touches ? event.touches[0].clientX : event.clientX;
  var clientY = event.touches ? event.touches[0].clientY : event.clientY;
  pointer.tx = (clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (clientY / window.innerHeight) * 2 - 1;
}

window.addEventListener("pointermove", onPointerMove, { passive: true });
window.addEventListener("touchmove", onPointerMove, { passive: true });

function scrollProgress() {
  var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(cappedPixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}

window.addEventListener("resize", onResize);

var clock = new THREE.Clock();
var camPos = new THREE.Vector3();
var camLook = new THREE.Vector3();

function tick() {
  var t = clock.getElapsedTime();
  var p = scrollProgress();

  sampleCameraPath(p, camPos, camLook);

  pointer.x += (pointer.tx - pointer.x) * 0.04;
  pointer.y += (pointer.ty - pointer.y) * 0.04;

  var parallax = reducedMotion ? 0 : 1;
  camera.position.x = camPos.x + pointer.x * 1.4 * parallax;
  camera.position.y = camPos.y - pointer.y * 1.0 * parallax;
  camera.position.z = camPos.z;
  camera.lookAt(
    camLook.x + pointer.x * 2 * parallax,
    camLook.y - pointer.y * 1.2 * parallax,
    camLook.z
  );

  if (hudEl) {
    hudEl.classList.toggle("is-fading", p > 0.06);
  }

  updateCaptions(p);

  // Soft visibility windows so scenes do not pile into one blob
  var sunVis = Math.min(segment(0.08, 0.18, p), 1 - segment(0.34, 0.44, p));
  var nebVis = Math.min(segment(0.34, 0.44, p), 1 - segment(0.58, 0.68, p));
  var galVis = Math.min(segment(0.58, 0.68, p), 1 - segment(0.86, 0.96, p));

  solar.object.visible = sunVis > 0.02;
  if (nebula.object.material) {
    nebula.object.material.opacity = 0.5 * nebVis;
    nebula.object.visible = nebVis > 0.02;
  }
  if (galaxy.object.material) {
    galaxy.object.material.opacity = 0.85 * galVis;
    galaxy.object.visible = galVis > 0.02;
  }

  starfield.update(t);
  solar.update(t);
  nebula.update(t);
  galaxy.update(t);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

setProgress(100, "Ready");
window.setTimeout(function () {
  if (loaderEl) loaderEl.classList.add("is-done");
  if (reducedMotion) {
    var note = document.getElementById("motion-note");
    if (note) {
      note.hidden = false;
      note.textContent = story.reducedMotionNote;
    }
  }
  tick();
}, 280);

window.__cosmos = {
  scene: scene,
  camera: camera,
  renderer: renderer,
  starfield: starfield,
  solar: solar,
  nebula: nebula,
  galaxy: galaxy,
  ambient: ambient,
  dispose: function () {
    starfield.dispose();
    solar.dispose();
    nebula.dispose();
    galaxy.dispose();
    ambient.dispose();
    renderer.dispose();
  },
};
