/*
  Scene 4 — spiral galaxy from particles.
  Each star gets an angle + radius; we place it on a logarithmic-ish arm.
*/
import * as THREE from "three";
import { particles } from "../config.js";
import { isMobile } from "../utils/device.js";

/**
 * @param {{ reducedMotion?: boolean }} options
 */
export function createGalaxy(options) {
  var reduced = !!(options && options.reducedMotion);
  var count = reduced
    ? 1200
    : isMobile()
      ? particles.galaxyMobile
      : particles.galaxyDesktop;

  var arms = 3;
  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var color = new THREE.Color();
  var i;

  for (i = 0; i < count; i += 1) {
    var arm = i % arms;
    var radius = Math.pow(Math.random(), 0.65) * 28;
    var spin = radius * 0.45;
    var angle = (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.35;
    var spread = (Math.random() - 0.5) * (1.2 + radius * 0.04);

    var x = Math.cos(angle) * radius + Math.cos(angle + 1.2) * spread;
    var z = Math.sin(angle) * radius + Math.sin(angle + 1.2) * spread;
    var y = (Math.random() - 0.5) * (1.8 + (1 - radius / 28) * 2.5);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Core warmer, arms cooler
    var t = radius / 28;
    color.setHSL(0.58 - t * 0.15, 0.35 + (1 - t) * 0.35, 0.55 + (1 - t) * 0.25);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: isMobile() ? 0.55 : 0.7,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  var points = new THREE.Points(geometry, material);
  points.name = "galaxy";
  points.position.set(0, 0, -165);
  points.rotation.x = -0.55;

  return {
    object: points,
    update: function (timeSec) {
      if (reduced) return;
      points.rotation.z = timeSec * 0.035;
    },
    dispose: function () {
      geometry.dispose();
      material.dispose();
    },
  };
}
