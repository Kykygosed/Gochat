import { AVATAR_COLORS, TEXT_FONTS, TEXT_COLORS } from "./constants.js";
import * as State from "./state.js";

// ─── Escape ──────────────────────────────────────────────────────────────────
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\n/g, "<br/>");
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function pseudoColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initials(name) { return (name || "??").slice(0, 2).toUpperCase(); }

export function avatarHTML(name, size = 34, photoUrl = null, clickable = true) {
  if (photoUrl)
    return `<div class="avatar" data-pseudo="${escapeHtml(name)}" style="width:${size}px;height:${size}px;padding:0;overflow:hidden"><img src="${photoUrl}" alt="${escapeHtml(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/></div>`;
  const c = pseudoColor(name);
  return `<div class="avatar" data-pseudo="${escapeHtml(name)}" style="background:${c};width:${size}px;height:${size}px;font-size:${size * .3}px">${initials(name)}</div>`;
}

export function getProfilePhoto(pseudo) {
  if (pseudo === State.myPseudo && State.myProfilePhoto) return State.myProfilePhoto;
  const u = State.onlineUsersCache[pseudo] || State.registeredUsersCache[pseudo];
  return u && u.photo ? u.photo : null;
}

// ─── Time ────────────────────────────────────────────────────────────────────
export function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function fmtDateLabel(ts) {
  const d = new Date(ts), today = new Date(), y = new Date(today);
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === y.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

// ─── Theme ───────────────────────────────────────────────────────────────────
export function applyTheme(t) {
  State.setTheme(t);
  localStorage.setItem("kychat_theme", t);
  document.documentElement.setAttribute("data-theme", t);
  const sun  = document.getElementById("theme-icon-sun");
  const moon = document.getElementById("theme-icon-moon");
  if (sun && moon) {
    sun.style.display  = t === "light" ? "block" : "none";
    moon.style.display = t === "dark"  ? "block" : "none";
  }
}

// ─── Text preferences ────────────────────────────────────────────────────────
export let textPrefs = JSON.parse(localStorage.getItem("kychat_text_prefs") || "null")
  || { font: "default", color: "default", size: 92 };

export function applyTextPrefs() {
  document.documentElement.style.setProperty("--msg-font", TEXT_FONTS[textPrefs.font] || TEXT_FONTS.default);
  document.documentElement.style.setProperty("--msg-size", (textPrefs.size / 100) + "rem");
  const c = TEXT_COLORS[textPrefs.color];
  if (c) document.documentElement.style.setProperty("--msg-color-override", c);
  else   document.documentElement.style.removeProperty("--msg-color-override");
}

// ─── Scroll helpers ──────────────────────────────────────────────────────────
export function isAtBottom() {
  const w = document.getElementById("messages-wrap");
  return w.scrollHeight - w.scrollTop - w.clientHeight < 160;
}

export function scrollBottom(force = false) {
  const w = document.getElementById("messages-wrap");
  if (force || isAtBottom()) {
    w.scrollTop = w.scrollHeight;
    State.setUnreadWhileScrolled(0);
    updateScrollFab();
  }
}

export function updateScrollFab() {
  const scrollFab = document.getElementById("scroll-fab");
  const atBottom  = isAtBottom();
  scrollFab.classList.toggle("visible", !atBottom);
  let fabUnread = scrollFab.querySelector(".fab-unread");
  if (State.unreadWhileScrolled > 0 && !atBottom) {
    if (!fabUnread) { fabUnread = document.createElement("div"); fabUnread.className = "fab-unread"; scrollFab.appendChild(fabUnread); }
    fabUnread.textContent = State.unreadWhileScrolled > 9 ? "9+" : State.unreadWhileScrolled;
  } else if (fabUnread) { fabUnread.remove(); }
}

// ─── Misc ────────────────────────────────────────────────────────────────────
export function hexToRgba(hex, alpha) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(124,58,237,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function readImageAsDataUrl(file, maxBytes, cb) {
  if (file.size > maxBytes) { alert("Image trop grande"); return; }
  const reader = new FileReader();
  reader.onload = e => cb(e.target.result);
  reader.readAsDataURL(file);
}

export function isExpired(rec) { return rec.until && Date.now() > rec.until; }
