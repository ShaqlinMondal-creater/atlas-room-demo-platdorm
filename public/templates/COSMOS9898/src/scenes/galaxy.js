/*
  Scene 4 — luminous spiral galaxy.
  Layers: bright core + spiral arms + soft halo, all soft additive sprites.
*/
import * as THREE from "three";
import { particles } from "../config.js";
import { isMobile } from "../utils/device.js";
import { softSpriteTexture } from "../utils/softSprite.js";

function makeCloud(count, placeFn, size, opacity) {
  var positions = new Float32Array(count * 3);
  var colors = new Float32Array(count * 3);
  var color = new THREE.Color();
  var i;

  for (i = 0; i < count; i += 1) {
    var placed = placeFn(i, count, color);
    positions[i * 3] = placed.x;
    positions[i * 3 + 1] = placed.y;
    positions[i * 3 + 2] = placed.z;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: size,
    map: softSpriteTexture(64),
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return {
    points: new THREE.Points(geometry, material),
    geometry: geometry,
    material: material,
  };
}

/**
 * @param {{ reducedMotion?: boolean }} options
 */
export function createGalaxy(options) {
  var reduced = !!(options && options.reducedMotion);
  var mobile = isMobile();
  var armCount = reduced
    ? 1400
    : mobile
      ? particles.galaxyMobile
      : particles.galaxyDesktop;
  var coreCount = reduced ? 400 : mobile ? 900 : 1800;
  var haloCount = reduced ? 200 : mobile ? 500 : 900;
  var arms = 4;
  var maxR = 32;

  var group = new THREE.Group();
  group.name = "galaxy";
  group.position.set(0, 0, -165);
  // Slight tilt so the disc has depth without going edge-on
  group.rotation.x = -0.35;
  group.rotation.z = 0.15;

  var baseOpacity = { arms: 0.9, core: 1, halo: 0.35 };
  var layers = [];

  var armsLayer = makeCloud(
    armCount,
    function (i, count, color) {
      var arm = i % arms;
      var radius = Math.pow(Math.random(), 0.48) * maxR;
      var spin = radius * 0.62;
      var angle =
        (arm / arms) * Math.PI * 2 + spin + (Math.random() - 0.5) * 0.12;
      var spread = (Math.random() - 0.5) * (0.4 + radius * 0.022);
      var t = radius / maxR;
      // Outer arms cooler cyan; inner warmer
      color.setHSL(
        0.52 - t * 0.08,
        0.6 + (1 - t) * 0.25,
        0.42 + (1 - t) * 0.32
      );
      color.multiplyScalar(0.85 + (1 - t) * 0.4);
      return {
        x: Math.cos(angle) * radius + Math.cos(angle + 1.1) * spread,
        y: (Math.random() - 0.5) * (0.8 + (1 - t) * 1.4),
        z: Math.sin(angle) * radius + Math.sin(angle + 1.1) * spread,
      };
    },
    mobile ? 0.45 : 0.58,
    baseOpacity.arms
  );
  armsLayer.points.name = "galaxyArms";
  group.add(armsLayer.points);
  layers.push({ material: armsLayer.material, base: baseOpacity.arms, geometry: armsLayer.geometry });

  var coreLayer = makeCloud(
    coreCount,
    function (_i, _count, color) {
      var radius = Math.pow(Math.random(), 1.8) * 6.5;
      var angle = Math.random() * Math.PI * 2;
      var t = radius / 6.5;
      // Hot luminous core — peach / gold (feeds bloom without washing arms)
      color.setHSL(0.09 + t * 0.04, 0.65 - t * 0.2, 0.62 + (1 - t) * 0.22);
      color.multiplyScalar(1.25 + (1 - t) * 0.85);
      return {
        x: Math.cos(angle) * radius * (0.7 + Math.random() * 0.4),
        y: (Math.random() - 0.5) * (1.2 + (1 - t) * 1.8),
        z: Math.sin(angle) * radius * (0.7 + Math.random() * 0.4),
      };
    },
    mobile ? 0.85 : 1.1,
    baseOpacity.core
  );
  coreLayer.points.name = "galaxyCore";
  group.add(coreLayer.points);
  layers.push({ material: coreLayer.material, base: baseOpacity.core, geometry: coreLayer.geometry });

  var haloLayer = makeCloud(
    haloCount,
    function (_i, _count, color) {
      var radius = 4 + Math.pow(Math.random(), 0.7) * 22;
      var angle = Math.random() * Math.PI * 2;
      color.setHSL(0.62, 0.35, 0.55);
      color.multiplyScalar(0.55);
      return {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 3.5,
        z: Math.sin(angle) * radius,
      };
    },
    mobile ? 1.6 : 2.2,
    baseOpacity.halo
  );
  haloLayer.points.name = "galaxyHalo";
  group.add(haloLayer.points);
  layers.push({ material: haloLayer.material, base: baseOpacity.halo, geometry: haloLayer.geometry });

  // Soft emissive disc at the very centre for extra bloom fuel
  var discGeo = new THREE.SphereGeometry(2.2, 16, 16);
  var discMat = new THREE.MeshBasicMaterial({
    color: 0xffd090,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  var disc = new THREE.Mesh(discGeo, discMat);
  disc.name = "galaxyDisc";
  group.add(disc);

  // Point light so nearby dust reads as lit (helps bloom + atmosphere)
  var coreLight = new THREE.PointLight(0xffd9a0, 2.8, 55, 2);
  group.add(coreLight);

  return {
    object: group,
    setVisibility: function (amount) {
      var a = Math.max(0, Math.min(1, amount));
      group.visible = a > 0.02;
      layers.forEach(function (layer) {
        layer.material.opacity = layer.base * a;
      });
      discMat.opacity = 0.4 * a;
      coreLight.intensity = 3.4 * a;
    },
    update: function (timeSec) {
      if (reduced) return;
      group.rotation.z = timeSec * 0.028;
      disc.scale.setScalar(1 + Math.sin(timeSec * 1.1) * 0.06);
    },
    dispose: function () {
      layers.forEach(function (layer) {
        layer.geometry.dispose();
        layer.material.dispose();
      });
      discGeo.dispose();
      discMat.dispose();
    },
  };
}
