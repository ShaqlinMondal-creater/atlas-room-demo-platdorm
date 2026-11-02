/*
  Scroll → camera position + look-at target.
  Waypoints are tuned so each scene fills the view in turn.
*/
import { scrollStops } from "../config.js";
import { lerpVec3, segment } from "./math.js";

var WAYPOINTS = [
  { at: scrollStops.start, pos: { x: 0, y: 0, z: 28 }, look: { x: 0, y: 0, z: -20 } },
  // High enough to see the full system; close enough to read moons / sats
  { at: scrollStops.sun, pos: { x: 0, y: 11, z: 2 }, look: { x: 0, y: -1, z: -40 } },
  { at: scrollStops.nebula, pos: { x: 8, y: 4, z: -74 }, look: { x: 22, y: 6, z: -98 } },
  { at: scrollStops.galaxy, pos: { x: 2, y: 42, z: -145 }, look: { x: 0, y: 0, z: -165 } },
  { at: scrollStops.finale, pos: { x: 0, y: 24, z: -152 }, look: { x: 0, y: 0, z: -168 } },
];

/**
 * Sample the camera path for scroll progress p (0→1).
 * Writes into posOut / lookOut (THREE.Vector3 or {x,y,z}).
 */
export function sampleCameraPath(p, posOut, lookOut) {
  var i;
  var a = WAYPOINTS[0];
  var b = WAYPOINTS[WAYPOINTS.length - 1];

  if (p <= a.at) {
    posOut.x = a.pos.x;
    posOut.y = a.pos.y;
    posOut.z = a.pos.z;
    lookOut.x = a.look.x;
    lookOut.y = a.look.y;
    lookOut.z = a.look.z;
    return;
  }

  if (p >= b.at) {
    posOut.x = b.pos.x;
    posOut.y = b.pos.y;
    posOut.z = b.pos.z;
    lookOut.x = b.look.x;
    lookOut.y = b.look.y;
    lookOut.z = b.look.z;
    return;
  }

  for (i = 0; i < WAYPOINTS.length - 1; i += 1) {
    a = WAYPOINTS[i];
    b = WAYPOINTS[i + 1];
    if (p >= a.at && p <= b.at) {
      var t = segment(a.at, b.at, p);
      lerpVec3(posOut, a.pos, b.pos, t);
      lerpVec3(lookOut, a.look, b.look, t);
      return;
    }
  }
}
