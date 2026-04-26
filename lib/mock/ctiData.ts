// ── Types ─────────────────────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type ArtifactType = "ip" | "domain" | "hash" | "url" | "email";
export type CaseStatus = "open" | "in_progress" | "escalated" | "closed";
export type PartnerStatus = "active" | "pending" | "resolved";
export type Platform = "social" | "darkweb" | "paste" | "telegram" | "forum";

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

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSeverityConfig(s: Severity) {
  const map: Record<Severity, { label: string; bg: string; text: string; ring: string; dot: string }> = {
    critical: { label: "Crítico",  bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-200",    dot: "#ef4444" },
    high:     { label: "Alto",     bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200", dot: "#f97316" },
    medium:   { label: "Medio",    bg: "bg-amber-50",  text: "text-amber-700",  ring: "ring-amber-200",  dot: "#f59e0b" },
    low:      { label: "Bajo",     bg: "bg-blue-50",   text: "text-blue-700",   ring: "ring-blue-200",   dot: "#3b82f6" },
    info:     { label: "Info",     bg: "bg-slate-50",  text: "text-slate-600",  ring: "ring-slate-200",  dot: "#94a3b8" },
  };
  return map[s];
}

export function getStatusConfig(s: CaseStatus) {
  const map: Record<CaseStatus, { label: string; bg: string; text: string }> = {
    open:        { label: "Abierto",      bg: "bg-red-50",    text: "text-red-700"    },
    in_progress: { label: "En proceso",   bg: "bg-amber-50",  text: "text-amber-700"  },
    escalated:   { label: "Escalado",     bg: "bg-purple-50", text: "text-purple-700" },
    closed:      { label: "Cerrado",      bg: "bg-green-50",  text: "text-green-700"  },
  };
  return map[s];
}

export function getPlatformConfig(p: Platform) {
  const map: Record<Platform, { label: string; color: string }> = {
    social:   { label: "Redes Sociales", color: "#3b82f6" },
    darkweb:  { label: "Dark Web",       color: "#8b5cf6" },
    paste:    { label: "Pastebin",       color: "#f97316" },
    telegram: { label: "Telegram",       color: "#06b6d4" },
    forum:    { label: "Foros",          color: "#10b981" },
  };
  return map[p];
}

export function getCaseDetail(id: string): CaseDetail | undefined {
  return caseDetails.find((c) => c.id === id);
}

// ── Mock data ─────────────────────────────────────────────────────────────────

export const ctiMetrics: CTIMetric[] = [
  { id: "iocs",       label: "IOCs Activos",          value: 1_284, delta: "+47", deltaUp: true,  sub: "últimas 24 h" },
  { id: "alerts",     label: "Alertas Críticas",      value: 38,    delta: "+12", deltaUp: true,  sub: "sin atender" },
  { id: "cases",      label: "Casos Abiertos",        value: 91,    delta: "-5",  deltaUp: false, sub: "en investigación" },
  { id: "guard",      label: "Eventos Layers Guard",  value: 4_720, delta: "+380",deltaUp: true,  sub: "ingestados hoy" },
  { id: "escalated",  label: "Escalados a Socios",    value: 14,    delta: "+3",  deltaUp: true,  sub: "pendientes resp." },
  { id: "resolved",   label: "Resueltos (7 d)",       value: 203,   delta: "+28", deltaUp: true,  sub: "tasa 94 %" },
];

export const severityDistribution: SeverityBucket[] = [
  { severity: "critical", count: 38,  pct: 10 },
  { severity: "high",     count: 117, pct: 30 },
  { severity: "medium",   count: 154, pct: 40 },
  { severity: "low",      count: 62,  pct: 16 },
  { severity: "info",     count: 15,  pct: 4  },
];

export const layersGuardEvents: GuardEvent[] = [
  { id: "g1",  timestamp: "2026-04-25T08:42:00Z", platform: "darkweb",  source: "Forum XYZ",       snippet: "Credenciales de usuario de institución financiera en venta — lote de 2,400 registros.",    severity: "critical", processed: false },
  { id: "g2",  timestamp: "2026-04-25T08:39:00Z", platform: "telegram", source: "Canal @mexleaks", snippet: "Se detectó la publicación de datos personales de menores con CURP y fotografías.",            severity: "critical", processed: false },
  { id: "g3",  timestamp: "2026-04-25T08:31:00Z", platform: "paste",    source: "Pastebin",        snippet: "Hash SHA-256 de malware inédito vinculado a campaña de ransomware en LATAM.",               severity: "high",     processed: false },
  { id: "g4",  timestamp: "2026-04-25T08:22:00Z", platform: "darkweb",  source: "Marketplace A",   snippet: "Acceso RDP a servidor gubernamental ofertado por USD 800.",                                severity: "high",     processed: true  },
  { id: "g5",  timestamp: "2026-04-25T08:18:00Z", platform: "forum",    source: "Hack Forum MX",   snippet: "Tutorial para explotar CVE-2024-3400 en dispositivos PAN-OS activos en México.",           severity: "high",     processed: false },
  { id: "g6",  timestamp: "2026-04-25T08:05:00Z", platform: "social",   source: "Twitter/X",       snippet: "Campaña de phishing suplantando al SAT con 340 dominios activos identificados.",           severity: "medium",   processed: true  },
  { id: "g7",  timestamp: "2026-04-25T07:57:00Z", platform: "telegram", source: "Canal @extortmx", snippet: "Actor de amenaza anuncia ataque coordinado contra empresa del sector energético.",          severity: "high",     processed: false },
  { id: "g8",  timestamp: "2026-04-25T07:45:00Z", platform: "darkweb",  source: "Breach DB",       snippet: "Base de datos con 18,000 registros de plataforma de e-commerce nacional.",                 severity: "medium",   processed: true  },
  { id: "g9",  timestamp: "2026-04-25T07:30:00Z", platform: "paste",    source: "Pastebin",        snippet: "Lista de IPs de infraestructura crítica con puertos expuestos y versiones de servicio.",   severity: "medium",   processed: false },
  { id: "g10", timestamp: "2026-04-25T07:12:00Z", platform: "forum",    source: "CrimeNet",        snippet: "Script de extracción automatizada de datos de portales bancarios MX publicado.",           severity: "high",     processed: false },
];

export const artifacts: Artifact[] = [
  { id: "a1",  type: "ip",     value: "185.220.101.47",                              severity: "critical", firstSeen: "2026-04-20", lastSeen: "2026-04-25", hits: 142, tags: ["C2", "Ransomware"] },
  { id: "a2",  type: "domain", value: "sat-portal-verificacion[.]mx",                severity: "critical", firstSeen: "2026-04-23", lastSeen: "2026-04-25", hits: 89,  tags: ["Phishing", "SAT"] },
  { id: "a3",  type: "hash",   value: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",           severity: "high",     firstSeen: "2026-04-22", lastSeen: "2026-04-25", hits: 34,  tags: ["Malware", "Dropper"] },
  { id: "a4",  type: "url",    value: "hxxp://update-windows[.]net/patch.exe",       severity: "high",     firstSeen: "2026-04-21", lastSeen: "2026-04-24", hits: 27,  tags: ["Downloader"] },
  { id: "a5",  type: "ip",     value: "45.142.212.100",                              severity: "high",     firstSeen: "2026-04-19", lastSeen: "2026-04-25", hits: 61,  tags: ["TOR Exit", "Scanning"] },
  { id: "a6",  type: "email",  value: "soporte-sat@servicio-verificacion[.]com",     severity: "medium",   firstSeen: "2026-04-24", lastSeen: "2026-04-25", hits: 18,  tags: ["Phishing"] },
  { id: "a7",  type: "domain", value: "bbva-seguridad-mx[.]com",                     severity: "medium",   firstSeen: "2026-04-23", lastSeen: "2026-04-25", hits: 45,  tags: ["Phishing", "Banking"] },
  { id: "a8",  type: "hash",   value: "f1e2d3c4b5a6978869504132241516f0",           severity: "medium",   firstSeen: "2026-04-18", lastSeen: "2026-04-22", hits: 12,  tags: ["Spyware"] },
];

export const partners: Partner[] = [
  { id: "p1", name: "CERT-MX",          logo: "CM", status: "active",   casesOpen: 5,  lastSync: "hace 3 min",   escalatedToday: 4  },
  { id: "p2", name: "Guardia Nacional", logo: "GN", status: "active",   casesOpen: 8,  lastSync: "hace 12 min",  escalatedToday: 6  },
  { id: "p3", name: "CNBV",            logo: "CB", status: "pending",  casesOpen: 2,  lastSync: "hace 1 h",     escalatedToday: 1  },
  { id: "p4", name: "FGR",             logo: "FG", status: "active",   casesOpen: 3,  lastSync: "hace 7 min",   escalatedToday: 3  },
  { id: "p5", name: "INTERPOL MX",     logo: "IP", status: "resolved", casesOpen: 0,  lastSync: "hace 2 h",     escalatedToday: 0  },
];

export const alertsByHour: AlertsByHour[] = [
  { hour: "00",  critical: 1, high: 3, medium: 5  },
  { hour: "01",  critical: 0, high: 2, medium: 3  },
  { hour: "02",  critical: 1, high: 1, medium: 2  },
  { hour: "03",  critical: 0, high: 2, medium: 4  },
  { hour: "04",  critical: 2, high: 4, medium: 6  },
  { hour: "05",  critical: 1, high: 3, medium: 5  },
  { hour: "06",  critical: 3, high: 6, medium: 8  },
  { hour: "07",  critical: 4, high: 8, medium: 12 },
  { hour: "08",  critical: 6, high: 10,medium: 15 },
  { hour: "09",  critical: 5, high: 9, medium: 14 },
  { hour: "10",  critical: 4, high: 7, medium: 11 },
  { hour: "11",  critical: 3, high: 6, medium: 9  },
  { hour: "12",  critical: 5, high: 8, medium: 13 },
];

export const platformDistribution: PlatformDist[] = [
  { platform: "Dark Web",       value: 38, color: "#8b5cf6" },
  { platform: "Telegram",       value: 27, color: "#06b6d4" },
  { platform: "Redes Sociales", value: 18, color: "#3b82f6" },
  { platform: "Pastebin",       value: 11, color: "#f97316" },
  { platform: "Foros",          value: 6,  color: "#10b981" },
];

export const weeklyTrend: WeeklyTrend[] = [
  { day: "Lun", iocs: 180, alerts: 28 },
  { day: "Mar", iocs: 210, alerts: 32 },
  { day: "Mié", iocs: 195, alerts: 25 },
  { day: "Jue", iocs: 240, alerts: 41 },
  { day: "Vie", iocs: 220, alerts: 35 },
  { day: "Sáb", iocs: 160, alerts: 19 },
  { day: "Dom", iocs: 145, alerts: 22 },
];

export const intelligenceQueue: IntelCase[] = [
  { id: "CTI-001", title: "Campaña de phishing masiva suplantando al SAT",      severity: "critical", status: "open",        platform: "social",   assignee: "Ana G.",    created: "2026-04-25T06:00Z", updated: "2026-04-25T08:40Z", iocCount: 340, tags: ["SAT","Phishing"] },
  { id: "CTI-002", title: "Venta de accesos RDP a infraestructura gubernamental", severity: "critical", status: "escalated",   platform: "darkweb",  assignee: "Carlos M.", created: "2026-04-24T18:00Z", updated: "2026-04-25T08:22Z", iocCount: 12,  tags: ["RDP","Gov"] },
  { id: "CTI-003", title: "Ransomware LATAM — hash inédito detectado",           severity: "high",     status: "in_progress", platform: "paste",    assignee: "Laura T.",  created: "2026-04-25T07:00Z", updated: "2026-04-25T08:31Z", iocCount: 7,   tags: ["Ransomware"] },
  { id: "CTI-004", title: "Datos personales de menores expuestos en Telegram",   severity: "critical", status: "escalated",   platform: "telegram", assignee: "Rodrigo P.",created: "2026-04-25T08:00Z", updated: "2026-04-25T08:39Z", iocCount: 1,   tags: ["CSAM","Menores"] },
  { id: "CTI-005", title: "Script extracción bancaria publicado en foro",        severity: "high",     status: "open",        platform: "forum",    assignee: "Sin asignar",created: "2026-04-25T07:12Z", updated: "2026-04-25T08:10Z", iocCount: 3,   tags: ["Banking","Scraping"] },
  { id: "CTI-006", title: "IP C2 activa vinculada a grupo APT29",                severity: "high",     status: "in_progress", platform: "darkweb",  assignee: "Ana G.",    created: "2026-04-23T10:00Z", updated: "2026-04-25T07:55Z", iocCount: 18,  tags: ["APT29","C2"] },
  { id: "CTI-007", title: "Dominio BBVA falso con certificado válido",           severity: "medium",   status: "open",        platform: "social",   assignee: "Laura T.",  created: "2026-04-24T14:00Z", updated: "2026-04-25T06:30Z", iocCount: 45,  tags: ["Phishing","Banking"] },
  { id: "CTI-008", title: "Explotación CVE-2024-3400 en dispositivos MX",       severity: "high",     status: "closed",      platform: "forum",    assignee: "Carlos M.", created: "2026-04-22T09:00Z", updated: "2026-04-24T20:00Z", iocCount: 22,  tags: ["CVE","PAN-OS"] },
];

export const caseDetails: CaseDetail[] = [
  {
    ...intelligenceQueue[0],
    description: "Se detectaron 340 dominios activos que suplantan los portales del SAT para robar credenciales de contribuyentes. Los dominios usan certificados TLS válidos y redirigen a páginas de pago falsas. Layers Guard detectó la campaña a través de señales en redes sociales y Telegram.",
    artifacts: [artifacts[1], artifacts[5]],
    timeline: [
      { ts: "2026-04-25T06:00Z", actor: "Layers Guard", action: "Detección automática de 340 dominios en monitoreo continuo." },
      { ts: "2026-04-25T06:45Z", actor: "Ana G.",        action: "Caso abierto y asignado a investigación." },
      { ts: "2026-04-25T07:30Z", actor: "Ana G.",        action: "Confirmados 280 dominios activos con certificados válidos." },
      { ts: "2026-04-25T08:15Z", actor: "Sistema",       action: "Notificación enviada al CERT-MX para bloqueo masivo." },
      { ts: "2026-04-25T08:40Z", actor: "CERT-MX",       action: "Acuse de recibo. Proceso de bloqueo iniciado en ISPs." },
    ],
    mitreTactics: ["T1566 - Phishing", "T1583.001 - Acquire Infrastructure: Domains", "T1071 - Application Layer Protocol"],
    recommendation: "Solicitar bloqueo de dominios en ISPs nacionales. Emitir alerta pública a contribuyentes. Compartir lista IOC con CERT-MX y CNBV.",
  },
  {
    ...intelligenceQueue[3],
    description: "Actor de amenaza publicó en un canal de Telegram datos personales de menores de edad incluyendo nombres, CURP y fotografías. Material potencialmente vinculado a red de explotación. Layers Guard activó alerta de máxima prioridad de forma automática.",
    artifacts: [],
    timeline: [
      { ts: "2026-04-25T08:00Z", actor: "Layers Guard", action: "Señal crítica activada — contenido relacionado con menores detectado." },
      { ts: "2026-04-25T08:05Z", actor: "Sistema",       action: "Escalación automática a protocolo de protección de menores." },
      { ts: "2026-04-25T08:10Z", actor: "Rodrigo P.",    action: "Caso tomado. Evidencia preservada con cadena de custodia digital." },
      { ts: "2026-04-25T08:25Z", actor: "Rodrigo P.",    action: "Reporte urgente enviado a FGR y Guardia Nacional." },
      { ts: "2026-04-25T08:39Z", actor: "FGR",           action: "Confirmación de recepción. Investigación abierta." },
    ],
    mitreTactics: ["T1596 - Search Open Technical Databases", "T1530 - Data from Cloud Storage"],
    recommendation: "Coordinar inmediatamente con FGR para investigación penal. Notificar a DIF. Solicitar eliminación del canal a Telegram vía reporte de abuso.",
  },
];
