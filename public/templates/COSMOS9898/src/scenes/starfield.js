/*
  Scene 1 — dark starfield made of Points (tiny dots in 3D space).

  Three.js idea in plain English:
  - A BufferGeometry holds many xyz positions in one GPU buffer.
  - PointsMaterial draws each position as a small glowing dot.
  - Points is the object we add to the scene.
*/
import * as THREE from "three";
import { particles } from "../config.js";
import { isMobile } from "../utils/device.js";
import { softSpriteTexture } from "../utils/softSprite.js";

/**
 * Build the starfield and return it so main.js can add / dispose it later.
 * @param {object} options
 * @param {boolean} options.reducedMotion  fewer stars, no twinkle
 */
export function createStarfield(options) {
  var reduced = !!(options && options.reducedMotion);
  var count = reduced
    ? 900
    : isMobile()
      ? particles.starfieldMobile
      : particles.starfieldDesktop;

  // One flat array: x,y,z,x,y,z… for every star
  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var i;
  var color = new THREE.Color();

  for (i = 0; i < count; i += 1) {
    // Spread stars in a large box, but keep a clear tunnel along the voyage
    // so sizeAttenuation never turns nearby dots into giant squares.
    var x;
    var y;
    var z;
    var tries = 0;
    do {
      x = (Math.random() - 0.5) * 240;
      y = (Math.random() - 0.5) * 160;
      z = (Math.random() - 0.5) * 280 - 40;
      tries += 1;
      // Corridor roughly matching cameraPath waypoints (z from ~28 → -175)
    } while (tries < 12 && Math.abs(x) < 12 && Math.abs(y) < 10 && z < 40 && z > -190);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Mostly cool white-blue, a few warmer dots
    if (Math.random() > 0.92) {
      color.setHSL(0.08, 0.55, 0.75);
    } else {
      color.setHSL(0.6, 0.15 + Math.random() * 0.25, 0.7 + Math.random() * 0.25);
    }
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: isMobile() ? 0.5 : 0.65,
    map: softSpriteTexture(64),
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  var points = new THREE.Points(geometry, material);
  points.name = "starfield";

  return {
    object: points,
    /** Gentle drift — skipped when reduced motion is on */
    update: function (timeSec) {
      if (reduced) return;
      points.rotation.y = timeSec * 0.012;
      points.rotation.x = Math.sin(timeSec * 0.05) * 0.02;
    },
    /** Free GPU memory when we leave this scene forever */
    dispose: function () {
      geometry.dispose();
      material.dispose();
    },
  };
}
