/*
  Shared access tokens for template previews.
  TTL and storage key come from src/config/constants.js
*/

import { ACCESS } from "../config/constants";
import { normalizeCode } from "../data/templates";

export const ACCESS_TTL_MS = ACCESS.ttlMinutes * 60 * 1000;
const STORAGE_KEY = ACCESS.storageKey;

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function makeToken() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export function issueAccessToken(code) {
  const clean = normalizeCode(code);
  const token = makeToken();
  const expiresAt = Date.now() + ACCESS_TTL_MS;
  const map = readAll();
  map[clean] = { token, expiresAt };
  writeAll(map);
  return { code: clean, token, expiresAt };
}

export function validateAccessToken(code, token) {
  const clean = normalizeCode(code);
  const given = String(token || "").trim();
  if (!clean || !given) return { ok: false, reason: "missing" };

  const entry = readAll()[clean];
  if (!entry || entry.token !== given) {
    return { ok: false, reason: "invalid" };
  }

  if (Date.now() > Number(entry.expiresAt)) {
    return { ok: false, reason: "expired" };
  }

  return {
    ok: true,
    expiresAt: Number(entry.expiresAt),
    remainingMs: Number(entry.expiresAt) - Date.now(),
  };
}

export function hasActiveAccess(code) {
  const clean = normalizeCode(code);
  const entry = readAll()[clean];
  if (!entry) return false;
  return Date.now() <= Number(entry.expiresAt);
}

export function listActiveAccess() {
  const now = Date.now();
  return Object.entries(readAll())
    .filter(([, entry]) => entry && now <= Number(entry.expiresAt))
    .map(([code, entry]) => ({
      code,
      token: entry.token,
      expiresAt: Number(entry.expiresAt),
      remainingMs: Number(entry.expiresAt) - now,
    }))
    .sort((a, b) => a.expiresAt - b.expiresAt);
}

export function buildViewUrl(code, token) {
  const clean = normalizeCode(code);
  return `/view/${encodeURIComponent(clean)}?token=${encodeURIComponent(token)}`;
}

