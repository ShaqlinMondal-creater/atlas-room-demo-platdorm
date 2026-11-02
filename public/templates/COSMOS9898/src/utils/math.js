/*
  Small math helpers for scroll camera motion.
*/

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Smoothstep ease between 0 and 1 */
export function smoothstep(t) {
  var x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Map global scroll progress to a 0→1 blend inside a window.
 * Example: segment(0.2, 0.4, p) is 0 before 0.2, 1 after 0.4.
 */
export function segment(from, to, p) {
  if (to <= from) return p >= to ? 1 : 0;
  return smoothstep((p - from) / (to - from));
}

/** Linear interpolate */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Interpolate Vector3-like objects {x,y,z} */
export function lerpVec3(out, a, b, t) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
  return out;
}
