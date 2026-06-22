import { db, ref, get, update } from "./firebase.js";
import * as State from "./state.js";

export function levelForXp(xp)  { return Math.max(1, Math.floor(Math.sqrt((xp || 0) / 40)) + 1); }
export function xpForLevel(lvl) { return Math.pow(lvl - 1, 2) * 40; }

export function getUserXp(pseudo) {
  const u = State.registeredUsersCache[pseudo] || State.onlineUsersCache[pseudo];
  return (u && u.xp) || 0;
}
export function getUserMsgCount(pseudo) {
  const u = State.registeredUsersCache[pseudo];
  return (u && u.messageCount) || 0;
}

export function levelBadgeHTML(pseudo) {
  const lvl = levelForXp(getUserXp(pseudo));
  return `<span class="level-badge">Niv. ${lvl}</span>`;
}

export function addXp(pseudo, amount) {
  const userRef = ref(db, `kychat/users/${pseudo}`);
  get(userRef).then(snap => {
    const cur = snap.val() || {};
    update(userRef, { xp: (cur.xp || 0) + amount });
  }).catch(() => {});
}

export function incrementMsgCount(pseudo) {
  const userRef = ref(db, `kychat/users/${pseudo}`);
  get(userRef).then(snap => {
    const cur = snap.val() || {};
    update(userRef, { messageCount: (cur.messageCount || 0) + 1, xp: (cur.xp || 0) + 10 });
  }).catch(() => {});
}

let xpHeartbeatInt = null;
export function startXpHeartbeat() {
  clearInterval(xpHeartbeatInt);
  xpHeartbeatInt = setInterval(() => {
    if (State.myPseudo && !document.hidden) addXp(State.myPseudo, 1);
  }, 60000);
}
