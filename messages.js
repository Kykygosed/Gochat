import { MSGS_REF, ref, db, push, update, onValue, query, orderByKey, limitToLast } from "./firebase.js";
import * as State from "./state.js";
import { escapeHtml, fmtTime, fmtDateLabel, isAtBottom, scrollBottom, updateScrollFab } from "./ui-helpers.js";
import { levelBadgeHTML, incrementMsgCount } from "./xp.js";
import { roleTagsHTML } from "./roles.js";
import { avatarHTML, getProfilePhoto } from "./ui-helpers.js";
import { getAllKnownPseudos } from "./users.js";
import { buildReactionsRow } from "./reactions.js";

const msgsWrap = document.getElementById("messages-wrap");

// ─── Linkify @mentions ───────────────────────────────────────────────────────
export function linkifyMentions(escapedText, knownPseudos) {
  return escapedText.replace(/(^|[\s(>])@([\w\-.éàèùâêîôûçœ]+)/gi, (whole, pre, name) => {
    const lowerName = name.toLowerCase();
    const isEveryone = lowerName === "everyone";
    const matchedPseudo = isEveryone ? "everyone" : knownPseudos.find(p => p.toLowerCase() === lowerName);
    if (!matchedPseudo) return whole;
    const isMe = !isEveryone && State.myPseudo && matchedPseudo.toLowerCase() === State.myPseudo.toLowerCase();
    const meClass = (isMe || isEveryone) ? " mention-me" : "";
    return `${pre}<span class="msg-mention${meClass}">@${escapeHtml(matchedPseudo)}</span>`;
  });
}

export function extractMentionedPseudos(text) {
  if (!text) return [];
  const known = getAllKnownPseudos();
  const found = new Set();
  const re = /(^|\s)@([\w\-.éàèùâêîôûçœ]+)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const lower = m[2].toLowerCase();
    if (lower === "everyone") { found.add("everyone"); continue; }
    const matched = known.find(p => p.toLowerCase() === lower);
    if (matched) found.add(matched);
  }
  return Array.from(found);
}

// ─── Scroll to message ───────────────────────────────────────────────────────
export function scrollToMsg(key) {
  if (!key) return;
  const el = msgsWrap.querySelector(`[data-key="${key}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("highlighted");
  setTimeout(() => el.classList.remove("highlighted"), 900);
}

// ─── Render single message ───────────────────────────────────────────────────
export function renderMsg(key, data, scrollForce = false) {
  if (State.shownKeys.has(key)) return;
  State.shownKeys.add(key);

  const ts = data.ts || Date.now();
  const dateLabel = fmtDateLabel(ts);
  if (dateLabel !== State.lastDateLabel) {
    State.setLastDateLabel(dateLabel);
    const sep = document.createElement("div");
    sep.className = "date-sep";
    sep.innerHTML = `<span>${dateLabel}</span>`;
    msgsWrap.appendChild(sep);
  }

  if (data.type === "system" || data.type === "system_html") {
    const d = document.createElement("div");
    d.dataset.key = key;
    d.className = "sys-msg" + (data.warn ? " warn-msg" : "") + (data.type === "system_html" ? " cmd-msg" : "");
    if (data.type === "system_html") d.innerHTML = data.html || "";
    else d.textContent = data.text;
    msgsWrap.appendChild(d);
    if (!isAtBottom()) { State.setUnreadWhileScrolled(State.unreadWhileScrolled + 1); updateScrollFab(); }
    scrollBottom(scrollForce);
    return;
  }

  const isMe = data.pseudo === State.myPseudo;
  const row  = document.createElement("div");
  row.className    = `msg-row ${isMe ? "me" : ""}`;
  row.dataset.key  = key;
  row.dataset.pseudo = data.pseudo || "";

  const isDeleted = !!data.deleted;
  const knownPseudos = getAllKnownPseudos();
  let contentHTML = "", bubbleExtraClass = "";

  if (isDeleted) {
    contentHTML = "Message supprimé"; bubbleExtraClass = "deleted-bubble";
  } else if (data.type === "image" && data.dataUrl) {
    contentHTML = `<img class="msg-img" src="${data.dataUrl}" alt="image" loading="lazy"/>`;
  } else if (data.type === "gif" && data.dataUrl) {
    contentHTML = `<img class="msg-gif" src="${data.dataUrl}" alt="GIF" loading="lazy"/>`;
  } else if (data.type === "sticker" && data.dataUrl) {
    bubbleExtraClass = "sticker-bubble";
    contentHTML = `<img class="msg-sticker" src="${data.dataUrl}" alt="${escapeHtml(data.name || 'sticker')}" loading="lazy"/>`;
  } else {
    contentHTML = linkifyMentions(escapeHtml(data.text || ""), knownPseudos);
    bubbleExtraClass = "text-msg";
  }

  let replyHTML = "";
  if (data.replyTo && !isDeleted) {
    const rp = data.replyTo;
    replyHTML = `<div class="reply-preview" data-replykey="${rp.key || ''}"><div class="rp-name">${escapeHtml(rp.pseudo || "")}</div><div class="rp-text">${rp.text ? escapeHtml(rp.text).slice(0, 80) : "[media]"}</div></div>`;
  }

  const actionsHTML = `
    ${!isDeleted ? `<button class="react-action-btn" title="Réagir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>` : ""}
    ${!isDeleted && !isMe ? `<button class="dm-action-btn" title="Message privé"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></button>` : ""}
    ${!isDeleted ? `<button class="reply-action-btn" title="Répondre"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg></button>` : ""}
    ${State.isAdmin && !isDeleted ? `<button class="admin-action-btn" title="Supprimer (admin)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>` : ""}`;

  row.innerHTML = `
    ${avatarHTML(data.pseudo, 34, getProfilePhoto(data.pseudo))}
    <div class="bubble-group">
      <div class="bubble-meta">
        <span class="meta-name">${escapeHtml(data.pseudo)}</span>
        ${data.pseudo !== "Système" ? levelBadgeHTML(data.pseudo) : ""}
        <span class="msg-roles-row">${roleTagsHTML(data.pseudo)}</span>
        <span class="meta-time">${fmtTime(ts)}</span>
      </div>
      ${replyHTML}
      <div class="bubble ${isMe ? "me" : "other"} ${bubbleExtraClass}" style="position:relative">${contentHTML}</div>
    </div>
    <div class="msg-actions">${actionsHTML}</div>`;

  // Lightbox for images
  row.querySelectorAll(".msg-img,.msg-gif,.msg-sticker").forEach(img => {
    img.addEventListener("click", () => {
      const lb = document.getElementById("lightbox");
      document.getElementById("lightbox-img").src = img.src;
      lb.classList.add("open");
    });
  });

  const replyBtn   = row.querySelector(".reply-action-btn");
  const dmBtn      = row.querySelector(".dm-action-btn");
  const adminDelBtn= row.querySelector(".admin-action-btn");
  const rpPreview  = row.querySelector(".reply-preview");
  const reactBtn   = row.querySelector(".react-action-btn");

  if (replyBtn) replyBtn.addEventListener("click", () => {
    const txt = data.type === "text" ? (data.text || "") : "";
    import("./chat.js").then(m => m.setReply(key, data.pseudo, txt));
  });
  if (dmBtn)      dmBtn.addEventListener("click", () => import("./dm.js").then(m => m.openDmWith(data.pseudo)));
  if (adminDelBtn)adminDelBtn.addEventListener("click", () => adminDeleteMsg(key));
  if (rpPreview)  rpPreview.addEventListener("click", () => scrollToMsg(rpPreview.dataset.replykey));
  if (reactBtn)   reactBtn.addEventListener("click", e => {
    e.stopPropagation();
    import("./reactions.js").then(m => m.openReactionPickerFor(key, reactBtn));
  });

  msgsWrap.appendChild(row);
  const group = row.querySelector(".bubble-group");
  if (group && !isDeleted) group.appendChild(buildReactionsRow(key));

  if (!isAtBottom()) { State.setUnreadWhileScrolled(State.unreadWhileScrolled + 1); updateScrollFab(); }
  scrollBottom(scrollForce);
}

// ─── Listen all messages ─────────────────────────────────────────────────────
export function listenMessages() {
  const q = query(MSGS_REF, orderByKey(), limitToLast(100));
  onValue(q, snap => {
    const msgs = snap.val() || {};
    const entries = Object.entries(msgs).sort(([a], [b]) => a < b ? -1 : 1);
    entries.forEach(([k, v]) => {
      if (State.shownKeys.has(k) && v.deleted) {
        const row = msgsWrap.querySelector(`[data-key="${k}"]`);
        if (row) {
          const bubble = row.querySelector(".bubble");
          if (bubble && !bubble.classList.contains("deleted-bubble")) {
            bubble.classList.add("deleted-bubble");
            bubble.innerHTML = "Message supprimé";
            ["reply-action-btn","admin-action-btn","react-action-btn","dm-action-btn"]
              .forEach(cls => row.querySelector("." + cls)?.remove());
            row.querySelector(".reactions-row")?.remove();
          }
        }
        return;
      }
      renderMsg(k, v, State.initialLoad);
    });
    if (State.initialLoad) {
      setTimeout(() => {
        msgsWrap.scrollTop = msgsWrap.scrollHeight;
        State.setUnreadWhileScrolled(0);
        updateScrollFab();
      }, 80);
      State.setInitialLoad(false);
    }
  });
}

// ─── Admin delete ────────────────────────────────────────────────────────────
export function adminDeleteMsg(key) {
  if (!State.isAdmin) return;
  update(ref(db, `kychat/messages/${key}`), { deleted: true });
}
