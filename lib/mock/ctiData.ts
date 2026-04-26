// ── Types ─────────────────────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type ArtifactType = "ip" | "domain" | "hash" | "url" | "email" | "handle";
export type CaseStatus = "open" | "in_progress" | "escalated" | "closed" | "in_review";
export type PartnerStatus = "active" | "pending" | "resolved";
export type Platform =
  | "tiktok" | "instagram" | "discord" | "roblox" | "telegram"
  | "web" | "youtube" | "whatsapp" | "facebook" | "twitter";
export type EscalationStatus = "not_escalated" | "pending" | "sent" | "acknowledged" | "resolved";
export type ValidationStatus = "auto_classified" | "human_validated" | "pending_review";

// ── Dashboard widget types ────────────────────────────────────────────────────

export interface CTIMetric {
  id: string;
  label: string;
  value: string | number;
  delta: string;
  deltaUp: boolean;
  sub: string;
}

export interface SeverityBucket {
  severity: Severity;
  count: number;
  pct: number;
}

export interface GuardEvent {
  id: string;
  timestamp: string;
  platform: Platform;
  source: string;
  snippet: string;
  severity: Severity;
  processed: boolean;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  value: string;
  severity: Severity;
  firstSeen: string;
  lastSeen: string;
  hits: number;
  tags: string[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  status: PartnerStatus;
  casesOpen: number;
  lastSync: string;
  escalatedToday: number;
}

export interface AlertsByHour {
  hour: string;
  critical: number;
  high: number;
  medium: number;
}

export interface PlatformDist {
  platform: string;
  value: number;
  color: string;
}

export interface WeeklyTrend {
  day: string;
  iocs: number;
  alerts: number;
}

export interface IntelCase {
  id: string;
  title: string;
  severity: Severity;
  status: CaseStatus;
  platform: Platform;
  accountHandle?: string;
  assignee: string;
  created: string;
  updated: string;
  iocCount: number;
  tags: string[];
}

export interface CaseDetail extends IntelCase {
  description: string;
  artifacts: Artifact[];
  timeline: { ts: string; actor: string; action: string }[];
  mitreTactics: string[];
  recommendation: string;
}

// ── Rich AlertCase types ──────────────────────────────────────────────────────

export interface AlertArtifact {
  type: "url" | "ip" | "handle" | "keyword" | "hash" | "location" | "email" | "domain";
  value: string;
  confidence: number;
  description: string;
}

export interface EvidenceItem {
  id:          string;
  title:       string;
  description: string;
  url:         string;
  timestamp:   string;
  source:      string;
}

export interface AlertIOC {
  tipo:        string;
  valor:       string;
  categoria:   string;
  severidad:   Severity;
  confianza:   number;
  explicacion: string;
}

export interface AlertTimelineEvent {
  time: string;
  title: string;
  description: string;
  status: "completed" | "active" | "pending";
}

export interface AlertCase {
  id: string;
  source: "layers_guard" | "analyst" | "osint" | "partner";
  platform: Platform;
  accountHandle?: string;
  userContext?: string;
  approximateLocation?: string;
  sourceIp?: string;
  riskType: string;
  severity: Severity;
  status: CaseStatus;
  confidence: number;
  timestamp: string;
  summary: string;
  classifier: string;
  validationStatus: ValidationStatus;
  artifacts: AlertArtifact[];
  investigation: {
    findings: string;
    correlatedEvidence: string[];
    observedSignals: string[];
    riskVector: string;
    recommendation: string;
  };
  timeline: AlertTimelineEvent[];
  escalation: {
    suggestedPartner: string;
    status: EscalationStatus;
    sla: string;
    lastSent: string | null;
    reportsSent: number;
  };
  // Enriched fields — optional for backward compatibility
  riskScore?:          number;
  hypothesis?:         string;
  geolocation?:        string;
  language?:           string;
  accountAge?:         string;
  accountStatus?:      string;
  evidence?:           EvidenceItem[];
  iocEntries?:         AlertIOC[];
  recommendedActions?: string[];
  analystNotes?:       string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSeverityConfig(s: Severity) {
  const map: Record<Severity, { label: string; bg: string; text: string; ring: string; dot: string }> = {
    critical: { label: "Crítico", bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-200",    dot: "#ef4444" },
    high:     { label: "Alto",    bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", dot: "#f97316" },
    medium:   { label: "Medio",   bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-200",  dot: "#f59e0b" },
    low:      { label: "Bajo",    bg: "bg-blue-50",   text: "text-blue-700",   ring: "ring-blue-200",   dot: "#3b82f6" },
    info:     { label: "Info",    bg: "bg-slate-50",  text: "text-slate-600",  ring: "ring-slate-200",  dot: "#94a3b8" },
  };
  return map[s];
}

export function getStatusConfig(s: CaseStatus) {
  const map: Record<CaseStatus, { label: string; bg: string; text: string }> = {
    open:        { label: "Abierto",     bg: "bg-red-50",    text: "text-red-700"    },
    in_progress: { label: "En proceso",  bg: "bg-amber-50",  text: "text-amber-700"  },
    escalated:   { label: "Escalado",    bg: "bg-purple-50", text: "text-purple-700" },
    closed:      { label: "Cerrado",     bg: "bg-green-50",  text: "text-green-700"  },
    in_review:   { label: "En revisión", bg: "bg-blue-50",   text: "text-blue-700"   },
  };
  return map[s];
}

export function getPlatformConfig(p: Platform) {
  const map: Record<Platform, { label: string; color: string }> = {
    tiktok:    { label: "TikTok",    color: "#010101" },
    instagram: { label: "Instagram", color: "#e1306c" },
    discord:   { label: "Discord",   color: "#5865f2" },
    roblox:    { label: "Roblox",    color: "#e42020" },
    telegram:  { label: "Telegram",  color: "#06b6d4" },
    web:       { label: "Web",       color: "#64748b" },
    youtube:   { label: "YouTube",   color: "#ff0000" },
    whatsapp:  { label: "WhatsApp",  color: "#25d366" },
    facebook:  { label: "Facebook",  color: "#1877f2" },
    twitter:   { label: "Twitter/X", color: "#1da1f2" },
  };
  return map[p];
}

export function getCaseDetail(id: string): CaseDetail | undefined {
  return caseDetails.find((c) => c.id === id);
}

export function getAlertCase(id: string): AlertCase | undefined {
  return alertCases.find((c) => c.id === id);
}

// ── KPI metrics ───────────────────────────────────────────────────────────────

export const ctiMetrics: CTIMetric[] = [
  { id: "signals",   label: "Señales detectadas",     value: 847,  delta: "+23",  deltaUp: true,  sub: "últimas 24 h — Layers Guard" },
  { id: "alerts",    label: "Alertas de riesgo alto",  value: 31,   delta: "+8",   deltaUp: true,  sub: "requieren atención" },
  { id: "profiles",  label: "Perfiles en seguimiento", value: 156,  delta: "-4",   deltaUp: false, sub: "menores activos" },
  { id: "cases",     label: "Casos abiertos",          value: 42,   delta: "+2",   deltaUp: true,  sub: "en investigación" },
  { id: "escalated", label: "Escalaciones hoy",        value: 9,    delta: "+3",   deltaUp: true,  sub: "a socios y autoridades" },
  { id: "resolved",  label: "Resueltos (7 d)",          value: 78,   delta: "+11",  deltaUp: true,  sub: "tasa de cierre 91%" },
];

export const severityDistribution: SeverityBucket[] = [
  { severity: "critical", count: 12,  pct: 14 },
  { severity: "high",     count: 19,  pct: 22 },
  { severity: "medium",   count: 31,  pct: 36 },
  { severity: "low",      count: 18,  pct: 21 },
  { severity: "info",     count: 6,   pct: 7  },
];

// ── Layers Guard ingestion feed ───────────────────────────────────────────────

export const layersGuardEvents: GuardEvent[] = [
  {
    id: "tk-001",
    timestamp: "2026-04-26T08:48:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Cuenta @user1334248711265 creada hace menos de 24 h con privacidad máxima, geolocalización inconsistente (Japón, posible VPN) e idioma ZH. Sin contenido publicado. Patrón compatible con cuenta desechable para reclutamiento efímero.",
    severity: "critical",
    processed: false,
  },
  {
    id: "tk-002",
    timestamp: "2026-04-26T08:51:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Perfil @angelriver053 (Tamaulipas · 871 seguidores · 9,376 me gusta · engagement 3.5%) con actividad concentrada los viernes 23:00 CST. Indicadores de afinidad con narcocultura identificados en comentarios. Monitoreo activo.",
    severity: "high",
    processed: false,
  },
  {
    id: "tk-003",
    timestamp: "2026-04-26T08:35:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Señales de código simbólico detectadas: emojis 🥷🪖🍕🐔😈 presentes de forma recurrente en comentarios hacia perfiles con indicadores de minoría de edad. Patrón compatible con comunicación encubierta entre actores de riesgo.",
    severity: "high",
    processed: false,
  },
  {
    id: "tk-004",
    timestamp: "2026-04-26T07:22:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Audios 'Reynosa la Maldosa' y 'El Canasteo' detectados en videos dirigidos a perfiles con indicadores de menores. Contenido con referencias a reclutamiento forzado y actividad de crimen organizado.",
    severity: "high",
    processed: true,
  },
  {
    id: "tk-005",
    timestamp: "2026-04-26T06:58:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Keyword 'trabajo fácil' detectada en 12 publicaciones recientes con indicadores de reclutamiento aspiracional. Patrón de redirección a contacto privado identificado en 7 de los 12 casos. Posible campaña coordinada.",
    severity: "high",
    processed: true,
  },
  {
    id: "tk-006",
    timestamp: "2026-04-26T05:44:00Z",
    platform: "tiktok",
    source: "Layers Guard — TikTok Monitor",
    snippet: "Patrón de 'mensaje privado' detectado en 8 cuentas nuevas de TikTok con actividad concentrada en DMs hacia perfiles de menores. Sin publicaciones públicas — perfiles orientados exclusivamente a contacto directo.",
    severity: "medium",
    processed: false,
  },
  {
    id: "rblx-001",
    timestamp: "2026-04-26T04:15:00Z",
    platform: "roblox",
    source: "Layers Guard — Roblox Monitor",
    snippet: "Red de 3 cuentas nuevas en Roblox ofreciendo Robux gratuitos condicionados a datos personales vía formulario externo. Dominio vinculado registrado hace 7 días. Patrón compatible con captación de datos de menores.",
    severity: "high",
    processed: false,
  },
];

// ── Active IOC/artifact panel ─────────────────────────────────────────────────

export const artifacts: Artifact[] = [
  { id: "a1", type: "handle", value: "@vida_facil_92",                  severity: "critical", firstSeen: "2026-04-20", lastSeen: "2026-04-25", hits: 47,  tags: ["TikTok", "Reclutamiento"] },
  { id: "a2", type: "url",    value: "hxxps://t.me/invite_trabajo_esp", severity: "critical", firstSeen: "2026-04-22", lastSeen: "2026-04-25", hits: 23,  tags: ["Telegram", "Redirección"] },
  { id: "a3", type: "handle", value: "@adventures_mx_pro",              severity: "critical", firstSeen: "2026-04-18", lastSeen: "2026-04-25", hits: 84,  tags: ["Instagram", "Grooming"] },
  { id: "a4", type: "ip",     value: "189.203.xxx.41",                  severity: "high",     firstSeen: "2026-04-21", lastSeen: "2026-04-25", hits: 31,  tags: ["IP origen", "Recurrente"] },
  { id: "a5", type: "domain", value: "discord-regalo-gratis[.]net",     severity: "high",     firstSeen: "2026-04-23", lastSeen: "2026-04-25", hits: 18,  tags: ["Discord", "Phishing"] },
  { id: "a6", type: "handle", value: "@regalo_especial_mx",             severity: "medium",   firstSeen: "2026-04-24", lastSeen: "2026-04-25", hits: 12,  tags: ["Instagram", "Coerción"] },
  { id: "a7", type: "url",    value: "hxxps://meet-friends[.]xyz/priv", severity: "medium",   firstSeen: "2026-04-23", lastSeen: "2026-04-25", hits: 9,   tags: ["Migración", "Canal privado"] },
  { id: "a8", type: "ip",     value: "187.xxx.xxx.89",                  severity: "medium",   firstSeen: "2026-04-19", lastSeen: "2026-04-24", hits: 27,  tags: ["IP origen", "Instagram"] },
];

// ── Child protection partners ─────────────────────────────────────────────────

export const partners: Partner[] = [
  { id: "p1", name: "Ciberpolicía Nacional",       logo: "CP", status: "active",   casesOpen: 4,  lastSync: "hace 2 min",  escalatedToday: 3 },
  { id: "p2", name: "FGR — FEADLE",                logo: "FG", status: "active",   casesOpen: 3,  lastSync: "hace 8 min",  escalatedToday: 2 },
  { id: "p3", name: "DIF Nacional",                logo: "DF", status: "active",   casesOpen: 2,  lastSync: "hace 15 min", escalatedToday: 1 },
  { id: "p4", name: "Trust & Safety (Plataforma)", logo: "TS", status: "pending",  casesOpen: 5,  lastSync: "hace 45 min", escalatedToday: 3 },
  { id: "p5", name: "Equipo Respuesta LG",         logo: "LG", status: "resolved", casesOpen: 0,  lastSync: "hace 1 h",    escalatedToday: 0 },
];

// ── Charts data ───────────────────────────────────────────────────────────────

export const alertsByHour: AlertsByHour[] = [
  { hour: "07", critical: 0, high: 1, medium: 2 },
  { hour: "08", critical: 0, high: 1, medium: 3 },
  { hour: "09", critical: 1, high: 2, medium: 4 },
  { hour: "10", critical: 0, high: 1, medium: 2 },
  { hour: "11", critical: 1, high: 2, medium: 3 },
  { hour: "12", critical: 0, high: 1, medium: 2 },
  { hour: "13", critical: 1, high: 3, medium: 5 },
  { hour: "14", critical: 2, high: 4, medium: 7 },
  { hour: "15", critical: 3, high: 6, medium: 9 },
  { hour: "16", critical: 4, high: 7, medium: 11 },
  { hour: "17", critical: 3, high: 8, medium: 12 },
  { hour: "18", critical: 5, high: 9, medium: 14 },
  { hour: "19", critical: 4, high: 8, medium: 13 },
  { hour: "20", critical: 3, high: 6, medium: 10 },
  { hour: "21", critical: 2, high: 4, medium: 7  },
];

export const platformDistribution: PlatformDist[] = [
  { platform: "TikTok",    value: 32, color: "#010101" },
  { platform: "Instagram", value: 27, color: "#e1306c" },
  { platform: "Discord",   value: 18, color: "#5865f2" },
  { platform: "Roblox",    value: 12, color: "#e42020" },
  { platform: "Telegram",  value: 7,  color: "#06b6d4" },
  { platform: "Otros",     value: 4,  color: "#94a3b8" },
];

export const weeklyTrend: WeeklyTrend[] = [
  { day: "Lun", iocs: 92,  alerts: 18 },
  { day: "Mar", iocs: 108, alerts: 21 },
  { day: "Mié", iocs: 97,  alerts: 16 },
  { day: "Jue", iocs: 134, alerts: 28 },
  { day: "Vie", iocs: 121, alerts: 24 },
  { day: "Sáb", iocs: 156, alerts: 31 },
  { day: "Dom", iocs: 143, alerts: 27 },
];

// ── Intelligence queue ────────────────────────────────────────────────────────

export const intelligenceQueue: IntelCase[] = [
  {
    id: "LG-CTI-001",
    title: "Campaña de reclutamiento clandestina en TikTok",
    severity: "critical",
    status: "open",
    platform: "tiktok",
    accountHandle: "@vida_facil_92",
    assignee: "Ana G.",
    created: "2026-04-25T14:00Z",
    updated: "2026-04-25T16:42Z",
    iocCount: 6,
    tags: ["Reclutamiento", "TikTok"],
  },
  {
    id: "LG-CTI-002",
    title: "Patrón de grooming confirmado — Instagram",
    severity: "critical",
    status: "escalated",
    platform: "instagram",
    accountHandle: "@adventures_mx_pro",
    assignee: "Rodrigo P.",
    created: "2026-04-24T10:00Z",
    updated: "2026-04-25T16:38Z",
    iocCount: 8,
    tags: ["Grooming", "Instagram"],
  },
  {
    id: "LG-CTI-003",
    title: "Contacto sospechoso recurrente en Discord",
    severity: "high",
    status: "in_progress",
    platform: "discord",
    accountHandle: "GamerXYZ#7823",
    assignee: "Laura T.",
    created: "2026-04-25T12:00Z",
    updated: "2026-04-25T16:21Z",
    iocCount: 4,
    tags: ["Contacto sospechoso", "Discord"],
  },
  {
    id: "LG-CTI-004",
    title: "Red de cuentas coordinadas — Roblox",
    severity: "high",
    status: "open",
    platform: "roblox",
    accountHandle: "MultipleAccounts",
    assignee: "Sin asignar",
    created: "2026-04-25T15:00Z",
    updated: "2026-04-25T15:57Z",
    iocCount: 5,
    tags: ["Red coordinada", "Roblox"],
  },
  {
    id: "LG-CTI-005",
    title: "Intento de migración a canal privado — Telegram",
    severity: "high",
    status: "in_review",
    platform: "telegram",
    accountHandle: "@unknown_anon_99",
    assignee: "Carlos M.",
    created: "2026-04-25T13:30Z",
    updated: "2026-04-25T16:10Z",
    iocCount: 3,
    tags: ["Migración", "Telegram"],
  },
  {
    id: "LG-CTI-006",
    title: "Manipulación emocional persistente — WhatsApp",
    severity: "high",
    status: "in_progress",
    platform: "whatsapp",
    accountHandle: "+52 1 55 XXXX XXXX",
    assignee: "Ana G.",
    created: "2026-04-25T11:00Z",
    updated: "2026-04-25T15:44Z",
    iocCount: 5,
    tags: ["Manipulación emocional", "WhatsApp"],
  },
  {
    id: "LG-CTI-007",
    title: "Señales de coerción digital — Instagram",
    severity: "medium",
    status: "open",
    platform: "instagram",
    accountHandle: "@regalo_especial_mx",
    assignee: "Laura T.",
    created: "2026-04-24T18:00Z",
    updated: "2026-04-25T15:30Z",
    iocCount: 4,
    tags: ["Coerción", "Instagram"],
  },
  {
    id: "LG-CTI-008",
    title: "Exposición a contenido de riesgo normalizado — Web",
    severity: "medium",
    status: "closed",
    platform: "youtube",
    accountHandle: "Múltiples canales",
    assignee: "Carlos M.",
    created: "2026-04-23T09:00Z",
    updated: "2026-04-25T10:00Z",
    iocCount: 23,
    tags: ["Contenido de riesgo", "YouTube"],
  },
];

// ── Case details (backward compat) ────────────────────────────────────────────

export const caseDetails: CaseDetail[] = [
  {
    id: "LG-CTI-001",
    title: "Campaña de reclutamiento clandestina en TikTok",
    severity: "critical",
    status: "open",
    platform: "tiktok",
    accountHandle: "@vida_facil_92",
    assignee: "Ana G.",
    created: "2026-04-25T14:00Z",
    updated: "2026-04-25T16:42Z",
    iocCount: 6,
    tags: ["Reclutamiento", "TikTok"],
    description: "Layers Guard identificó una posible campaña de reclutamiento clandestina en TikTok. La cuenta utilizaba contenido aspiracional y redirección hacia Telegram.",
    artifacts: [],
    timeline: [
      { ts: "2026-04-25T14:00Z", actor: "Layers Guard", action: "Señal detectada — patrón de reclutamiento en TikTok." },
      { ts: "2026-04-25T14:30Z", actor: "Layers Core",  action: "Clasificación automática completada. Confianza: 94%." },
    ],
    mitreTactics: [],
    recommendation: "Revisión humana prioritaria y reporte a Trust & Safety de TikTok.",
  },
];

// ── Rich AlertCase data ───────────────────────────────────────────────────────

export const alertCases: AlertCase[] = [
  // ── LG-CTI Queue Cases ────────────────────────────────────────────────────────
  {
    id: "LG-CTI-001",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "@vida_facil_92",
    userContext: "perfil protegido — menor 14 años",
    approximateLocation: "Zona metropolitana de CDMX",
    sourceIp: "189.203.xxx.41",
    riskType: "Campaña de reclutamiento clandestina",
    severity: "critical",
    status: "open",
    confidence: 94,
    timestamp: "2026-04-25T14:00:00Z",
    summary: "Layers Guard identificó una posible campaña de reclutamiento clandestina en TikTok dirigida a perfiles de menores. La cuenta @vida_facil_92 utilizaba contenido aspiracional sobre 'dinero fácil', promesas de oportunidades laborales sin verificación de edad y redirección sistemática hacia un canal privado en Telegram. El modelo LayersCore-Guardian-v1 detectó un patrón de comportamiento compatible con operaciones de captación encubierta. Requiere validación humana prioritaria.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",   value: "@vida_facil_92",                         confidence: 97, description: "Cuenta de TikTok origen — 12,400 seguidores, activa desde enero 2026" },
      { type: "url",      value: "hxxps://t.me/invite_trabajo_especial",   confidence: 95, description: "Enlace de Telegram embebido en bio y comentarios — redirige a grupo privado" },
      { type: "ip",       value: "189.203.xxx.41",                         confidence: 82, description: "IP aproximada del origen de las sesiones — zona CDMX, proveedor Telmex" },
      { type: "keyword",  value: "trabajo fácil sin experiencia gana $200 diarios", confidence: 91, description: "Texto detonante en descripción de videos — patrón aspiracional dirigido a menores" },
      { type: "keyword",  value: "#trabajofacil #dineroextra #oportunidad", confidence: 88, description: "Hashtags usados para aumentar visibilidad hacia perfiles de menores" },
      { type: "location", value: "CDMX — Zona metropolitana (aproximado)", confidence: 70, description: "Geolocalización estimada por metadatos de publicación" },
    ],
    investigation: {
      findings: "La cuenta @vida_facil_92 publicó 47 videos en los últimos 30 días con un patrón consistente: contenido aspiracional de estilo de vida lujoso, promesas de ingresos fáciles y una llamada a la acción que dirige hacia un grupo privado de Telegram. El análisis de la secuencia de interacciones muestra que la cuenta prioriza respuestas a perfiles con indicadores de minoría de edad (lenguaje, referencias escolares, horarios de actividad). El grupo de Telegram destino no es públicamente accesible, lo que impide análisis directo del contenido.",
      correlatedEvidence: [
        "Patrón de publicación idéntico detectado en 2 cuentas bloqueadas en febrero 2026 por la misma campaña",
        "IP 189.203.xxx.41 asociada previamente a actividad de captación en Facebook (enero 2026, informe interno LG-2026-018)",
        "Hashtags utilizados coinciden con campaña documentada en informe UNICEF MX sobre captación digital de menores (Q4 2025)",
      ],
      observedSignals: [
        "47 videos en 30 días con mensaje aspiracional consistente — publicación coordinada",
        "Tasa de respuesta del 100% a comentarios de perfiles con indicadores de menores",
        "Enlace de Telegram presente en el 100% de los videos y en la bio de la cuenta",
        "Horario de publicación concentrado en 3–6 pm (hora de salida escolar en MX)",
        "Sin verificación de edad en las interacciones — solicita contacto directo a cualquier perfil",
      ],
      riskVector: "Captación digital activa de menores mediante contenido aspiracional en TikTok con redirección hacia canal privado no monitoreable. Posible precursor de reclutamiento para actividades ilícitas, explotación laboral o grooming. Riesgo clasificado como ALTO por exposición masiva (12,400 seguidores).",
      recommendation: "1. Revisión humana inmediata para confirmar patrón de reclutamiento. 2. Si se confirma: reportar cuenta a Trust & Safety de TikTok con evidencia completa. 3. Notificar a Ciberpolicía Nacional si se identifica actividad delictiva. 4. Preservar todos los artefactos como evidencia. 5. Monitorear el grupo de Telegram destino si es posible.",
    },
    timeline: [
      { time: "2026-04-25T13:47Z", title: "Señal detectada — Layers Guard",    description: "LG-TikTok-Monitor detecta 6 mensajes directos con patrón aspiracional + enlace externo hacia perfil protegido.", status: "completed" },
      { time: "2026-04-25T13:51Z", title: "Clasificación automática",           description: "LayersCore-Guardian-v1 clasifica como 'Campaña de reclutamiento clandestina'. Confianza: 94%. Severidad: Crítica.", status: "completed" },
      { time: "2026-04-25T13:55Z", title: "Extracción de artefactos",           description: "6 artefactos extraídos: handle, URL de Telegram, IP aproximada, keywords y hashtags detonantes.", status: "completed" },
      { time: "2026-04-25T14:00Z", title: "Caso LG-CTI-001 creado",             description: "Caso generado automáticamente y asignado a cola de revisión humana. Analista: Ana G.", status: "completed" },
      { time: "2026-04-25T16:42Z", title: "Pendiente de validación humana",     description: "Ana G. revisando artefactos y secuencia de mensajes. Confirmación de patrón en proceso.", status: "active" },
      { time: "Pendiente",         title: "Validación y clasificación final",   description: "Confirmar o descartar patrón de reclutamiento con revisión analítica.", status: "pending" },
      { time: "Pendiente",         title: "Escalamiento a Trust & Safety",      description: "Si se confirma: reporte a TikTok Trust & Safety y notificación a Ciberpolicía.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety TikTok + Ciberpolicía Nacional",
      status: "not_escalated",
      sla: "4 horas (crítico)",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-002",
    source: "layers_guard",
    platform: "instagram",
    accountHandle: "@adventures_mx_pro",
    userContext: "perfil protegido — menor 13 años",
    approximateLocation: "Área metropolitana de Monterrey",
    sourceIp: "187.xxx.xxx.89",
    riskType: "Patrón de grooming confirmado",
    severity: "critical",
    status: "escalated",
    confidence: 97,
    timestamp: "2026-04-24T10:00:00Z",
    summary: "Layers Guard identificó una secuencia conversacional en Instagram compatible con las 5 fases clásicas del grooming digital. La cuenta @adventures_mx_pro mantuvo contacto progresivo durante 21 días con un perfil protegido de 13 años, evolucionando desde conversaciones generales hacia solicitudes de fotografías personales y una propuesta de encuentro físico. El modelo detectó con confianza del 97% un patrón de manipulación emocional deliberada, construcción de confianza y aislamiento gradual.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "human_validated",
    artifacts: [
      { type: "handle",   value: "@adventures_mx_pro",                        confidence: 99, description: "Cuenta de Instagram — perfil creado hace 8 meses, 340 seguidores, actividad concentrada en DMs" },
      { type: "ip",       value: "187.xxx.xxx.89",                            confidence: 85, description: "IP del origen de las interacciones — Monterrey, NL. Proveedor Megacable" },
      { type: "keyword",  value: "nadie te entiende como yo / eres especial / no le cuentes a nadie", confidence: 99, description: "Frases detonantes del modelo de grooming — fase de aislamiento y construcción de confianza exclusiva" },
      { type: "url",      value: "hxxps://meet-friends[.]xyz/room/private82", confidence: 94, description: "Enlace a plataforma de video chat no verificada enviado en el día 18 de contacto" },
      { type: "location", value: "Área metropolitana de Monterrey (estimado)", confidence: 78, description: "Geolocalización estimada — referencia geográfica en mensajes + metadatos de publicación" },
      { type: "keyword",  value: "nos podemos ver / tengo algo especial para ti / ven solo",    confidence: 96, description: "Propuesta de encuentro físico detectada en mensajes — día 21 de contacto" },
      { type: "handle",   value: "@adventures_mx_pro_backup",                confidence: 88, description: "Cuenta de respaldo identificada — mismo patrón de comportamiento, creada la misma semana" },
      { type: "domain",   value: "meet-friends[.]xyz",                        confidence: 91, description: "Dominio de plataforma no verificada sin moderación — registrado hace 30 días" },
    ],
    investigation: {
      findings: "El análisis de la secuencia de 21 días de interacciones muestra una progresión sistemática consistente con el modelo de 5 fases de grooming digital: (1) Selección de víctima — búsqueda activa de perfiles con indicadores de vulnerabilidad; (2) Acceso y confianza — conversaciones empáticas y validación emocional intensiva; (3) Aislamiento — mensajes que cuestionan relaciones familiares y sugieren que el adulto 'entiende mejor' al menor; (4) Desensibilización — contenido progresivamente más personal; (5) Control — solicitud de encuentro físico con instrucción de no comunicarlo. Se identificó una cuenta de respaldo creada en la misma semana, lo que sugiere un actor con experiencia previa en este tipo de operaciones.",
      correlatedEvidence: [
        "Cuenta de respaldo @adventures_mx_pro_backup con patrón de comportamiento idéntico identificada — creada 3 días después de la cuenta principal",
        "Dominio meet-friends[.]xyz sin certificado de verificación de edad — registrado 30 días antes del contacto inicial",
        "IP 187.xxx.xxx.89 aparece en base de datos interna LG con 2 señales previas de contacto sospechoso (febrero y marzo 2026)",
        "Patrón de horario de contacto: exclusivamente entre 2–5 pm (hora escolar) — indica conocimiento de la rutina del menor",
      ],
      observedSignals: [
        "21 días de contacto progresivo — patrón de construcción de confianza deliberada",
        "Mensajes de aislamiento identificados desde el día 8: 'tus amigos no te entienden'",
        "Solicitud de fotografías personales detectada en el día 14",
        "Propuesta de encuentro físico con instrucción de secreto en el día 21",
        "Cuenta de respaldo activa simultáneamente — precaución operativa del actor",
      ],
      riskVector: "Grooming digital activo con indicadores de posible preparación para explotación sexual infantil. El contacto físico propuesto representa un riesgo de daño directo e inmediato al menor. Clasificación: EMERGENCIA.",
      recommendation: "1. ACCIÓN INMEDIATA: Reportar a FGR — FEADLE y Ciberpolicía Nacional con toda la evidencia. 2. Preservar la cadena completa de mensajes con cadena de custodia digital. 3. Notificar a las familias del menor a través del protocolo de protección de Layers Guard. 4. Reportar ambas cuentas a Instagram Trust & Safety para eliminación urgente. 5. Solicitar datos del titular de la IP 187.xxx.xxx.89 a Megacable mediante orden judicial.",
    },
    timeline: [
      { time: "2026-04-04T08:00Z", title: "Primer contacto detectado",         description: "Layers Guard registra el primer mensaje de @adventures_mx_pro hacia el perfil protegido.", status: "completed" },
      { time: "2026-04-12T14:30Z", title: "Alerta de patrón temprano",          description: "LG detecta patrón de contacto recurrente — 8 días consecutivos. Marcado para seguimiento.", status: "completed" },
      { time: "2026-04-18T16:00Z", title: "Escalada de riesgo",                 description: "Solicitud de fotografías personales detectada. Severidad elevada a Alta por LG.", status: "completed" },
      { time: "2026-04-24T09:47Z", title: "Propuesta de encuentro físico",       description: "LG detecta propuesta de contacto físico con instrucción de secreto. Alerta Crítica activada.", status: "completed" },
      { time: "2026-04-24T09:52Z", title: "Clasificación — grooming confirmado", description: "LayersCore-Guardian-v1 confirma patrón de grooming con 5 fases identificadas. Confianza: 97%.", status: "completed" },
      { time: "2026-04-24T10:00Z", title: "Caso LG-CTI-002 creado",              description: "Caso abierto y asignado a Rodrigo P. con prioridad máxima.", status: "completed" },
      { time: "2026-04-24T10:45Z", title: "Validación humana completada",        description: "Rodrigo P. confirma grooming activo. Evidencia preservada. Escalamiento iniciado.", status: "completed" },
      { time: "2026-04-25T08:00Z", title: "Escalado a FGR y Ciberpolicía",       description: "Reporte urgente enviado a FGR — FEADLE y Ciberpolicía Nacional con cadena de evidencia completa.", status: "completed" },
      { time: "2026-04-25T16:38Z", title: "Confirmación FGR",                    description: "FGR confirma apertura de investigación. Número de expediente: FGR-2026-0892.", status: "active" },
      { time: "Pendiente",         title: "Notificación a familia del menor",    description: "Coordinación con DIF para contactar y proteger al menor afectado.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "FGR — FEADLE + Ciberpolicía Nacional",
      status: "acknowledged",
      sla: "Inmediato — protocolo de emergencia",
      lastSent: "2026-04-25T08:00Z",
      reportsSent: 3,
    },
  },
  {
    id: "LG-CTI-003",
    source: "layers_guard",
    platform: "discord",
    accountHandle: "GamerXYZ#7823",
    userContext: "perfil protegido — menor 15 años",
    approximateLocation: "Guadalajara, Jalisco (estimado)",
    sourceIp: "201.xxx.xxx.112",
    riskType: "Contacto sospechoso recurrente con manipulación emocional",
    severity: "high",
    status: "in_progress",
    confidence: 88,
    timestamp: "2026-04-25T12:00:00Z",
    summary: "Layers Guard detectó interacciones reiteradas de la cuenta GamerXYZ#7823 con un perfil protegido de 15 años en un servidor de Discord de videojuegos. En un período de 48 horas se registraron 14 interacciones con lenguaje que presenta indicadores de dependencia emocional, aislamiento de pares y solicitud de comunicación fuera de la plataforma. El modelo identificó patrones compatibles con contacto sospechoso en fase temprana.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",  value: "GamerXYZ#7823",                          confidence: 96, description: "Cuenta de Discord — unida al servidor hace 3 semanas, sin historial previo verificable" },
      { type: "ip",      value: "201.xxx.xxx.112",                        confidence: 80, description: "IP aproximada del origen — Guadalajara, Jalisco. Proveedor Totalplay" },
      { type: "keyword", value: "tus amigos no te valoran / yo sí te entiendo / solo tú y yo", confidence: 92, description: "Frases con indicadores de aislamiento emocional y exclusividad — detonantes del modelo" },
      { type: "url",     value: "hxxps://discord.gg/invxxxxxx",           confidence: 87, description: "Enlace a servidor privado de Discord enviado para continuar conversación fuera del servidor público" },
    ],
    investigation: {
      findings: "El análisis de las 14 interacciones en 48 horas muestra un patrón de intensificación rápida de la relación. El actor utilizó el contexto del videojuego como punto de entrada, luego derivó la conversación hacia temas personales con validación emocional. Las frases identificadas como detonantes corresponden a las fases tempranas del ciclo de grooming: construcción de confianza y señales de aislamiento. La invitación a un servidor privado en el día 2 es un indicador de posible intención de separar al menor de un entorno moderado.",
      correlatedEvidence: [
        "La cuenta GamerXYZ#7823 se unió al servidor 3 semanas antes — tiempo suficiente para aparecer como usuario establecido",
        "No se encontraron registros previos de la IP en la base de datos LG — primer contacto registrado",
      ],
      observedSignals: [
        "14 interacciones en 48 horas — frecuencia inusualmente alta para un contacto nuevo",
        "Transición de tema gaming a temas personales en las primeras 6 horas",
        "Uso de lenguaje de validación emocional: 'nadie te entiende como yo'",
        "Invitación a servidor privado en el día 2 de contacto",
      ],
      riskVector: "Fase temprana de posible grooming digital. La velocidad de escalada emocional y la invitación a espacio privado son indicadores de alerta. Requiere monitoreo continuo y validación humana.",
      recommendation: "1. Revisión humana de la secuencia completa de mensajes. 2. Activar monitoreo intensivo del perfil protegido. 3. Preparar notificación a los padres/tutores si se confirman indicadores adicionales. 4. Reportar la cuenta GamerXYZ#7823 a Discord Trust & Safety.",
    },
    timeline: [
      { time: "2026-04-23T14:00Z", title: "Primer contacto",              description: "GamerXYZ#7823 inicia conversación con el perfil protegido en servidor público de videojuegos.", status: "completed" },
      { time: "2026-04-24T18:00Z", title: "Patrón de intensificación",    description: "LG detecta 14 interacciones en 48h con indicadores de manipulación emocional.", status: "completed" },
      { time: "2026-04-25T12:00Z", title: "Caso LG-CTI-003 creado",       description: "Caso asignado a Laura T. para investigación.", status: "completed" },
      { time: "2026-04-25T16:21Z", title: "En investigación activa",      description: "Laura T. analizando la secuencia de mensajes y el perfil de la cuenta.", status: "active" },
      { time: "Pendiente",         title: "Notificación a tutores",       description: "Pendiente decisión de escalamiento a familia del menor.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety Discord + Equipo Respuesta LG",
      status: "not_escalated",
      sla: "8 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-004",
    source: "layers_guard",
    platform: "roblox",
    accountHandle: "RBX_Network_Accounts",
    userContext: "perfiles protegidos — menores 10–12 años",
    approximateLocation: "Nacional (múltiples regiones)",
    sourceIp: "Múltiples IPs — red distribuida",
    riskType: "Red de cuentas coordinadas dirigida a menores",
    severity: "high",
    status: "open",
    confidence: 83,
    timestamp: "2026-04-25T15:00:00Z",
    summary: "Layers Guard identificó un conjunto de 5 cuentas en Roblox con comportamiento coordinado, dirigiendo su actividad hacia perfiles de menores de 10 a 12 años. Las cuentas ofrecían artículos virtuales gratuitos (Robux, skins), hacían preguntas personales progresivas y solicitaban datos fuera de la plataforma. El patrón de coordinación sugiere una operación organizada, no un actor individual.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "auto_classified",
    artifacts: [
      { type: "handle",  value: "RBX_ProGifter / RBX_FreeRobux22 / RBX_BFF_Gamer",  confidence: 88, description: "3 de las 5 cuentas identificadas — todas creadas en la misma semana con nombres aspiracionales" },
      { type: "keyword", value: "Robux gratis / te regalo skin / agrega tu WhatsApp para el regalo", confidence: 90, description: "Texto detonante — oferta de artículos virtuales condicionada a datos personales" },
      { type: "url",     value: "hxxps://robux-gift-mx[.]com/claim",                confidence: 85, description: "URL de sitio phishing para 'reclamar regalo' — captura datos del menor" },
      { type: "domain",  value: "robux-gift-mx[.]com",                             confidence: 87, description: "Dominio de phishing registrado hace 14 días — sin WHOIS público" },
      { type: "ip",      value: "185.xxx.xxx.74",                                  confidence: 75, description: "IP compartida por 3 de las 5 cuentas — indica infraestructura coordinada" },
    ],
    investigation: {
      findings: "Las 5 cuentas presentan patrones de creación sincronizada (misma semana), una estrategia de aproximación idéntica (oferta de artículos virtuales → preguntas personales → solicitud de datos externos) y comparten al menos parcialmente la misma infraestructura de IP. El sitio de phishing vinculado replica la interfaz de Roblox y solicita nombre, correo y número de teléfono del menor para 'recibir el regalo'. La coordinación entre cuentas y la infraestructura compartida sugieren una operación organizada.",
      correlatedEvidence: [
        "Dominio robux-gift-mx[.]com registrado 2 semanas antes de la actividad detectada — preparación previa",
        "IP 185.xxx.xxx.74 asociada a campaña similar en Minecraft detectada en marzo 2026 (informe LG-2026-031)",
        "Patrón de 'regalo de artículos virtuales a cambio de datos' documentado en alerta de INTERPOL sobre captación digital infantil",
      ],
      observedSignals: [
        "5 cuentas creadas en la misma semana con nombres diseñados para parecer generosas/confiables",
        "Secuencia idéntica de aproximación en las 5 cuentas — indica script coordinado",
        "IP compartida entre 3 cuentas — infraestructura unificada",
        "Sitio phishing activo con 47 visitas en 24 horas",
      ],
      riskVector: "Operación coordinada de captación de datos personales de menores mediante ingeniería social en plataforma de videojuegos. El robo de datos puede ser el objetivo final o un paso previo para otras formas de explotación. Riesgo ampliado por la edad de las víctimas (10–12 años).",
      recommendation: "1. Reportar las 5 cuentas a Roblox Trust & Safety con evidencia de coordinación. 2. Solicitar takedown del dominio robux-gift-mx[.]com. 3. Notificar a Ciberpolicía Nacional sobre la operación coordinada. 4. Alertar a padres/tutores de los perfiles expuestos.",
    },
    timeline: [
      { time: "2026-04-25T14:45Z", title: "Detección de red coordinada",   description: "LG-Roblox-Monitor detecta patrón de comportamiento sincronizado en 5 cuentas.", status: "completed" },
      { time: "2026-04-25T14:52Z", title: "Clasificación automática",       description: "LayersCore-Guardian-v1 clasifica como red coordinada. Confianza: 83%. Severidad: Alta.", status: "completed" },
      { time: "2026-04-25T15:00Z", title: "Caso LG-CTI-004 creado",         description: "Caso en cola — sin analista asignado. Prioridad alta.", status: "completed" },
      { time: "2026-04-25T15:57Z", title: "Pendiente de asignación",        description: "Caso en espera. Analistas en casos de mayor prioridad.", status: "active" },
      { time: "Pendiente",         title: "Revisión humana",                description: "Asignación pendiente a analista disponible.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety Roblox + Ciberpolicía Nacional",
      status: "not_escalated",
      sla: "12 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-005",
    source: "layers_guard",
    platform: "telegram",
    accountHandle: "@unknown_anon_99",
    userContext: "perfil protegido — menor 16 años",
    approximateLocation: "CDMX — Delegación Benito Juárez (estimado)",
    sourceIp: "189.xxx.xxx.221",
    riskType: "Intento de migración a canal privado no monitoreable",
    severity: "high",
    status: "in_review",
    confidence: 86,
    timestamp: "2026-04-25T13:30:00Z",
    summary: "Layers Guard detectó un intento de migración de conversación desde Instagram hacia un grupo privado de Telegram por parte de una cuenta sin historial verificable. La cuenta @unknown_anon_99 empleó urgencia artificial, promesas vagas de 'algo especial' y presión para actuar antes de que 'el tiempo se acabe'. El patrón es consistente con intentos de mover a menores hacia canales sin moderación ni registro.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",  value: "@unknown_anon_99",                                 confidence: 93, description: "Cuenta de Telegram con configuración de privacidad máxima — sin foto, sin bio, sin historial" },
      { type: "url",     value: "hxxps://t.me/+invitacion_privada_especial",        confidence: 94, description: "Enlace de grupo privado de Telegram enviado repetidamente — grupo sin nombre público" },
      { type: "keyword", value: "entra antes de que cierre / solo para elegidos / nadie más sabe", confidence: 89, description: "Frases de urgencia y exclusividad — técnica de presión social" },
      { type: "ip",      value: "189.xxx.xxx.221",                                  confidence: 77, description: "IP aproximada — CDMX, Telmex. Posible uso de VPN (localización estimada)" },
    ],
    investigation: {
      findings: "La cuenta @unknown_anon_99 fue creada recientemente (sin historial verificable) y contactó al menor directamente en Instagram antes de intentar la migración a Telegram. El uso de un grupo privado sin nombre es una táctica conocida para evitar la moderación automática de las plataformas. Las frases de urgencia y exclusividad son técnicas de ingeniería social documentadas en campañas de captación de menores. El enlace de Telegram no permite análisis del contenido del grupo sin unirse.",
      correlatedEvidence: [
        "Patrón de 'migración de plataforma pública a canal privado' documentado en 3 casos previos de LG en los últimos 60 días",
        "Técnica de urgencia artificial identificada como marcador de actor experimentado — no primera operación",
      ],
      observedSignals: [
        "Cuenta creada recientemente sin historial verificable — posible cuenta desechable",
        "Contacto iniciado en Instagram y migrado inmediatamente a Telegram",
        "4 mensajes en 2 horas con el mismo enlace — presión recurrente",
        "Enlace a grupo privado sin nombre — evasión de moderación",
      ],
      riskVector: "Intento activo de mover a un menor hacia un espacio sin moderación ni registro. Una vez en el grupo privado, el contenido y las interacciones quedan fuera del alcance de los sistemas de protección de Layers Guard.",
      recommendation: "1. Bloquear el enlace de Telegram identificado en el perfil protegido. 2. Notificar a los tutores del menor. 3. Reportar la cuenta a Instagram y Telegram Trust & Safety. 4. Monitorear si el menor accede al grupo desde otro dispositivo.",
    },
    timeline: [
      { time: "2026-04-25T11:00Z", title: "Primer intento de migración",   description: "LG detecta enlace de Telegram enviado desde @unknown_anon_99 en Instagram.", status: "completed" },
      { time: "2026-04-25T13:00Z", title: "Patrón de presión recurrente",  description: "4 mensajes con el mismo enlace en 2 horas — clasificado como patrón de presión.", status: "completed" },
      { time: "2026-04-25T13:30Z", title: "Caso LG-CTI-005 creado",        description: "Asignado a Carlos M. para revisión.", status: "completed" },
      { time: "2026-04-25T16:10Z", title: "En revisión humana",            description: "Carlos M. analiza el contexto completo y coordina notificación a tutores.", status: "active" },
      { time: "Pendiente",         title: "Notificación a tutores",        description: "Activar protocolo de notificación a padres/tutores del perfil protegido.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG + Trust & Safety Telegram",
      status: "not_escalated",
      sla: "6 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-006",
    source: "layers_guard",
    platform: "whatsapp",
    accountHandle: "+52 1 55 XXXX XXXX",
    userContext: "perfil protegido — menor 14 años",
    approximateLocation: "CDMX — Zona norte (estimado)",
    sourceIp: "No disponible — mensajería cifrada",
    riskType: "Manipulación emocional persistente",
    severity: "high",
    status: "in_progress",
    confidence: 91,
    timestamp: "2026-04-25T11:00:00Z",
    summary: "Layers Guard detectó una secuencia de mensajes en WhatsApp con indicadores de manipulación emocional deliberada. El contacto desconocido utilizó frases de dependencia afectiva, urgencia para responder y solicitudes de secreto hacia familiares. El patrón es consistente con una fase activa de construcción de control emocional sobre el menor, técnica precursora de diversas formas de explotación digital.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "human_validated",
    artifacts: [
      { type: "handle",  value: "+52 1 55 XXXX XXXX (número no registrado)", confidence: 88, description: "Número de WhatsApp no registrado en contactos del menor — desconocido, sin historial" },
      { type: "keyword", value: "necesito que me respondas / si no contestas es porque no te importo / no le digas a nadie", confidence: 95, description: "Frases de presión emocional, dependencia y solicitud de secreto — indicadores de manipulación" },
      { type: "keyword", value: "tú eres diferente a los demás / me entiendes mejor que mi familia", confidence: 92, description: "Frases de validación exclusiva y triangulación familiar — técnica de aislamiento" },
    ],
    investigation: {
      findings: "Los mensajes analizados presentan un patrón de manipulación emocional en tres dimensiones: (1) Presión de respuesta — mensajes que crean urgencia y culpa si el menor no responde inmediatamente; (2) Dependencia afectiva — lenguaje que posiciona al actor como figura emocional central; (3) Secreto — solicitudes explícitas de no compartir la conversación con familiares. Este patrón es un precursor documentado de grooming, explotación emocional y coerción digital.",
      correlatedEvidence: [
        "Patrón de 'urgencia + secreto + dependencia' identificado en 4 casos previos de LG en los últimos 90 días",
        "El número no registrado sugiere un número desechable o de tarjeta SIM anónima — práctica de actores con experiencia",
      ],
      observedSignals: [
        "23 mensajes en 6 horas — frecuencia de contacto anormalmente alta",
        "Solicitud de secreto hacia familiares en 4 mensajes — indicador de alerta alto",
        "Frases de culpabilización cuando el menor no responde",
        "Número no registrado — actor oculta su identidad",
      ],
      riskVector: "Manipulación emocional activa con técnicas de aislamiento y dependencia. Sin intervención, el patrón puede progresar hacia explotación emocional, coerción para compartir contenido íntimo o preparación para encuentro físico.",
      recommendation: "1. Notificar INMEDIATAMENTE a los padres/tutores del menor. 2. Activar protocolo de soporte emocional del Equipo Respuesta LG. 3. Instruir al menor sobre cómo responder de forma segura. 4. Bloquear el número en el dispositivo. 5. Reportar a Ciberpolicía si se sospecha identidad de mayor de edad.",
    },
    timeline: [
      { time: "2026-04-25T08:00Z", title: "Primera detección de presión",   description: "LG detecta mensajes con indicadores de urgencia y culpabilización.", status: "completed" },
      { time: "2026-04-25T11:00Z", title: "Patrón confirmado",               description: "23 mensajes en 6 horas — LayersCore-Guardian clasifica como manipulación emocional activa. Confianza: 91%.", status: "completed" },
      { time: "2026-04-25T11:30Z", title: "Validación humana",               description: "Ana G. confirma el patrón de manipulación. Caso en proceso.", status: "completed" },
      { time: "2026-04-25T15:44Z", title: "Coordinando notificación",        description: "Ana G. prepara la notificación a tutores del menor y el informe para Ciberpolicía.", status: "active" },
      { time: "Pendiente",         title: "Notificación a tutores",          description: "Contacto directo con los padres/tutores del perfil protegido.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG + Ciberpolicía Nacional",
      status: "pending",
      sla: "4 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-007",
    source: "layers_guard",
    platform: "instagram",
    accountHandle: "@regalo_especial_mx",
    userContext: "perfil protegido — menor 15 años",
    approximateLocation: "Nacional — perfil sin geolocalización específica",
    sourceIp: "104.xxx.xxx.18",
    riskType: "Señales de coerción digital",
    severity: "medium",
    status: "open",
    confidence: 79,
    timestamp: "2026-04-24T18:00:00Z",
    summary: "Layers Guard detectó mensajes en Instagram con indicadores de coerción: la cuenta @regalo_especial_mx presionó a un menor para compartir su ubicación y fotografías personales bajo insinuaciones veladas de consecuencias negativas en caso de negativa. El nivel de confianza del modelo es medio-alto; se requiere revisión humana para confirmar la clasificación y determinar el nivel real de riesgo.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "auto_classified",
    artifacts: [
      { type: "handle",  value: "@regalo_especial_mx",                    confidence: 88, description: "Cuenta de Instagram — 890 seguidores, actividad concentrada en DMs a perfiles de menores" },
      { type: "keyword", value: "si no me mandas / ya verás / no te va a gustar lo que pasa", confidence: 84, description: "Frases con amenaza velada e insinuación de consecuencias — indicadores de coerción" },
      { type: "ip",      value: "104.xxx.xxx.18",                         confidence: 72, description: "IP aproximada — posiblemente proxy/VPN, geolocalización no confiable" },
      { type: "keyword", value: "mándame tu ubicación / nadie lo va a saber", confidence: 81, description: "Solicitud de datos de localización con promesa de secreto" },
    ],
    investigation: {
      findings: "Los mensajes analizados presentan indicadores de coerción en nivel inicial: solicitudes de información personal (ubicación, fotografías) combinadas con insinuaciones de consecuencias negativas ante la negativa. La confianza del modelo es del 79% — más baja que en casos confirmados de grooming — porque el lenguaje es ambiguo y podría ser interpretado como agresividad adolescente entre pares. La revisión humana es esencial para distinguir entre coerción de adulto a menor versus conflicto entre iguales.",
      correlatedEvidence: [
        "Cuenta @regalo_especial_mx sin publicaciones públicas — perfil diseñado exclusivamente para DMs",
        "Uso de proxy/VPN sugiere intención de ocultar identidad real",
      ],
      observedSignals: [
        "Cuenta sin publicaciones — perfil de 'solo DMs', indicador de actividad encubierta",
        "Frases con amenaza velada — sin amenaza explícita directa",
        "Solicitud de ubicación y fotografías en el mismo mensaje",
        "IP con posible uso de VPN — intento de anonimato",
      ],
      riskVector: "Posible coerción digital en fase temprana o agresión entre iguales — requiere validación humana para determinar el nivel de riesgo real y el tipo de actor.",
      recommendation: "1. Revisión humana de la secuencia completa para determinar si el actor es un adulto o un menor. 2. Si se confirma adulto con intención de coerción: escalar a Ciberpolicía. 3. En cualquier caso: notificar a tutores y activar soporte del Equipo Respuesta LG.",
    },
    timeline: [
      { time: "2026-04-24T17:42Z", title: "Señal de coerción detectada",  description: "LG detecta frases con indicadores de amenaza velada y solicitud de datos personales.", status: "completed" },
      { time: "2026-04-24T18:00Z", title: "Caso LG-CTI-007 creado",       description: "Asignado a Laura T. Confianza: 79% — revisión humana requerida.", status: "completed" },
      { time: "2026-04-25T15:30Z", title: "Pendiente de revisión",        description: "Laura T. revisando secuencia completa para determinar tipo de actor.", status: "active" },
      { time: "Pendiente",         title: "Clasificación definitiva",     description: "Confirmar si el actor es adulto o menor — determina el protocolo de respuesta.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG + Ciberpolicía (si se confirma adulto)",
      status: "not_escalated",
      sla: "12 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "LG-CTI-008",
    source: "layers_guard",
    platform: "youtube",
    accountHandle: "Múltiples canales no verificados",
    userContext: "perfil protegido — menor 11 años",
    approximateLocation: "No determinable — plataforma de streaming",
    sourceIp: "No aplicable — contenido público",
    riskType: "Exposición a contenido de riesgo normalizado",
    severity: "medium",
    status: "closed",
    confidence: 85,
    timestamp: "2026-04-23T09:00:00Z",
    summary: "Caso resuelto. Layers Guard detectó exposición reiterada de un perfil protegido de 11 años a contenido en YouTube y plataformas web que normalizaba relaciones adulto-menor y comportamientos de riesgo. Se identificaron 23 videos en 4 horas de navegación. Se tomaron acciones de control parental y se notificó a los tutores. El contenido fue reportado a YouTube y bloqueado en el dispositivo del menor.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "human_validated",
    artifacts: [
      { type: "url",     value: "hxxps://youtube[.]com/watch?v=xxxxx1 (bloqueada)", confidence: 91, description: "Video normalización de relaciones con adultos — 2.3M vistas, reportado y eliminado" },
      { type: "url",     value: "hxxps://youtube[.]com/watch?v=xxxxx2 (bloqueada)", confidence: 89, description: "Video con lenguaje de grooming presentado como 'consejos de amor' — reportado" },
      { type: "domain",  value: "teen-tips-mx[.]com",                              confidence: 83, description: "Sitio con artículos que normalizan contacto adulto-menor — reportado a Trust & Safety" },
      { type: "keyword", value: "23 videos con patrón de normalización en 4 horas", confidence: 85, description: "Indicador de exposición intensiva — sistema de recomendación de YouTube amplificó el contenido" },
    ],
    investigation: {
      findings: "La exposición del menor al contenido de riesgo fue amplificada por el algoritmo de recomendación de YouTube: un video inicial de bajo riesgo derivó en 22 videos adicionales con contenido progresivamente más problemático en un período de 4 horas. El patrón sugiere que el algoritmo no está adecuadamente calibrado para perfiles de menores en esta franja de edad. Todos los videos fueron reportados a YouTube; 18 de 23 fueron eliminados dentro de las 24 horas siguientes.",
      correlatedEvidence: [
        "Patrón de amplificación algorítmica de contenido de riesgo documentado en informe Layers Guard Q1 2026",
        "Dominio teen-tips-mx[.]com activo en 3 casos previos de exposición a contenido de riesgo (enero-marzo 2026)",
      ],
      observedSignals: [
        "23 videos con patrón de normalización en 4 horas — amplificación algorítmica confirmada",
        "Tiempo de exposición total estimado: 3.5 horas continuas",
        "El menor no tenía bloqueador de contenido activo en el dispositivo — gap de configuración parental",
      ],
      riskVector: "Exposición pasiva a contenido que normaliza comportamientos de riesgo. Sin ser una amenaza directa de un actor externo, la exposición repetida puede afectar la percepción del menor sobre lo que es normal en las relaciones con adultos.",
      recommendation: "RESUELTO — Acciones tomadas: (1) Activación de restricciones de contenido en el dispositivo del menor; (2) Notificación y orientación a padres/tutores; (3) Reporte de 23 videos a YouTube Trust & Safety (18 eliminados); (4) Bloqueo del dominio teen-tips-mx[.]com en el dispositivo.",
    },
    timeline: [
      { time: "2026-04-23T08:30Z", title: "Exposición inicial detectada",   description: "LG detecta el primer video de contenido de riesgo en el historial de navegación.", status: "completed" },
      { time: "2026-04-23T09:00Z", title: "Patrón de amplificación",        description: "23 videos en 4 horas — LayersCore-Guardian clasifica como exposición de riesgo. Caso creado.", status: "completed" },
      { time: "2026-04-23T10:00Z", title: "Notificación a tutores",         description: "Carlos M. notificó a los padres/tutores del menor con guía de acción.", status: "completed" },
      { time: "2026-04-23T11:00Z", title: "Controles parentales activados", description: "Restricciones de contenido activadas en el dispositivo. Dominio bloqueado.", status: "completed" },
      { time: "2026-04-23T12:00Z", title: "Reporte a YouTube",              description: "23 videos reportados a YouTube Trust & Safety. 18 eliminados en 24 horas.", status: "completed" },
      { time: "2026-04-25T10:00Z", title: "Caso cerrado",                   description: "Todas las acciones completadas. Seguimiento residual de 30 días activado.", status: "completed" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety YouTube",
      status: "resolved",
      sla: "Completado",
      lastSent: "2026-04-23T12:00Z",
      reportsSent: 1,
    },
  },
  // ── Guard Event Detail Cases ──────────────────────────────────────────────────
  {
    id: "g1",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "@vida_facil_92",
    userContext: "perfil protegido — menor 14 años",
    approximateLocation: "Zona metropolitana de CDMX",
    sourceIp: "189.203.xxx.41",
    riskType: "Campaña de reclutamiento clandestina — señal de ingesta",
    severity: "critical",
    status: "open",
    confidence: 94,
    timestamp: "2026-04-25T16:42:00Z",
    summary: "Señal de ingesta directa de Layers Guard — caso completo en LG-CTI-001. Layers Guard detectó 6 mensajes directos con patrón de reclutamiento enviados desde @vida_facil_92 hacia el perfil protegido. La señal fue auto-clasificada como campaña de reclutamiento clandestina con confianza del 94%.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",  value: "@vida_facil_92",                       confidence: 97, description: "Cuenta origen — ver caso LG-CTI-001 para análisis completo" },
      { type: "url",     value: "hxxps://t.me/invite_trabajo_especial", confidence: 95, description: "Enlace externo incluido en los 6 mensajes" },
      { type: "keyword", value: "trabajo fácil gana $200 diarios sin experiencia", confidence: 91, description: "Texto detonante del modelo de detección de reclutamiento" },
    ],
    investigation: {
      findings: "Señal de ingesta vinculada al caso LG-CTI-001. Ver ese caso para la investigación completa.",
      correlatedEvidence: ["Ver caso LG-CTI-001 para análisis detallado"],
      observedSignals: ["6 mensajes con patrón de reclutamiento en < 2 horas", "Enlace de Telegram en todos los mensajes"],
      riskVector: "Captación activa de menor — ver LG-CTI-001.",
      recommendation: "Revisar y actuar sobre el caso LG-CTI-001 para respuesta completa.",
    },
    timeline: [
      { time: "2026-04-25T16:42Z", title: "Señal detectada",            description: "LG-TikTok-Monitor detecta 6 mensajes con patrón de reclutamiento. Vinculado a LG-CTI-001.", status: "completed" },
      { time: "Pendiente",         title: "Acción en caso LG-CTI-001", description: "Ver caso LG-CTI-001 para seguimiento.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety TikTok + Ciberpolicía (ver LG-CTI-001)",
      status: "not_escalated",
      sla: "4 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "g2",
    source: "layers_guard",
    platform: "instagram",
    accountHandle: "@adventures_mx_pro",
    userContext: "perfil protegido — menor 13 años",
    approximateLocation: "Área metropolitana de Monterrey",
    sourceIp: "187.xxx.xxx.89",
    riskType: "Grooming activo — señal de ingesta crítica",
    severity: "critical",
    status: "escalated",
    confidence: 97,
    timestamp: "2026-04-25T16:38:00Z",
    summary: "Señal de ingesta crítica — caso LG-CTI-002 escalado a FGR. Layers Guard detectó continuación de la secuencia de grooming activo por @adventures_mx_pro. El caso ya fue escalado a FGR — FEADLE y Ciberpolicía Nacional. Esta señal registra la actividad más reciente del actor.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "human_validated",
    artifacts: [
      { type: "handle",  value: "@adventures_mx_pro",                         confidence: 99, description: "Cuenta origen — 21 días de contacto progresivo con menor de 13 años" },
      { type: "keyword", value: "secuencia de grooming — 5 fases identificadas", confidence: 99, description: "Todas las fases del ciclo de grooming confirmadas por analista humano" },
    ],
    investigation: {
      findings: "Señal adicional vinculada al caso LG-CTI-002 — escalado a FGR con expediente FGR-2026-0892. Ver ese caso para la investigación y acciones completas.",
      correlatedEvidence: ["Ver caso LG-CTI-002 — grooming confirmado, FGR notificado"],
      observedSignals: ["Actividad continua del actor — no ha cesado el contacto"],
      riskVector: "Grooming activo en etapa avanzada — ver LG-CTI-002.",
      recommendation: "Ver LG-CTI-002. FGR investigando. Coordinar bloqueo de cuentas con Instagram Trust & Safety.",
    },
    timeline: [
      { time: "2026-04-25T16:38Z", title: "Nueva señal del actor",       description: "LG detecta actividad continua de @adventures_mx_pro — vinculado a LG-CTI-002.", status: "completed" },
      { time: "2026-04-25T16:40Z", title: "Incorporado a LG-CTI-002",   description: "Señal agregada al expediente del caso activo. FGR ya notificado.", status: "active" },
    ],
    escalation: {
      suggestedPartner: "FGR — FEADLE (ver LG-CTI-002)",
      status: "acknowledged",
      sla: "Inmediato",
      lastSent: "2026-04-25T16:38Z",
      reportsSent: 1,
    },
  },
  {
    id: "g3",
    source: "layers_guard",
    platform: "discord",
    accountHandle: "GamerXYZ#7823",
    userContext: "perfil protegido — menor 15 años",
    approximateLocation: "Guadalajara, Jalisco (estimado)",
    sourceIp: "201.xxx.xxx.112",
    riskType: "Contacto sospechoso con manipulación emocional — señal de ingesta",
    severity: "high",
    status: "in_progress",
    confidence: 88,
    timestamp: "2026-04-25T16:21:00Z",
    summary: "Señal de ingesta de Layers Guard — vinculada al caso LG-CTI-003 en investigación. La cuenta GamerXYZ#7823 realizó 14 interacciones en 48 horas con lenguaje de dependencia emocional y solicitud de canal privado. Laura T. está analizando el caso activamente.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",  value: "GamerXYZ#7823",                              confidence: 96, description: "Cuenta de Discord — ver caso LG-CTI-003" },
      { type: "keyword", value: "tus amigos no te valoran / yo sí te entiendo", confidence: 92, description: "Frases detonantes de manipulación emocional" },
    ],
    investigation: {
      findings: "Señal de ingesta vinculada a LG-CTI-003 en investigación activa. Ver ese caso para análisis completo.",
      correlatedEvidence: ["Ver caso LG-CTI-003"],
      observedSignals: ["14 interacciones en 48 horas", "Lenguaje de dependencia emocional", "Invitación a canal privado"],
      riskVector: "Contacto sospechoso en fase temprana — ver LG-CTI-003.",
      recommendation: "Revisar LG-CTI-003 para respuesta.",
    },
    timeline: [
      { time: "2026-04-25T16:21Z", title: "Señal detectada",          description: "LG-Discord-Monitor detecta patrón de contacto sospechoso. Vinculado a LG-CTI-003.", status: "completed" },
      { time: "Pendiente",         title: "Acción en LG-CTI-003",    description: "Ver caso LG-CTI-003 para seguimiento.", status: "pending" },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety Discord + Equipo Respuesta LG (ver LG-CTI-003)",
      status: "not_escalated",
      sla: "8 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
  {
    id: "g4",
    source: "layers_guard",
    platform: "telegram",
    accountHandle: "@unknown_anon_99",
    userContext: "perfil protegido — menor 16 años",
    approximateLocation: "CDMX (estimado)",
    sourceIp: "189.xxx.xxx.221",
    riskType: "Migración a canal privado — señal de ingesta",
    severity: "high",
    status: "in_review",
    confidence: 86,
    timestamp: "2026-04-25T16:10:00Z",
    summary: "Señal de ingesta de Layers Guard — vinculada al caso LG-CTI-005 en revisión. Se detectó el enlace de grupo privado de Telegram enviado por @unknown_anon_99 al perfil protegido desde Instagram. Carlos M. está coordinando la notificación a tutores.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    artifacts: [
      { type: "handle",  value: "@unknown_anon_99",                           confidence: 93, description: "Cuenta sin historial — ver caso LG-CTI-005" },
      { type: "url",     value: "hxxps://t.me/+invitacion_privada_especial", confidence: 94, description: "Enlace de grupo privado de Telegram — canal no monitoreable" },
    ],
    investigation: {
      findings: "Señal de ingesta vinculada a LG-CTI-005 en revisión. Ver ese caso para detalles.",
      correlatedEvidence: ["Ver caso LG-CTI-005"],
      observedSignals: ["Enlace de Telegram enviado 4 veces en 2 horas", "Cuenta sin historial verificable"],
      riskVector: "Intento de migración a canal no monitoreable — ver LG-CTI-005.",
      recommendation: "Revisar LG-CTI-005 para acciones.",
    },
    timeline: [
      { time: "2026-04-25T16:10Z", title: "Señal detectada",          description: "LG detecta nuevo intento de migración vinculado a LG-CTI-005.", status: "completed" },
      { time: "2026-04-25T16:10Z", title: "Incorporado a LG-CTI-005", description: "Señal agregada al caso en revisión activa.", status: "active" },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG (ver LG-CTI-005)",
      status: "not_escalated",
      sla: "6 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },
];
