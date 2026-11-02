/*
  Universe Cosmos — Scene 1 boot.
  Scroll moves the camera a little; later scenes will add more stops.
*/
import * as THREE from "three";
import { story } from "./config.js";
import { createStarfield } from "./scenes/starfield.js";
import { cappedPixelRatio } from "./utils/device.js";
import { prefersReducedMotion } from "./utils/motion.js";
import { canUseWebGL } from "./utils/webgl.js";

var loaderEl = document.getElementById("loader");
var loaderBar = document.getElementById("loader-bar");
var loaderLabel = document.getElementById("loader-label");
var fallbackEl = document.getElementById("fallback");
var hudEl = document.getElementById("hud");
var canvas = document.getElementById("webgl");

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
}

fillCopy();

if (!canUseWebGL()) {
  if (loaderEl) loaderEl.classList.add("is-done");
  if (fallbackEl) fallbackEl.hidden = false;
  throw new Error("WebGL unavailable");
}

setProgress(20, "Creating the night sky…");

var reducedMotion = prefersReducedMotion();
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070f);
scene.fog = new THREE.FogExp2(0x05070f, 0.0045);

var camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  400
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

setProgress(55, "Placing the stars…");

var starfield = createStarfield({ reducedMotion: reducedMotion });
scene.add(starfield.object);

setProgress(85, "Warming the engines…");

/* Pointer / touch parallax — gentle only */
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
var camBase = new THREE.Vector3(0, 0, 28);

function tick() {
  var t = clock.getElapsedTime();
  var p = scrollProgress();

  // Scene 1 camera: ease forward a little as the visitor scrolls
  var ease = p * p * (3 - 2 * p);
  camBase.set(0, 0, 28 - ease * 18);

  pointer.x += (pointer.tx - pointer.x) * 0.04;
  pointer.y += (pointer.ty - pointer.y) * 0.04;

  camera.position.x = camBase.x + pointer.x * 1.4;
  camera.position.y = camBase.y - pointer.y * 1.0;
  camera.position.z = camBase.z;
  camera.lookAt(pointer.x * 2, -pointer.y * 1.2, camBase.z - 40);

  if (hudEl) {
    hudEl.classList.toggle("is-fading", p > 0.08);
  }

  starfield.update(t);
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

/*
  Later scenes will register more objects here.
  Keep dispose() calls when removing geometries / materials.
*/
window.__cosmos = {
  scene: scene,
  camera: camera,
  renderer: renderer,
  starfield: starfield,
};
