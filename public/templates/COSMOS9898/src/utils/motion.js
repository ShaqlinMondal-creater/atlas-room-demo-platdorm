/*
  Respect the visitor's "reduce motion" setting (OS / browser).
*/

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
