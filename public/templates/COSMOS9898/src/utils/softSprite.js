/*
  Soft circular glow map for THREE.Points (avoids hard square dots).
  Built once in a canvas — no external image files.
*/
import * as THREE from "three";

var cache = Object.create(null);

/**
 * @param {number} [size=64]
 * @returns {THREE.CanvasTexture}
 */
export function softSpriteTexture(size) {
  var key = String(size || 64);
  if (cache[key]) return cache[key];

  var s = size || 64;
  var canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  var ctx = canvas.getContext("2d");
  var half = s * 0.5;
  var grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.22, "rgba(255,255,255,0.85)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);

  var tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  cache[key] = tex;
  return tex;
}
