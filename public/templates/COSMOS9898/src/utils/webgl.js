/*
  Check if this browser can run WebGL before we create a Three.js renderer.
*/

export function canUseWebGL() {
  try {
    var canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (err) {
    return false;
  }
}
