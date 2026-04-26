import type { UnifiedIOC } from "@/lib/types/ioc";

export const unifiedIocs: UnifiedIOC[] = [
  // ── Emoji IOCs ─────────────────────────────────────────────────────────────
  {
    id: "ioc-e1", tipo: "emoji", valor: "🥷",
    label: "Ninja", emoji_meaning: "Referencia a operadores o miembros de organización criminal",
    categoria: "Reclutamiento / Identidad",
    criticidad: 5, score: 96, hits: 312, ultima_deteccion: "hace 2 min", severity: "critical",
  },
  {
    id: "ioc-e2", tipo: "emoji", valor: "🪖",
    label: "Casco militar", emoji_meaning: "Contenido con personas armadas o estética paramilitar",
    categoria: "Militarización / Violencia",
    criticidad: 4, score: 84, hits: 198, ultima_deteccion: "hace 8 min", severity: "high",
  },
  {
    id: "ioc-e3", tipo: "emoji", valor: "🍕",
    label: "Pizza", emoji_meaning: "Referencia codificada a organizaciones criminales (ej: chapizza)",
    categoria: "Código / Identidad",
    criticidad: 4, score: 81, hits: 174, ultima_deteccion: "hace 15 min", severity: "high",
  },
  {
    id: "ioc-e4", tipo: "emoji", valor: "🐔",
    label: "Gallo", emoji_meaning: "Asociado a reclutamiento en ciertos grupos",
    categoria: "Reclutamiento",
    criticidad: 4, score: 78, hits: 143, ultima_deteccion: "hace 22 min", severity: "high",
  },
  {
    id: "ioc-e5", tipo: "emoji", valor: "😈",
    label: "Diablo", emoji_meaning: "Representación de conducta agresiva o criminal",
    categoria: "Intención",
    criticidad: 3, score: 65, hits: 89, ultima_deteccion: "hace 38 min", severity: "medium",
  },

  // ── Handles ────────────────────────────────────────────────────────────────
  {
    id: "ioc-h1", tipo: "handle", valor: "@vida_facil_92",
    categoria: "Reclutamiento", criticidad: 5, score: 91, hits: 142,
    ultima_deteccion: "hace 12 min", severity: "critical",
    tags: ["TikTok", "Campaña coordinada"],
  },
  {
    id: "ioc-h2", tipo: "handle", valor: "@adventures_mx_pro",
    categoria: "Grooming", criticidad: 5, score: 88, hits: 84,
    ultima_deteccion: "hace 1 h", severity: "critical",
    tags: ["Instagram", "Grooming confirmado"],
  },
  {
    id: "ioc-h3", tipo: "handle", valor: "@regalo_especial_mx",
    categoria: "Coerción", criticidad: 3, score: 62, hits: 12,
    ultima_deteccion: "hace 3 h", severity: "medium",
    tags: ["Instagram", "Coerción"],
  },

  // ── URLs ───────────────────────────────────────────────────────────────────
  {
    id: "ioc-u1", tipo: "url", valor: "hxxps://t.me/invite_trabajo_esp",
    categoria: "Redirección privada", criticidad: 5, score: 87, hits: 98,
    ultima_deteccion: "hace 28 min", severity: "critical",
    tags: ["Telegram", "Redirección"],
  },
  {
    id: "ioc-u2", tipo: "url", valor: "hxxp://oferta-trabajo-facil[.]xyz",
    categoria: "Phishing / Captación", criticidad: 5, score: 84, hits: 77,
    ultima_deteccion: "hace 35 min", severity: "critical",
    tags: ["Web", "Phishing"],
  },
  {
    id: "ioc-u3", tipo: "url", valor: "discord-regalo-gratis[.]net",
    categoria: "Phishing", criticidad: 4, score: 73, hits: 18,
    ultima_deteccion: "hace 1 h", severity: "high",
    tags: ["Discord", "Phishing"],
  },
  {
    id: "ioc-u4", tipo: "url", valor: "hxxps://meet-friends[.]xyz/priv",
    categoria: "Canal privado", criticidad: 3, score: 59, hits: 9,
    ultima_deteccion: "hace 2 h", severity: "medium",
    tags: ["Migración", "Canal privado"],
  },

  // ── IPs ────────────────────────────────────────────────────────────────────
  {
    id: "ioc-i1", tipo: "ip", valor: "189.203.xxx.41",
    categoria: "Infraestructura de amenaza", criticidad: 4, score: 76, hits: 31,
    ultima_deteccion: "hace 45 min", severity: "high",
    tags: ["IP origen", "Recurrente"],
  },
  {
    id: "ioc-i2", tipo: "ip", valor: "187.211.43.x",
    categoria: "Infraestructura de amenaza", criticidad: 4, score: 74, hits: 77,
    ultima_deteccion: "hace 45 min", severity: "high",
    tags: ["IP compartida"],
  },
  {
    id: "ioc-i3", tipo: "ip", valor: "187.xxx.xxx.89",
    categoria: "Infraestructura de amenaza", criticidad: 3, score: 61, hits: 27,
    ultima_deteccion: "hace 2 h", severity: "medium",
    tags: ["IP origen", "Instagram"],
  },

  // ── Keywords ───────────────────────────────────────────────────────────────
  {
    id: "ioc-k1", tipo: "keyword", valor: "trabajo fácil",
    categoria: "Reclutamiento", criticidad: 4, score: 89, hits: 634,
    ultima_deteccion: "hace 3 min", severity: "high",
    tags: ["TikTok", "Instagram"],
  },
  {
    id: "ioc-k2", tipo: "keyword", valor: "#dinero_rapido",
    categoria: "Reclutamiento", criticidad: 4, score: 82, hits: 412,
    ultima_deteccion: "hace 8 min", severity: "high",
    tags: ["TikTok", "Hashtag"],
  },
  {
    id: "ioc-k3", tipo: "keyword", valor: "grupo privado",
    categoria: "Redirección", criticidad: 3, score: 71, hits: 289,
    ultima_deteccion: "hace 5 min", severity: "medium",
    tags: ["Discord", "Telegram"],
  },
];
