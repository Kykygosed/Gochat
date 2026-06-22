export const GIPHY_KEY = "dc6zaTOxFJmzC";

export const ADMIN_ACCOUNTS = { "admin": "kyChat2024!", "modo": "modo_secret" };

export const TEXT_FONTS = {
  "default" : "'Space Grotesk', sans-serif",
  "serif"   : "Georgia,'Times New Roman',serif",
  "mono"    : "'Courier New',monospace",
  "rounded" : "'Trebuchet MS','Comic Sans MS',sans-serif",
  "system"  : "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
};

export const TEXT_COLORS = {
  "default" : null,
  "white"   : "#f5f5f5",
  "lavender": "#c4b5fd",
  "mint"    : "#86efac",
  "sky"     : "#7dd3fc",
  "rose"    : "#fda4af",
  "amber"   : "#fcd34d"
};

export const AVATAR_COLORS = [
  "#7c3aed","#0891b2","#059669","#c2670b",
  "#dc2626","#db2777","#4f46e5","#0d9488"
];

export const EMOJIS = [
  "😀","😂","😍","🥰","😎","🤔","😅","🤣","😭","😤",
  "🔥","❤️","👍","👏","🎉","💯","✨","😱","🙏","🤝",
  "💀","😏","🥲","😬","🫡","💬","🚀","👀","💪","🎮"
];

export const REACTION_EMOJIS = ["👍","❤️","😂","😮","😢","🔥","🎉","👏"];

export const ROLE_PRESET_COLORS = [
  "#dc2626","#c2670b","#ca8a04","#65a30d","#059669",
  "#0891b2","#2563eb","#7c3aed","#c026d3","#db2777",
  "#6b7280","#111827"
];

export const BG_COLORS_LIGHT = [
  "#ffffff","#f8f5ff","#eef9f1","#fff7ed","#fef2f2","#eef2ff",
  "#fdf4ff","#f0fdfa","#f8fafc","#fffbeb","#f0f9ff","#fef9c3",
  "#fae8ff","#ecfeff","#fff1f2"
];

export const ANNOUNCE_FONTS  = TEXT_FONTS;
export const ANNOUNCE_COLORS = {
  "default": null,
  "white"  : "#1a1d2b",
  "lavender": "#7c3aed",
  "mint"   : "#15803d",
  "sky"    : "#0369a1",
  "rose"   : "#be123c",
  "amber"  : "#a16207",
  "warn"   : "#c2670b"
};
export const ANNOUNCE_ICONS = ["📣","✨","📌","⚠️","🎉","👋","🔔","💜","🛠️","📝"];

export const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ]
};

export const STICKER_SIZE = 280;

export const ADMIN_COMMANDS_HELP = [
  { cmd: "!help",                      desc: "Affiche cette liste de commandes." },
  { cmd: "!mute @pseudo [minutes]",    desc: "Mute un utilisateur (défaut 15 min)." },
  { cmd: "!unmute @pseudo",            desc: "Démute un utilisateur." },
  { cmd: "!ban @pseudo",               desc: "Bannit un utilisateur du chat." },
  { cmd: "!unban @pseudo",             desc: "Débannit un utilisateur (par pseudo)." },
  { cmd: "!kick @pseudo",              desc: "Déconnecte un utilisateur (le force hors ligne)." },
  { cmd: "!role @pseudo NomDuRole",    desc: "Attribue un rôle existant à quelqu'un." },
  { cmd: "!unrole @pseudo NomDuRole",  desc: "Retire un rôle à quelqu'un." },
  { cmd: "!myrole NomDuRole",          desc: "L'admin s'attribue (ou retire) un rôle à lui-même." },
  { cmd: "!clear",                     desc: "Supprime tous les messages du chat." },
  { cmd: "!say message",               desc: "Envoie un message en tant que Système." },
  { cmd: "!whois @pseudo",             desc: "Affiche les infos d'un utilisateur." },
  { cmd: "!announce message",          desc: "Publie/remplace le message d'accueil (texte brut)." },
  { cmd: "!unannounce",                desc: "Désactive le message d'accueil." },
  { cmd: "!voiceroom NomDuSalon",      desc: "Crée un nouveau salon vocal." },
  { cmd: "!delvoiceroom NomDuSalon",   desc: "Supprime un salon vocal." }
];
