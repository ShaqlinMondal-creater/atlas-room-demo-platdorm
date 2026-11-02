/*
  Scene 3 — soft coloured particle cloud (nebula).
  Additive blending makes overlapping dots look like glowing gas.
*/
import * as THREE from "three";
import { particles } from "../config.js";
import { isMobile } from "../utils/device.js";

/**
 * @param {{ reducedMotion?: boolean }} options
 */
export function createNebula(options) {
  var reduced = !!(options && options.reducedMotion);
  var count = reduced
    ? 500
    : isMobile()
      ? particles.nebulaMobile
      : particles.nebulaDesktop;

  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var color = new THREE.Color();
  var i;

  for (i = 0; i < count; i += 1) {
    // Ellipsoid cloud stretched along X
    var rx = (Math.random() - 0.5) * 36;
    var ry = (Math.random() - 0.5) * 16;
    var rz = (Math.random() - 0.5) * 22;
    positions[i * 3] = rx;
    positions[i * 3 + 1] = ry;
    positions[i * 3 + 2] = rz;

    // Magenta → cyan palette
    var hue = 0.72 + Math.random() * 0.22;
    color.setHSL(hue, 0.55 + Math.random() * 0.3, 0.45 + Math.random() * 0.25);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: isMobile() ? 0.9 : 1.15,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  var points = new THREE.Points(geometry, material);
  points.name = "nebula";
  // Off the solar-system line of sight so Scene 2 stays clean
  points.position.set(18, 4, -95);

  return {
    object: points,
    update: function (timeSec) {
      if (reduced) return;
      points.rotation.y = timeSec * 0.04;
      points.rotation.z = Math.sin(timeSec * 0.2) * 0.08;
    },
    dispose: function () {
      geometry.dispose();
      material.dispose();
    },
  };
}
