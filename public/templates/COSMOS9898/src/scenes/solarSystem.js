/*
  Scene 2 — glowing sun + a few planets on simple orbits.
  No image textures: colours only (fast + license-safe).
*/
import * as THREE from "three";
import { isMobile } from "../utils/device.js";

var PLANETS = [
  { name: "ember", radius: 0.55, distance: 5.5, speed: 0.55, color: 0xc47a4a, tilt: 0.1 },
  { name: "azure", radius: 0.85, distance: 8.5, speed: 0.32, color: 0x4a7ec4, tilt: -0.15 },
  { name: "jade", radius: 0.7, distance: 11.5, speed: 0.22, color: 0x3fa88a, tilt: 0.2 },
  { name: "violet", radius: 1.1, distance: 15, speed: 0.14, color: 0x7a5ab8, tilt: 0.05 },
];

/**
 * @param {{ reducedMotion?: boolean }} options
 */
export function createSolarSystem(options) {
  var reduced = !!(options && options.reducedMotion);
  var group = new THREE.Group();
  group.name = "solarSystem";
  group.position.set(0, 0, -40);

  var segs = isMobile() ? 16 : 28;
  var disposables = [];
  var orbits = [];

  var sunGeo = new THREE.SphereGeometry(2.4, segs, segs);
  var sunMat = new THREE.MeshBasicMaterial({ color: 0xffc266 });
  var sun = new THREE.Mesh(sunGeo, sunMat);
  group.add(sun);
  disposables.push(sunGeo, sunMat);

  var glowGeo = new THREE.SphereGeometry(3.2, segs, segs);
  var glowMat = new THREE.MeshBasicMaterial({
    color: 0xffaa44,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  group.add(glow);
  disposables.push(glowGeo, glowMat);

  var sunLightColor = 0xffddaa;
  var light = new THREE.PointLight(sunLightColor, 1.4, 48, 2);
  sun.add(light);

  PLANETS.forEach(function (def, index) {
    var pivot = new THREE.Group();
    pivot.rotation.x = def.tilt;
    group.add(pivot);

    var geo = new THREE.SphereGeometry(def.radius, segs, segs);
    var mat = new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: 0.72,
      metalness: 0.08,
      emissive: def.color,
      emissiveIntensity: 0.08,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = def.distance;
    pivot.add(mesh);
    disposables.push(geo, mat);

    var ringPts = [];
    var steps = isMobile() ? 48 : 72;
    var r;
    for (r = 0; r <= steps; r += 1) {
      var a = (r / steps) * Math.PI * 2;
      ringPts.push(
        new THREE.Vector3(
          Math.cos(a) * def.distance,
          0,
          Math.sin(a) * def.distance
        )
      );
    }
    var ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    var ringMat = new THREE.LineBasicMaterial({
      color: 0x6a7a9a,
      transparent: true,
      opacity: 0.28,
    });
    var ring = new THREE.LineLoop(ringGeo, ringMat);
    pivot.add(ring);
    disposables.push(ringGeo, ringMat);

    orbits.push({
      pivot: pivot,
      mesh: mesh,
      speed: def.speed,
      phase: index * 1.2,
    });
  });

  var fill = new THREE.AmbientLight(0x304060, 0.35);
  group.add(fill);

  return {
    object: group,
    update: function (timeSec) {
      if (!reduced) {
        sun.rotation.y = timeSec * 0.08;
        glow.scale.setScalar(1 + Math.sin(timeSec * 1.4) * 0.03);
      }
      orbits.forEach(function (orb) {
        var speed = reduced ? orb.speed * 0.25 : orb.speed;
        orb.pivot.rotation.y = timeSec * speed + orb.phase;
        orb.mesh.rotation.y = timeSec * 0.6;
      });
    },
    dispose: function () {
      disposables.forEach(function (item) {
        item.dispose();
      });
    },
  };
}
