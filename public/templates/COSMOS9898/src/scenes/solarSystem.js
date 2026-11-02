/*
  Scene 2 — sun, planets, natural moons, artificial satellites.
  Lit spheres + soft corona; night sides stay faintly visible (no black voids).
*/
import * as THREE from "three";
import { isMobile } from "../utils/device.js";
import { softSpriteTexture } from "../utils/softSprite.js";

var PLANETS = [
  {
    name: "cinder",
    radius: 0.42,
    distance: 4.6,
    speed: 0.72,
    color: 0xb86a45,
    tilt: 0.08,
    moons: [],
    sats: 1,
  },
  {
    name: "ember",
    radius: 0.58,
    distance: 6.8,
    speed: 0.48,
    color: 0xc47a4a,
    tilt: 0.12,
    moons: [{ radius: 0.18, dist: 1.2, speed: 1.8, color: 0xb0a090 }],
    sats: 1,
  },
  {
    name: "azure",
    radius: 0.95,
    distance: 9.4,
    speed: 0.32,
    color: 0x4a7ec4,
    tilt: -0.14,
    moons: [
      { radius: 0.22, dist: 1.55, speed: 1.4, color: 0xd8d0c0 },
      { radius: 0.14, dist: 2.15, speed: 0.95, color: 0xa8b0b8 },
    ],
    sats: 2,
  },
  {
    name: "jade",
    radius: 0.78,
    distance: 12.2,
    speed: 0.24,
    color: 0x3fa88a,
    tilt: 0.18,
    moons: [{ radius: 0.2, dist: 1.4, speed: 1.25, color: 0xc8c4b0 }],
    sats: 1,
  },
  {
    name: "violet",
    radius: 1.2,
    distance: 15.4,
    speed: 0.16,
    color: 0x7a5ab8,
    tilt: 0.06,
    moons: [
      { radius: 0.28, dist: 1.9, speed: 1.05, color: 0xe0d8c8 },
      { radius: 0.16, dist: 2.55, speed: 0.7, color: 0x9aa0a8 },
      { radius: 0.12, dist: 3.15, speed: 0.55, color: 0x889090 },
    ],
    sats: 2,
  },
  {
    name: "ice",
    radius: 0.7,
    distance: 18.6,
    speed: 0.11,
    color: 0x7ab0c8,
    tilt: -0.1,
    moons: [{ radius: 0.16, dist: 1.3, speed: 1.1, color: 0xd0d8e0 }],
    sats: 1,
  },
];

function makeOrbitRing(radius, steps, opacity) {
  var pts = [];
  var i;
  for (i = 0; i <= steps; i += 1) {
    var a = (i / steps) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  var geo = new THREE.BufferGeometry().setFromPoints(pts);
  var mat = new THREE.LineBasicMaterial({
    color: 0x8aa0c0,
    transparent: true,
    opacity: opacity,
  });
  return { line: new THREE.LineLoop(geo, mat), geo: geo, mat: mat };
}

function makeSatMesh(size, disposables) {
  var geo = new THREE.BoxGeometry(size, size * 0.45, size * 0.7);
  var mat = new THREE.MeshStandardMaterial({
    color: 0xd0d8e8,
    roughness: 0.28,
    metalness: 0.85,
    emissive: 0x405060,
    emissiveIntensity: 0.25,
  });
  var body = new THREE.Mesh(geo, mat);
  disposables.push(geo, mat);

  // Tiny solar panel
  var panelGeo = new THREE.BoxGeometry(size * 2.2, size * 0.06, size * 0.55);
  var panelMat = new THREE.MeshStandardMaterial({
    color: 0x2a4a8a,
    roughness: 0.35,
    metalness: 0.6,
    emissive: 0x102040,
    emissiveIntensity: 0.2,
  });
  var panel = new THREE.Mesh(panelGeo, panelMat);
  body.add(panel);
  disposables.push(panelGeo, panelMat);
  return body;
}

/**
 * @param {{ reducedMotion?: boolean }} options
 */
export function createSolarSystem(options) {
  var reduced = !!(options && options.reducedMotion);
  var mobile = isMobile();
  var group = new THREE.Group();
  group.name = "solarSystem";
  group.position.set(0, 0, -40);

  var segs = mobile ? 18 : 32;
  var moonSegs = mobile ? 10 : 16;
  var ringSteps = mobile ? 48 : 72;
  var disposables = [];
  var orbits = [];
  var moonOrbits = [];
  var satOrbits = [];

  /* —— Sun —— */
  var sunGeo = new THREE.SphereGeometry(2.35, segs, segs);
  var sunMat = new THREE.MeshBasicMaterial({ color: 0xffe08a });
  var sun = new THREE.Mesh(sunGeo, sunMat);
  group.add(sun);
  disposables.push(sunGeo, sunMat);

  var glowGeo = new THREE.SphereGeometry(3.05, segs, segs);
  var glowMat = new THREE.MeshBasicMaterial({
    color: 0xffb040,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  var glow = new THREE.Mesh(glowGeo, glowMat);
  group.add(glow);
  disposables.push(glowGeo, glowMat);

  var haloMat = new THREE.SpriteMaterial({
    map: softSpriteTexture(128),
    color: 0xffc060,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  var halo = new THREE.Sprite(haloMat);
  halo.scale.set(13, 13, 1);
  group.add(halo);
  disposables.push(haloMat);

  var light = new THREE.PointLight(0xffe2b0, 5.5, 85, 1.15);
  sun.add(light);

  /* —— Planets + moons + sats —— */
  PLANETS.forEach(function (def, index) {
    var pivot = new THREE.Group();
    pivot.rotation.x = def.tilt;
    group.add(pivot);

    var geo = new THREE.SphereGeometry(def.radius, segs, segs);
    var mat = new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: 0.58,
      metalness: 0.1,
      emissive: def.color,
      // Enough fill that the night side never vanishes into pure black
      emissiveIntensity: 0.14,
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = def.distance;
    mesh.name = "planet-" + def.name;
    pivot.add(mesh);
    disposables.push(geo, mat);

    var ring = makeOrbitRing(def.distance, ringSteps, 0.3);
    pivot.add(ring.line);
    disposables.push(ring.geo, ring.mat);

    orbits.push({
      pivot: pivot,
      mesh: mesh,
      speed: def.speed,
      phase: index * 0.95,
    });

    // Natural satellites (moons)
    def.moons.forEach(function (moonDef, mi) {
      var moonPivot = new THREE.Group();
      mesh.add(moonPivot);

      var mGeo = new THREE.SphereGeometry(moonDef.radius, moonSegs, moonSegs);
      var mMat = new THREE.MeshStandardMaterial({
        color: moonDef.color,
        roughness: 0.78,
        metalness: 0.05,
        emissive: moonDef.color,
        emissiveIntensity: 0.12,
      });
      var moon = new THREE.Mesh(mGeo, mMat);
      moon.position.x = moonDef.dist;
      moonPivot.add(moon);
      disposables.push(mGeo, mMat);

      var mRing = makeOrbitRing(moonDef.dist, mobile ? 28 : 40, 0.18);
      moonPivot.add(mRing.line);
      disposables.push(mRing.geo, mRing.mat);

      moonOrbits.push({
        pivot: moonPivot,
        speed: moonDef.speed,
        phase: index * 0.7 + mi * 1.3,
      });
    });

    // Artificial satellites (boxes + panels)
    var satCount = mobile ? Math.min(1, def.sats) : def.sats;
    var s;
    for (s = 0; s < satCount; s += 1) {
      var satPivot = new THREE.Group();
      // Slight incline so sats aren't flat on the ecliptic
      satPivot.rotation.z = 0.35 + s * 0.4;
      satPivot.rotation.x = 0.2 - s * 0.15;
      mesh.add(satPivot);

      var sat = makeSatMesh(Math.max(0.14, def.radius * 0.28), disposables);
      var satDist = def.radius + 0.75 + s * 0.45;
      sat.position.x = satDist;
      satPivot.add(sat);

      satOrbits.push({
        pivot: satPivot,
        mesh: sat,
        speed: 2.2 + s * 0.6 + index * 0.1,
        phase: index + s * 2.1,
      });
    }
  });

  // Soft fill so backs of planets stay readable against space
  var fill = new THREE.AmbientLight(0x3a4a68, 0.62);
  group.add(fill);
  var hemi = new THREE.HemisphereLight(0xb0c8ff, 0x1c1428, 0.55);
  group.add(hemi);
  // Gentle rim from “behind” the camera side of the system
  var rim = new THREE.DirectionalLight(0x6a80b0, 0.35);
  rim.position.set(-8, 10, 18);
  group.add(rim);

  return {
    object: group,
    update: function (timeSec) {
      if (!reduced) {
        sun.rotation.y = timeSec * 0.08;
        glow.scale.setScalar(1 + Math.sin(timeSec * 1.4) * 0.04);
        halo.material.opacity = 0.72 + Math.sin(timeSec * 1.2) * 0.08;
      }

      orbits.forEach(function (orb) {
        var speed = reduced ? orb.speed * 0.25 : orb.speed;
        orb.pivot.rotation.y = timeSec * speed + orb.phase;
        orb.mesh.rotation.y = timeSec * 0.55;
      });

      moonOrbits.forEach(function (orb) {
        var speed = reduced ? orb.speed * 0.25 : orb.speed;
        orb.pivot.rotation.y = timeSec * speed + orb.phase;
      });

      satOrbits.forEach(function (orb) {
        var speed = reduced ? orb.speed * 0.3 : orb.speed;
        orb.pivot.rotation.y = timeSec * speed + orb.phase;
        if (orb.mesh) orb.mesh.rotation.y = timeSec * 1.4;
      });
    },
    dispose: function () {
      disposables.forEach(function (item) {
        item.dispose();
      });
    },
  };
}
