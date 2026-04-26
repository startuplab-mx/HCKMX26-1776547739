// ── Digital Signals ───────────────────────────────────────────────────────────

export const digitalSignalsMetrics = [
  { id: "ingested",    label: "Señales ingeridas",             value: "8,492", sub: "últimas 24 h"         },
  { id: "sources",     label: "Fuentes activas",               value: "12",    sub: "en línea ahora"       },
  { id: "iocs",        label: "IOCs detectados",               value: "237",   sub: "requieren atención"   },
  { id: "emoji_iocs",  label: "Emoji IOCs detectados",         value: "129",   sub: "patrones semánticos"  },
  { id: "critical",    label: "Señales críticas",              value: "34",    sub: "alta prioridad"       },
  { id: "accounts",    label: "Cuentas monitoreadas",          value: "1,820", sub: "perfiles activos"     },
  { id: "classtime",   label: "Tiempo de clasificación",       value: "<45s",  sub: "promedio Layers Core" },
];

export type SignalSeverity = "critical" | "high" | "medium" | "low";
export type SignalStatus   = "new" | "processing" | "classified" | "archived";
export type SignalType =
  | "keyword_trigger"
  | "suspicious_url"
  | "private_redirect"
  | "coordinated_account"
  | "risky_hashtag"
  | "associated_ip";

export interface DigitalSignal {
  id: string;
  source: "layers_guard" | "osint" | "platform";
  platform: "tiktok" | "instagram" | "discord" | "roblox" | "telegram" | "web" | "youtube" | "whatsapp";
  type: SignalType;
  severity: SignalSeverity;
  confidence: number;
  timestamp: string;
  status: SignalStatus;
  value: string;
}

export const digitalSignalsFeed: DigitalSignal[] = [
  { id: "SIG-001", source: "layers_guard", platform: "tiktok",    type: "keyword_trigger",      severity: "critical", confidence: 94, timestamp: "2026-04-25T08:12:00Z", status: "classified", value: '"trabajo fácil" 🥷 + DM directo detectado' },
  { id: "SIG-002", source: "layers_guard", platform: "instagram",  type: "private_redirect",     severity: "critical", confidence: 91, timestamp: "2026-04-25T08:09:00Z", status: "classified", value: "Redirección a Telegram desde perfil @adventures_mx_pro" },
  { id: "SIG-003", source: "osint",        platform: "discord",    type: "coordinated_account",  severity: "high",     confidence: 87, timestamp: "2026-04-25T07:55:00Z", status: "classified", value: "Cluster de 14 cuentas 🍕 con comportamiento coordinado" },
  { id: "SIG-004", source: "layers_guard", platform: "roblox",     type: "keyword_trigger",      severity: "high",     confidence: 83, timestamp: "2026-04-25T07:42:00Z", status: "processing", value: '"grupo privado" 🪖 + solicitud de contacto externo' },
  { id: "SIG-005", source: "platform",     platform: "tiktok",     type: "risky_hashtag",        severity: "high",     confidence: 79, timestamp: "2026-04-25T07:38:00Z", status: "classified", value: "#dinero_rapido amplificado por red coordinada" },
  { id: "SIG-006", source: "layers_guard", platform: "telegram",   type: "associated_ip",        severity: "high",     confidence: 88, timestamp: "2026-04-25T07:21:00Z", status: "classified", value: "IP 187.211.x.x asociada a 3 cuentas sospechosas" },
  { id: "SIG-007", source: "osint",        platform: "web",        type: "suspicious_url",       severity: "medium",   confidence: 72, timestamp: "2026-04-25T07:05:00Z", status: "classified", value: "hxxp://oferta-trabajo-facil[.]xyz/reg" },
  { id: "SIG-008", source: "layers_guard", platform: "instagram",  type: "keyword_trigger",      severity: "medium",   confidence: 68, timestamp: "2026-04-25T06:59:00Z", status: "new",        value: '"solo tú" + "no le digas a nadie" en DM' },
  { id: "SIG-009", source: "platform",     platform: "youtube",    type: "risky_hashtag",        severity: "medium",   confidence: 65, timestamp: "2026-04-25T06:44:00Z", status: "processing", value: "Comentarios con patrones de reclutamiento en video infantil" },
  { id: "SIG-010", source: "layers_guard", platform: "whatsapp",   type: "private_redirect",     severity: "medium",   confidence: 71, timestamp: "2026-04-25T06:30:00Z", status: "classified", value: "Link a grupo WhatsApp distribuido en Discord" },
  { id: "SIG-011", source: "osint",        platform: "discord",    type: "associated_ip",        severity: "low",      confidence: 55, timestamp: "2026-04-25T06:15:00Z", status: "archived",   value: "IP 201.173.x.x con historial de spam" },
  { id: "SIG-012", source: "layers_guard", platform: "tiktok",     type: "keyword_trigger",      severity: "low",      confidence: 52, timestamp: "2026-04-25T06:02:00Z", status: "archived",   value: '"ubicación" en comentario aislado sin contexto adicional' },
];

export const platformDistributionSignals = [
  { platform: "TikTok",    count: 2841, pct: 33 },
  { platform: "Instagram", count: 2291, pct: 27 },
  { platform: "Discord",   count: 1528, pct: 18 },
  { platform: "Roblox",    count: 1019, pct: 12 },
  { platform: "Telegram",  count: 594,  pct: 7  },
  { platform: "Web / Otros", count: 219, pct: 3  },
];

export const triggerKeywords = [
  "trabajo fácil", "dinero rápido", "mensaje privado", "solo tú",
  "no le digas a nadie", "reclutamiento", "grupo privado",
  "meet privately", "envía foto", "ubicación",
];

export interface TopIOC {
  id: string;
  type: "url" | "ip" | "handle" | "keyword" | "hashtag" | "emoji";
  value: string;
  emojiMeta?: { label: string; meaning: string; category: string };
  severity: SignalSeverity;
  hits: number;
  lastSeen: string;
}

export const topIOCs: TopIOC[] = [
  // Emoji IOCs — sorted by severity, always first
  { id: "ioc-e1", type: "emoji", value: "🥷", emojiMeta: { label: "Ninja",         meaning: "Referencia a operadores o miembros de organización criminal",         category: "Reclutamiento / Identidad"   }, severity: "critical", hits: 312, lastSeen: "hace 2 min"  },
  { id: "ioc-e2", type: "emoji", value: "🪖", emojiMeta: { label: "Casco militar", meaning: "Contenido con personas armadas o estética paramilitar",                category: "Militarización / Violencia"  }, severity: "high",     hits: 198, lastSeen: "hace 8 min"  },
  { id: "ioc-e3", type: "emoji", value: "🍕", emojiMeta: { label: "Pizza",         meaning: "Referencia codificada a organizaciones criminales (ej: chapizza)",    category: "Código / Identidad"          }, severity: "high",     hits: 174, lastSeen: "hace 15 min" },
  { id: "ioc-e4", type: "emoji", value: "🐔", emojiMeta: { label: "Gallo",         meaning: "Asociado a reclutamiento en ciertos grupos",                          category: "Reclutamiento"               }, severity: "high",     hits: 143, lastSeen: "hace 22 min" },
  { id: "ioc-e5", type: "emoji", value: "😈", emojiMeta: { label: "Diablo",        meaning: "Representación de conducta agresiva o criminal",                      category: "Intención"                   }, severity: "medium",   hits: 89,  lastSeen: "hace 38 min" },
  // Standard IOCs
  { id: "ioc-001", type: "handle",  value: "@vida_facil_92",                        severity: "critical", hits: 142, lastSeen: "hace 12 min" },
  { id: "ioc-002", type: "url",     value: "hxxp://oferta-trabajo-facil[.]xyz",     severity: "critical", hits: 98,  lastSeen: "hace 28 min" },
  { id: "ioc-003", type: "ip",      value: "187.211.43.x",                          severity: "high",     hits: 77,  lastSeen: "hace 45 min" },
  { id: "ioc-004", type: "keyword", value: "trabajo fácil",                         severity: "high",     hits: 634, lastSeen: "hace 3 min"  },
  { id: "ioc-005", type: "hashtag", value: "#dinero_rapido",                        severity: "high",     hits: 412, lastSeen: "hace 8 min"  },
  { id: "ioc-006", type: "handle",  value: "@adventures_mx_pro",                    severity: "high",     hits: 63,  lastSeen: "hace 1 h"    },
  { id: "ioc-007", type: "url",     value: "hxxp://grupo-especial[.]telegram-mx",   severity: "medium",   hits: 44,  lastSeen: "hace 2 h"    },
  { id: "ioc-008", type: "keyword", value: "grupo privado",                         severity: "medium",   hits: 289, lastSeen: "hace 5 min"  },
];

// ── Reports ───────────────────────────────────────────────────────────────────

export type ReportType     = "executive" | "technical_cti" | "escalation" | "weekly_trend" | "territorial_risk";
export type ReportStatus   = "draft" | "in_review" | "sent" | "archived";
export type ReportSeverity = "critical" | "high" | "medium" | "low";

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  date: string;
  severity: ReportSeverity;
  partner: string;
  status: ReportStatus;
  summary: string;
  findings: string[];
  sources: string[];
  recommendations: string[];
  validationStatus: "auto_generated" | "human_validated" | "pending_review";
}

export const reports: Report[] = [
  {
    id: "LG-REP-024",
    title: "Campaña de reclutamiento digital en plataformas sociales",
    type: "technical_cti",
    date: "2026-04-25T08:00:00Z",
    severity: "critical",
    partner: "Ciberpolicía Nacional",
    status: "sent",
    summary: "Se identificó una campaña activa de reclutamiento clandestino que opera principalmente en TikTok e Instagram, utilizando cuentas coordinadas y palabras clave de bajo perfil para evadir detección automatizada.",
    findings: [
      "14 cuentas coordinadas con patrones de actividad sincronizada detectadas entre el 20 y 25 de abril.",
      "Uso recurrente de términos: 'trabajo fácil', 'grupo privado', 'solo tú' en mensajes directos.",
      "Redirección sistemática hacia canales de Telegram con cifrado extremo a extremo.",
      "Confianza del clasificador Layers Core: 94% — patrón compatible con campaña de reclutamiento.",
    ],
    sources: ["Layers Guard — Monitoreo continuo", "OSINT — Análisis de hashtags", "Reportes de usuarios (plataforma)"],
    recommendations: [
      "Escalamiento inmediato a Ciberpolicía Nacional con evidencia digitalizada.",
      "Solicitud de bloqueo de cuentas coordinadas a equipos Trust & Safety.",
      "Monitoreo intensificado de términos asociados durante los próximos 7 días.",
    ],
    validationStatus: "human_validated",
  },
  {
    id: "CTI-REP-018",
    title: "Red de cuentas coordinadas con redirección a mensajería privada",
    type: "technical_cti",
    date: "2026-04-24T14:30:00Z",
    severity: "critical",
    partner: "FGR — FEADLE",
    status: "sent",
    summary: "Análisis de clúster de cuentas detectado en Discord y Roblox con comportamiento de redirección coordinada hacia grupos de WhatsApp y Telegram fuera del alcance de moderación de las plataformas.",
    findings: [
      "Clúster de 22 cuentas en Discord con menos de 30 días de antigüedad y actividad sincronizada.",
      "Patrón de migración en 3 etapas: contacto inicial → confianza → redirección privada.",
      "IPs asociadas en rango 187.211.x.x con historial de actividad sospechosa.",
      "7 menores identificados como objetivo en el período analizado.",
    ],
    sources: ["Layers Guard — Detección de patrones", "Correlación con base IOCs CTI", "Análisis de metadatos de red"],
    recommendations: [
      "Reporte formal a FGR—FEADLE para inicio de investigación penal.",
      "Preservación digital de evidencia según protocolo IOCE.",
      "Notificación a DIF Nacional para atención a menores identificados.",
    ],
    validationStatus: "human_validated",
  },
  {
    id: "GEO-REP-011",
    title: "Tendencia territorial de incidentes de alto impacto",
    type: "territorial_risk",
    date: "2026-04-23T09:00:00Z",
    severity: "high",
    partner: "DIF Nacional",
    status: "in_review",
    summary: "Análisis geoespacial de incidentes registrados durante la semana del 14 al 21 de abril. Se identifican concentraciones de actividad de riesgo en zonas metropolitanas con alta densidad de usuarios jóvenes.",
    findings: [
      "CDMX, Monterrey y Guadalajara concentran el 67% de los incidentes de alto riesgo.",
      "Horario pico de actividad: 15:00 – 21:00 h (patrón post-escolar).",
      "Incremento del 23% en señales de riesgo respecto a la semana anterior.",
      "Correlación positiva entre zonas con menor supervisión parental y frecuencia de incidentes.",
    ],
    sources: ["Layers Guard — Datos georreferenciados", "Análisis estadístico Layers Core", "Datos abiertos INEGI"],
    recommendations: [
      "Priorizar campañas de concientización en zonas metropolitanas identificadas.",
      "Coordinar con DIF Nacional para refuerzo de programas de protección digital.",
      "Actualizar mapa de riesgo territorial en el dashboard de Layers Intel.",
    ],
    validationStatus: "pending_review",
  },
  {
    id: "EXEC-REP-032",
    title: "Resumen ejecutivo semanal de riesgos digitales",
    type: "executive",
    date: "2026-04-22T07:00:00Z",
    severity: "high",
    partner: "Dirección General",
    status: "sent",
    summary: "Resumen consolidado de la semana del 15 al 22 de abril. Layers Guard procesó 8,492 señales, clasificó 237 IOCs y escaló 9 casos a autoridades competentes. La tasa de resolución se mantiene en 91%.",
    findings: [
      "Semana con mayor volumen de señales críticas en los últimos 30 días.",
      "9 escalamientos completados: 4 a Ciberpolicía, 3 a FGR, 2 a Trust & Safety.",
      "Nuevo patrón emergente: uso de videojuegos (Roblox) como vector inicial de contacto.",
      "Tiempo promedio de clasificación: 42 segundos — dentro del SLA establecido.",
    ],
    sources: ["Layers Guard — Métricas operativas", "Dashboard Layers Intel", "Reportes de escalamiento"],
    recommendations: [
      "Ampliar cobertura de monitoreo en plataformas de videojuegos para el siguiente período.",
      "Revisar y actualizar diccionario de keywords con nuevos patrones detectados.",
      "Programar sesión de capacitación para analistas sobre nuevos vectores de ataque.",
    ],
    validationStatus: "human_validated",
  },
  {
    id: "LG-REP-019",
    title: "Análisis de manipulación emocional en plataformas de menores",
    type: "technical_cti",
    date: "2026-04-21T11:45:00Z",
    severity: "high",
    partner: "Trust & Safety (Plataforma)",
    status: "archived",
    summary: "Estudio de patrones de manipulación emocional persistente detectados por Layers Guard en interacciones de WhatsApp e Instagram durante un período de 72 horas.",
    findings: [
      "Patrón de 'love bombing' seguido de solicitudes progresivamente invasivas.",
      "Uso de mensajes de audio para evadir análisis de texto automatizado.",
      "Correlación con 3 casos activos en la Cola de Inteligencia.",
      "Indicadores compatibles con técnicas documentadas de grooming digital.",
    ],
    sources: ["Layers Guard — Análisis conversacional", "Base de patrones CTI", "Literatura especializada en grooming"],
    recommendations: [
      "Compartir patrones detectados con equipo Trust & Safety para actualizar reglas de moderación.",
      "Implementar alertas tempranas basadas en secuencias de mensajes identificadas.",
      "Generar guía de reconocimiento para usuarios y tutores.",
    ],
    validationStatus: "human_validated",
  },
  {
    id: "TREND-REP-007",
    title: "Tendencia semanal — Nuevos vectores en plataformas de videojuegos",
    type: "weekly_trend",
    date: "2026-04-20T08:00:00Z",
    severity: "medium",
    partner: "Equipo Respuesta LG",
    status: "draft",
    summary: "Análisis de tendencia sobre el incremento de incidentes detectados en plataformas de videojuegos, particularmente Roblox y Discord, durante las últimas 4 semanas.",
    findings: [
      "Incremento del 41% en señales provenientes de Roblox en el período analizado.",
      "Discord mantiene el tercer lugar con 18% del volumen total de señales.",
      "Patrón emergente: uso de canales de voz para evadir moderación de texto.",
      "Edad promedio estimada de usuarios objetivo: 10-14 años.",
    ],
    sources: ["Layers Guard — Feed en tiempo real", "Análisis de tendencias Layers Core", "OSINT — Foros especializados"],
    recommendations: [
      "Priorizar desarrollo de capacidades de análisis de audio en próxima versión.",
      "Establecer contacto con equipos de Trust & Safety de Roblox y Discord.",
      "Incluir plataformas de videojuegos en próxima campaña de concientización parental.",
    ],
    validationStatus: "pending_review",
  },
];

// ── Settings ──────────────────────────────────────────────────────────────────

export interface IngestionSource {
  id: string;
  name: string;
  active: boolean;
  lastSync: string;
  reliability: number;
  type: string;
}

export const ingestionSources: IngestionSource[] = [
  { id: "src-1", name: "Layers Guard",                     active: true,  lastSync: "hace 2 min",  reliability: 99, type: "Propietaria"     },
  { id: "src-2", name: "Datos abiertos gubernamentales",   active: true,  lastSync: "hace 18 min", reliability: 87, type: "Gubernamental"   },
  { id: "src-3", name: "OSINT",                            active: true,  lastSync: "hace 5 min",  reliability: 82, type: "Inteligencia abierta" },
  { id: "src-4", name: "Reportes validados",               active: true,  lastSync: "hace 30 min", reliability: 95, type: "Interna"         },
  { id: "src-5", name: "IOCs externos",                    active: false, lastSync: "hace 4 h",    reliability: 74, type: "Terceros"        },
  { id: "src-6", name: "Fuentes especializadas",           active: false, lastSync: "hace 2 h",    reliability: 78, type: "Especializada"   },
];

export interface ClassificationRule {
  id: string;
  pattern: string;
  severity: "critical" | "high" | "medium" | "low";
  active: boolean;
  matchCount: number;
}

export const classificationRules: ClassificationRule[] = [
  { id: "rule-1", pattern: "Grooming pattern",                    severity: "critical", active: true,  matchCount: 142 },
  { id: "rule-2", pattern: "Reclutamiento clandestino",           severity: "critical", active: true,  matchCount: 98  },
  { id: "rule-3", pattern: "Contacto sospechoso recurrente",      severity: "high",     active: true,  matchCount: 234 },
  { id: "rule-4", pattern: "Redirección a canal privado",         severity: "high",     active: true,  matchCount: 189 },
  { id: "rule-5", pattern: "Exposición a contenido peligroso",    severity: "medium",   active: true,  matchCount: 67  },
  { id: "rule-6", pattern: "Keyword aislada",                     severity: "low",      active: true,  matchCount: 892 },
];

export interface EscalationPartner {
  id: string;
  name: string;
  active: boolean;
  sla: string;
  method: "api" | "secure_email" | "manual";
  lastSent: string;
  openCases: number;
}

export const escalationPartners: EscalationPartner[] = [
  { id: "ep-1", name: "Ciberpolicía Nacional",          active: true,  sla: "2 h",  method: "api",          lastSent: "hace 12 min", openCases: 4 },
  { id: "ep-2", name: "FGR — FEADLE",                   active: true,  sla: "4 h",  method: "secure_email", lastSent: "hace 45 min", openCases: 3 },
  { id: "ep-3", name: "DIF Nacional",                   active: true,  sla: "6 h",  method: "secure_email", lastSent: "hace 2 h",    openCases: 2 },
  { id: "ep-4", name: "Trust & Safety (Plataforma)",    active: true,  sla: "1 h",  method: "api",          lastSent: "hace 30 min", openCases: 5 },
  { id: "ep-5", name: "Equipo Respuesta LG",            active: true,  sla: "30 min", method: "api",        lastSent: "hace 5 min",  openCases: 1 },
  { id: "ep-6", name: "ONG / Protección infantil",      active: false, sla: "24 h", method: "manual",       lastSent: "hace 3 días", openCases: 0 },
];

export interface DashboardPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const dashboardPreferences: DashboardPreference[] = [
  { id: "pref-1", label: "Actualización automática",                   description: "Actualiza los datos cada 60 segundos",          enabled: true  },
  { id: "pref-2", label: "Mostrar alertas críticas primero",           description: "Ordena feeds por severidad descendente",         enabled: true  },
  { id: "pref-3", label: "Requerir validación humana antes de escalar", description: "Agrega paso de confirmación en escalamientos",  enabled: true  },
  { id: "pref-4", label: "Ocultar datos sensibles",                    description: "Enmascara handles, IPs y datos personales",      enabled: false },
  { id: "pref-5", label: "Activar modo demo",                          description: "Usa datos sintéticos — sin datos reales",        enabled: false },
];
