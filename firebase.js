import { initializeApp }         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue, onDisconnect, set, remove, get, query, orderByKey, limitToLast, update }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyWu4TI4PIRXfeb7yqt0WIGClgu10IjkM",
  authDomain: "kylita-f2923.firebaseapp.com",
  databaseURL: "https://kylita-f2923-default-rtdb.firebaseio.com",
  projectId: "kylita-f2923",
  storageBucket: "kylita-f2923.firebasestorage.app",
  messagingSenderId: "431823530994",
  appId: "1:431823530994:web:88a07e633751686e5ad96b"
};

const fbApp = initializeApp(firebaseConfig);
const db    = getDatabase(fbApp);

export const MSGS_REF         = ref(db, "kychat/messages");
export const ONLINE_REF       = ref(db, "kychat/online");
export const USERS_REF        = ref(db, "kychat/users");
export const TYPING_REF       = ref(db, "kychat/typing");
export const WALLPAPER_REF    = ref(db, "kychat/wallpaper");
export const STICKERS_REF     = ref(db, "kychat/stickers");
export const BANS_REF         = ref(db, "kychat/bans");
export const MUTES_REF        = ref(db, "kychat/mutes");
export const SETTINGS_REF     = ref(db, "kychat/settings");
export const ROLES_REF        = ref(db, "kychat/roles");
export const USER_ROLES_REF   = ref(db, "kychat/userRoles");
export const REACTIONS_REF    = ref(db, "kychat/reactions");
export const ANNOUNCEMENT_REF = ref(db, "kychat/announcement");
export const FOLLOWS_REF      = ref(db, "kychat/follows");
export const FOLLOWING_REF    = ref(db, "kychat/followingOf");
export const VOICE_ROOMS_REF  = ref(db, "kychat/voiceRooms");
export const VOICE_SIGNALS_REF= ref(db, "kychat/voiceSignals");
export const DMS_REF          = ref(db, "kychat/dms");
export const DM_INDEX_REF     = ref(db, "kychat/dmIndex");

export { db, ref, push, onValue, onDisconnect, set, remove, get, query, orderByKey, limitToLast, update };
