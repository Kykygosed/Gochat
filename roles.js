import { db, ref, set, remove, push, get, update, onValue, ROLES_REF, USER_ROLES_REF, MSGS_REF } from "./firebase.js";
import * as State from "./state.js";
import { escapeHtml, hexToRgba } from "./ui-helpers.js";
import { ROLE_PRESET_COLORS } from "./constants.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getUserRoleList(pseudo) {
  const myRoles = State.userRolesCache[pseudo];
  if (!myRoles) return [];
  return Object.keys(myRoles)
    .filter(id => State.rolesCache[id])
    .map(id => ({ id, ...State.rolesCache[id] }))
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

export function roleTagsHTML(pseudo) {
  const roles = getUserRoleList(pseudo);
  if (!roles.length) return "";
  return roles.map(r => {
    const iconHTML = r.icon ? `<img class="role-icon" src="${r.icon}"/>` : "";
    return `<span class="role-tag" style="color:${r.color || '#7c3aed'};border-color:${hexToRgba(r.color || '#7c3aed', .45)};background:${hexToRgba(r.color || '#7c3aed', .12)}">${iconHTML}${escapeHtml(r.name || "")}</span>`;
  }).join("");
}

export function getTopRole(pseudo) {
  const roles = getUserRoleList(pseudo);
  return roles.length ? roles[0] : null;
}

export function toggleUserRole(pseudo, roleId, on) {
  if (on) set(ref(db, `kychat/userRoles/${pseudo}/${roleId}`), true);
  else    remove(ref(db, `kychat/userRoles/${pseudo}/${roleId}`));
}

// ─── Listeners ───────────────────────────────────────────────────────────────
export function listenRoles(msgsWrap, assignRoleModal, renderAssignRoleList, renderAdminRoleList, isAdmin) {
  onValue(ROLES_REF, snap => {
    State.setRolesCache(snap.val() || {});
    if (isAdmin()) renderAdminRoleList();
    if (assignRoleModal.classList.contains("open")) renderAssignRoleList();
    rerenderAllMessageRoles(msgsWrap);
  });
  onValue(USER_ROLES_REF, snap => {
    State.setUserRolesCache(snap.val() || {});
    if (assignRoleModal.classList.contains("open")) renderAssignRoleList();
    rerenderAllMessageRoles(msgsWrap);
  });
}

export function rerenderAllMessageRoles(msgsWrap) {
  msgsWrap.querySelectorAll(".msg-row[data-pseudo]").forEach(row => {
    const slot = row.querySelector(".msg-roles-row");
    if (slot) slot.innerHTML = roleTagsHTML(row.dataset.pseudo);
  });
}

// ─── Admin role list UI ──────────────────────────────────────────────────────
export function renderAdminRoleList(adminRoleList, openRoleCreateModal, deleteRole) {
  const entries = Object.entries(State.rolesCache);
  if (!entries.length) {
    adminRoleList.innerHTML = `<div class="role-empty-hint">Aucun rôle créé pour l'instant.</div>`;
    return;
  }
  adminRoleList.innerHTML = "";
  entries.sort(([, a], [, b]) => (a.createdAt || 0) - (b.createdAt || 0)).forEach(([id, r]) => {
    const row = document.createElement("div"); row.className = "admin-role-row";
    const iconHTML = r.icon
      ? `<img class="role-icon-mini" src="${r.icon}"/>`
      : `<span class="role-swatch-mini" style="background:${r.color || '#7c3aed'}"></span>`;
    row.innerHTML = `${iconHTML}<span class="arr-name" style="color:${r.color || '#7c3aed'}">${escapeHtml(r.name || "")}</span><div class="arr-actions"><button class="aur-btn roles-btn" data-action="edit">Modifier</button><button class="aur-btn ban-btn" data-action="delete">Suppr.</button></div>`;
    row.querySelector('[data-action="edit"]').addEventListener("click", () => openRoleCreateModal(id));
    row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteRole(id, r.name));
    adminRoleList.appendChild(row);
  });
}

// ─── Assign role list UI ─────────────────────────────────────────────────────
export function renderAssignRoleList(assignRoleList) {
  const entries = Object.entries(State.rolesCache);
  if (!entries.length) {
    assignRoleList.innerHTML = `<div class="role-empty-hint">Aucun rôle à assigner. Crée-en un d'abord.</div>`;
    return;
  }
  const myRoles = State.userRolesCache[State.assignRoleTargetPseudo] || {};
  assignRoleList.innerHTML = "";
  entries.sort(([, a], [, b]) => (a.createdAt || 0) - (b.createdAt || 0)).forEach(([id, r]) => {
    const checked = !!myRoles[id];
    const row = document.createElement("div");
    row.className = "assign-role-row" + (checked ? " checked" : "");
    const iconHTML = r.icon
      ? `<img class="role-icon-mini" src="${r.icon}"/>`
      : `<span class="role-swatch-mini" style="background:${r.color || '#7c3aed'}"></span>`;
    row.innerHTML = `${iconHTML}<span class="arr-name" style="color:${r.color || '#7c3aed'}">${escapeHtml(r.name || "")}</span><span class="arr-check">✓</span>`;
    row.addEventListener("click", () => toggleUserRole(State.assignRoleTargetPseudo, id, !checked));
    assignRoleList.appendChild(row);
  });
}

// ─── Delete role ─────────────────────────────────────────────────────────────
export function deleteRole(roleId, name) {
  if (!State.isAdmin) return;
  if (!confirm(`Supprimer le rôle "${name}" ? Il sera retiré de tous les membres.`)) return;
  remove(ref(db, `kychat/roles/${roleId}`));
  Object.entries(State.userRolesCache).forEach(([pseudo, roles]) => {
    if (roles && roles[roleId]) remove(ref(db, `kychat/userRoles/${pseudo}/${roleId}`));
  });
  push(MSGS_REF, { pseudo: "Système", text: `🗑️ Le rôle "${name}" a été supprimé par l'admin ${State.adminUser}.`, type: "system", ts: Date.now() });
}
