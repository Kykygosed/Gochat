// ─── Shared mutable state ───────────────────────────────────────────────────

export let myPseudo        = localStorage.getItem("kychat_pseudo") || null;
export let myProfilePhoto  = localStorage.getItem("kychat_photo")  || null;
export let myOnlineRef     = null;
export let myTypingRef     = null;

export let isAdmin    = localStorage.getItem("kychat_admin") === "1";
export let adminUser  = localStorage.getItem("kychat_admin_user") || "";

export let replyTarget       = null;
export let bansCache         = {};
export let mutesCache        = {};
export let settingsCache     = {};
export let onlineUsersCache  = {};
export let registeredUsersCache = {};
export let rolesCache        = {};
export let userRolesCache    = {};
export let reactionsCache    = {};
export let announcementCache = null;
export let followsCache      = {};
export let followingCache    = {};
export let stickersCache     = {};
export let dmIndexCache      = {};
export let voiceRoomsCache   = {};

export let myVoiceRoomId      = null;
export let voiceLocalStream   = null;
export let voicePeerConnections = {};
export let voicePendingIce    = {};
export let voiceMicOn         = true;
export let voiceSeenKeys      = new Set();
export let voiceSignalListenerOff = null;
export let voiceRoomListenerOff   = null;

export let dmCurrentPair    = null;
export let dmCurrentMsgsOff = null;
export let openProfilePseudo = null;
export let pendingMuteTarget = null;
export let assignRoleTargetPseudo = null;
export let editingRoleId    = null;
export let stagedRoleIcon   = undefined;

export let shownKeys        = new Set();
export let lastDateLabel    = "";
export let initialLoad      = true;
export let unreadWhileScrolled = 0;

export let announceSelectedColor = "default";
export let announceSelectedIcon  = "📣";

export let theme = localStorage.getItem("kychat_theme") || "light";

export function getMyId() {
  let id = localStorage.getItem("kychat_uid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("kychat_uid", id);
  }
  return id;
}
export const MY_ID = getMyId();

// Setters (modules that mutate state import these)
export function setMyPseudo(v)           { myPseudo = v; }
export function setMyProfilePhoto(v)     { myProfilePhoto = v; }
export function setMyOnlineRef(v)        { myOnlineRef = v; }
export function setMyTypingRef(v)        { myTypingRef = v; }
export function setIsAdmin(v)            { isAdmin = v; }
export function setAdminUser(v)          { adminUser = v; }
export function setReplyTarget(v)        { replyTarget = v; }
export function setBansCache(v)          { bansCache = v; }
export function setMutesCache(v)         { mutesCache = v; }
export function setSettingsCache(v)      { settingsCache = v; }
export function setOnlineUsersCache(v)   { onlineUsersCache = v; }
export function setRegisteredUsersCache(v){ registeredUsersCache = v; }
export function setRolesCache(v)         { rolesCache = v; }
export function setUserRolesCache(v)     { userRolesCache = v; }
export function setReactionsCache(v)     { reactionsCache = v; }
export function setAnnouncementCache(v)  { announcementCache = v; }
export function setFollowsCache(v)       { followsCache = v; }
export function setFollowingCache(v)     { followingCache = v; }
export function setStickersCache(v)      { stickersCache = v; }
export function setDmIndexCache(v)       { dmIndexCache = v; }
export function setVoiceRoomsCache(v)    { voiceRoomsCache = v; }
export function setMyVoiceRoomId(v)      { myVoiceRoomId = v; }
export function setVoiceLocalStream(v)   { voiceLocalStream = v; }
export function setVoicePeerConnections(v){ voicePeerConnections = v; }
export function setVoicePendingIce(v)    { voicePendingIce = v; }
export function setVoiceMicOn(v)         { voiceMicOn = v; }
export function setVoiceSeenKeys(v)      { voiceSeenKeys = v; }
export function setVoiceSignalListenerOff(v){ voiceSignalListenerOff = v; }
export function setVoiceRoomListenerOff(v)  { voiceRoomListenerOff = v; }
export function setDmCurrentPair(v)      { dmCurrentPair = v; }
export function setDmCurrentMsgsOff(v)   { dmCurrentMsgsOff = v; }
export function setOpenProfilePseudo(v)  { openProfilePseudo = v; }
export function setPendingMuteTarget(v)  { pendingMuteTarget = v; }
export function setAssignRoleTargetPseudo(v){ assignRoleTargetPseudo = v; }
export function setEditingRoleId(v)      { editingRoleId = v; }
export function setStagedRoleIcon(v)     { stagedRoleIcon = v; }
export function setShownKeys(v)          { shownKeys = v; }
export function setLastDateLabel(v)      { lastDateLabel = v; }
export function setInitialLoad(v)        { initialLoad = v; }
export function setUnreadWhileScrolled(v){ unreadWhileScrolled = v; }
export function setAnnounceSelectedColor(v){ announceSelectedColor = v; }
export function setAnnounceSelectedIcon(v) { announceSelectedIcon = v; }
export function setTheme(v)              { theme = v; }
