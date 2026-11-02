/*
  Optional ambient drone — generated in the browser (no audio files).
  Starts OFF. Must be toggled by a user click (browser autoplay rules).
*/
import { story } from "../config.js";

export function createAmbientToggle(button) {
  var ctx = null;
  var master = null;
  var nodes = [];
  var enabled = false;

  function setLabel() {
    if (!button) return;
    button.textContent = enabled ? story.audioOn : story.audioOff;
    button.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function ensureGraph() {
    if (ctx) return;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Two soft detuned sines + a filtered noise-ish feel via another sine
    var freqs = [55, 82.5, 110];
    freqs.forEach(function (freq, index) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = index === 2 ? "triangle" : "sine";
      osc.frequency.value = freq;
      gain.gain.value = index === 0 ? 0.045 : 0.028;
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      nodes.push(osc, gain);
    });
  }

  function setEnabled(next) {
    ensureGraph();
    if (!ctx || !master) return;

    enabled = next;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.linearRampToValueAtTime(enabled ? 0.9 : 0, now + 0.35);
    setLabel();
  }

  function toggle() {
    setEnabled(!enabled);
  }

  if (button) {
    button.addEventListener("click", toggle);
    setLabel();
  }

  return {
    toggle: toggle,
    setEnabled: setEnabled,
    isEnabled: function () {
      return enabled;
    },
    dispose: function () {
      nodes.forEach(function (node) {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (err) {
          /* already stopped */
        }
      });
      nodes = [];
      if (ctx) {
        ctx.close();
        ctx = null;
      }
    },
  };
}
