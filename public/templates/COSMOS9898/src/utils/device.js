/*
  Device helpers — keep the main scene light on phones.
*/

/** True when the viewport looks like a phone / small tablet. */
export function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches || navigator.maxTouchPoints > 1;
}

/**
 * Cap devicePixelRatio at 2 so we do not draw 3× pixels on retina phones.
 * That alone saves a lot of GPU work.
 */
export function cappedPixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 2);
}
