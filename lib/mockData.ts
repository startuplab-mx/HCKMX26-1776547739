// Mock data for dashboard preview and charts — no real organizations or individuals

// ── Map risk points ──────────────────────────────────────────────────────────
// Structured so callers can later swap this for an API response with the same shape.

export interface RiskPoint {
  id: string;
  zone: string;
  lat: number;
  lng: number;
  riskScore: number;       // 0–100
  incidentType: string;
  lastUpdated: string;
}

export const mexicoCityRiskPoints: RiskPoint[] = [
  {
    id: "cdmx-001",
    zone: "Centro Histórico",
    lat: 19.4326,
    lng: -99.1332,
    riskScore: 87,
    incidentType: "Robo y Delitos Patrimoniales",
    lastUpdated: "hace 2 min",
  },
  {
    id: "cdmx-002",
    zone: "Tepito",
    lat: 19.4425,
    lng: -99.1292,
    riskScore: 92,
    incidentType: "Delincuencia Organizada en Calle",
    lastUpdated: "hace 5 min",
  },
  {
    id: "cdmx-003",
    zone: "Roma Norte",
    lat: 19.4146,
    lng: -99.1665,
    riskScore: 54,
    incidentType: "Robo de Vehículo",
    lastUpdated: "hace 14 min",
  },
  {
    id: "cdmx-004",
    zone: "Polanco",
    lat: 19.432,
    lng: -99.1909,
    riskScore: 38,
    incidentType: "Robo Menor",
    lastUpdated: "hace 1 hr",
  },
  {
    id: "cdmx-005",
    zone: "Coyoacán",
    lat: 19.349,
    lng: -99.161,
    riskScore: 45,
    incidentType: "Robo a Casa Habitación",
    lastUpdated: "hace 32 min",
  },
  {
    id: "cdmx-006",
    zone: "Iztapalapa",
    lat: 19.3574,
    lng: -99.0671,
    riskScore: 78,
    incidentType: "Asalto y Robo",
    lastUpdated: "hace 8 min",
  },
  {
    id: "cdmx-007",
    zone: "Doctores",
    lat: 19.4204,
    lng: -99.1451,
    riskScore: 73,
    incidentType: "Robo en Vía Pública",
    lastUpdated: "hace 19 min",
  },
];

export const riskTrendData = [
  { month: "Jan", risk: 62, incidents: 34, resolved: 28 },
  { month: "Feb", risk: 58, incidents: 29, resolved: 25 },
  { month: "Mar", risk: 71, incidents: 41, resolved: 33 },
  { month: "Apr", risk: 65, incidents: 37, resolved: 30 },
  { month: "May", risk: 54, incidents: 25, resolved: 22 },
  { month: "Jun", risk: 48, incidents: 19, resolved: 18 },
  { month: "Jul", risk: 52, incidents: 23, resolved: 20 },
  { month: "Aug", risk: 67, incidents: 38, resolved: 31 },
];

export const alertsData = [
  {
    id: "ALT-4821",
    type: "Riesgo Alto",
    zone: "Zona Delta-7",
    description: "Agrupamiento elevado de incidentes detectado en zona comercial",
    time: "hace 4 min",
    severity: "high" as const,
  },
  {
    id: "ALT-4820",
    type: "Señal Digital",
    zone: "Segmento de Red 12",
    description: "Pico de volumen en redes sociales — patrón coordinado",
    time: "hace 18 min",
    severity: "medium" as const,
  },
  {
    id: "ALT-4819",
    type: "Alerta OSINT",
    zone: "Sector Bravo",
    description: "Coincidencia OSINT: actividad de organización de protesta",
    time: "hace 1 hr",
    severity: "medium" as const,
  },
  {
    id: "ALT-4818",
    type: "Resuelto",
    zone: "Zona Alpha-3",
    description: "Puntaje de riesgo normalizado tras despliegue de patrullaje",
    time: "hace 2 hr",
    severity: "low" as const,
  },
];

export const topRiskZones = [
  { zone: "Zone Delta-7", score: 87, trend: "up", change: "+12" },
  { zone: "Sector Foxtrot", score: 74, trend: "up", change: "+5" },
  { zone: "District Echo-2", score: 63, trend: "down", change: "-8" },
  { zone: "Corridor Lima", score: 51, trend: "stable", change: "0" },
  { zone: "Zone Alpha-3", score: 34, trend: "down", change: "-14" },
];

export const digitalSignals = [
  { source: "Redes Sociales", volume: 1842, change: "+23%", status: "elevated" },
  { source: "OSINT Feeds", volume: 347, change: "+7%", status: "normal" },
  { source: "Dark Web", volume: 12, change: "-3%", status: "normal" },
  { source: "Agregador de Noticias", volume: 689, change: "+41%", status: "elevated" },
];

export const mapHeatPoints = [
  { x: 22, y: 34, intensity: 0.9 },
  { x: 25, y: 37, intensity: 0.75 },
  { x: 20, y: 32, intensity: 0.6 },
  { x: 55, y: 20, intensity: 0.5 },
  { x: 58, y: 23, intensity: 0.45 },
  { x: 70, y: 55, intensity: 0.35 },
  { x: 40, y: 60, intensity: 0.7 },
  { x: 43, y: 63, intensity: 0.55 },
  { x: 80, y: 30, intensity: 0.4 },
];

export const overallRiskScore = 67;

export const platformFeatures = [
  {
    id: "ingestion",
    icon: "Map",
    title: "Ingesta Multi-Fuente",
    description:
      "Layers Core conecta fuentes gubernamentales, OSINT, SESNSP, IOCs, señales digitales y reportes validados en un pipeline unificado.",
    color: "blue",
  },
  {
    id: "validation",
    icon: "Shield",
    title: "Validación y Normalización",
    description:
      "Clasifica, normaliza, deduplica y valida información en tiempo real para garantizar inteligencia confiable y libre de ruido.",
    color: "purple",
  },
  {
    id: "risk-scoring",
    icon: "BarChart3",
    title: "Puntajes de Riesgo Dinámicos",
    description:
      "Puntajes compuestos que combinan líneas base históricas, señales en vivo e IOCs para reflejar el riesgo real en cada momento.",
    color: "indigo",
  },
  {
    id: "trend-detection",
    icon: "TrendingUp",
    title: "Detección de Tendencias",
    description:
      "Identificación automática de patrones emergentes, correlaciones entre fuentes y desviaciones estadísticamente relevantes.",
    color: "cyan",
  },
  {
    id: "osint",
    icon: "Search",
    title: "OSINT e Inteligencia Abierta",
    description:
      "Ingesta y correlación continua desde datos abiertos, noticias, redes sociales, registros públicos y plataformas especializadas.",
    color: "teal",
  },
  {
    id: "reports",
    icon: "FileText",
    title: "Reportes Accionables",
    description:
      "Briefings generados automáticamente con alertas priorizadas, resúmenes de riesgo y recomendaciones para cada tipo de partner.",
    color: "violet",
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Ingestar Fuentes",
    description:
      "Layers Core conecta fuentes gubernamentales, OSINT, IOCs, señales digitales, registros públicos y reportes validados en un pipeline unificado.",
    icon: "Database",
  },
  {
    step: "02",
    title: "Validar y Normalizar",
    description:
      "Clasifica, deduplica y valida la información con contexto geoespacial, resolución de entidades y etiquetado temporal para eliminar ruido.",
    icon: "Layers",
  },
  {
    step: "03",
    title: "Correlacionar y Detectar",
    description:
      "Aplica modelos de ML para detectar anomalías, correlaciones entre fuentes y patrones de comportamiento relevantes para cada caso de uso.",
    icon: "Cpu",
  },
  {
    step: "04",
    title: "Generar Inteligencia",
    description:
      "Produce puntajes de riesgo dinámicos, alertas tempranas y tendencias validadas, con trazabilidad completa desde la fuente hasta la salida.",
    icon: "BrainCircuit",
  },
  {
    step: "05",
    title: "Entregar al Partner",
    description:
      "Distribuye alertas en tiempo real, reportes accionables y dashboards personalizados a cada institución, partner o equipo de inteligencia.",
    icon: "Bell",
  },
];

export const useCases = [
  {
    icon: "Building2",
    title: "Instituciones y Gobierno",
    description:
      "Dota a procuradurías, fiscalías y agencias gubernamentales con visibilidad del riesgo territorial, inteligencia institucional y alertas tempranas validadas.",
    tags: ["Procuradurías", "Inteligencia Institucional", "Respuesta a Emergencias"],
  },
  {
    icon: "Briefcase",
    title: "Seguridad Corporativa",
    description:
      "Protege activos, personal y operaciones con puntajes de riesgo específicos por sede y monitoreo regional de amenazas.",
    tags: ["Protección de Activos", "Seguridad en Viajes", "Asesoría de Amenazas"],
  },
  {
    icon: "Truck",
    title: "Logística y Operaciones de Campo",
    description:
      "Optimización de rutas y despacho orientado al riesgo para última milla, cadena de suministro y seguridad de trabajadores en campo.",
    tags: ["Inteligencia de Rutas", "Seguridad Laboral", "Cadena de Suministro"],
  },
  {
    icon: "Globe",
    title: "Confianza y Seguridad en Plataformas",
    description:
      "Identifica comportamiento inauténtico coordinado, campañas de acoso y manipulación de plataformas a escala.",
    tags: ["Moderación de Contenido", "Integridad de Cuentas", "Análisis de Redes"],
  },
  {
    icon: "Siren",
    title: "Respuesta a Emergencias",
    description:
      "Conciencia situacional en tiempo real e inteligencia de asignación de recursos durante incidentes activos y crisis.",
    tags: ["Conciencia Situacional", "Asignación de Recursos", "Coordinación de Crisis"],
  },
  {
    icon: "Shield",
    title: "Layers Family",
    description:
      "Solución de control parental e inteligencia preventiva que utiliza Layers Core para ingerir IOCs, señales digitales y datos contextuales, clasificarlos en tiempo real y detectar patrones de riesgo asociados a exposición digital, contacto sospechoso, manipulación o amenazas emergentes.",
    tags: ["Control Parental", "Protección Digital", "Clasificación en Tiempo Real", "Alertas Preventivas"],
  },
];

// ── Dashboard incident data model ─────────────────────────────────────────────
// Replace `incidents` with an API call to swap in real data.

export type IncidentType =
  | "theft"
  | "violence"
  | "recruitment"
  | "drug_activity"
  | "suspicious_activity";

export type IncidentSource =
  | "official"
  | "social_media"
  | "osint"
  | "citizen_reports";

export interface Incident {
  id: string;
  lat: number;
  lng: number;
  zone: string;
  risk: number;           // 0–100
  type: IncidentType;
  source: IncidentSource;
  timestamp: string;      // ISO-8601
}

// Dates relative to 2025-04-25 so the date-range filters produce non-empty slices.
// ~15 in last 24 h · ~13 in last 7 d (not 24 h) · ~14 in last 30 d (not 7 d)
export const incidents: Incident[] = [
  // ── Last 24 h (Apr 24–25) ──────────────────────────────────────────────
  { id: "inc-001", lat: 19.4335, lng: -99.1338, zone: "Centro Histórico", risk: 91, type: "violence",            source: "official",        timestamp: "2025-04-25T06:30:00Z" },
  { id: "inc-002", lat: 19.4418, lng: -99.1285, zone: "Tepito",            risk: 95, type: "drug_activity",       source: "osint",           timestamp: "2025-04-25T04:15:00Z" },
  { id: "inc-003", lat: 19.4408, lng: -99.1312, zone: "Tepito",            risk: 89, type: "recruitment",         source: "social_media",    timestamp: "2025-04-24T22:00:00Z" },
  { id: "inc-004", lat: 19.3575, lng: -99.0668, zone: "Iztapalapa",        risk: 84, type: "violence",            source: "citizen_reports", timestamp: "2025-04-24T20:45:00Z" },
  { id: "inc-005", lat: 19.3560, lng: -99.0695, zone: "Iztapalapa",        risk: 88, type: "theft",               source: "official",        timestamp: "2025-04-24T15:30:00Z" },
  { id: "inc-006", lat: 19.4205, lng: -99.1448, zone: "Doctores",          risk: 79, type: "drug_activity",       source: "osint",           timestamp: "2025-04-24T12:00:00Z" },
  { id: "inc-007", lat: 19.4461, lng: -99.1455, zone: "Guerrero",          risk: 82, type: "theft",               source: "citizen_reports", timestamp: "2025-04-25T01:30:00Z" },
  { id: "inc-008", lat: 19.4142, lng: -99.1670, zone: "Roma Norte",        risk: 62, type: "theft",               source: "citizen_reports", timestamp: "2025-04-25T05:45:00Z" },
  { id: "inc-009", lat: 19.4050, lng: -99.1662, zone: "Roma Sur",          risk: 58, type: "suspicious_activity", source: "official",        timestamp: "2025-04-24T23:30:00Z" },
  { id: "inc-010", lat: 19.4312, lng: -99.1915, zone: "Polanco",           risk: 42, type: "suspicious_activity", source: "osint",           timestamp: "2025-04-25T03:00:00Z" },
  { id: "inc-011", lat: 19.4135, lng: -99.1775, zone: "Condesa",           risk: 55, type: "theft",               source: "citizen_reports", timestamp: "2025-04-24T18:00:00Z" },
  { id: "inc-012", lat: 19.3972, lng: -99.1638, zone: "Narvarte",          risk: 61, type: "theft",               source: "social_media",    timestamp: "2025-04-24T10:30:00Z" },
  { id: "inc-013", lat: 19.4395, lng: -99.1182, zone: "Morelos",           risk: 76, type: "violence",            source: "official",        timestamp: "2025-04-24T09:00:00Z" },
  { id: "inc-014", lat: 19.4322, lng: -99.1905, zone: "Polanco",           risk: 38, type: "suspicious_activity", source: "citizen_reports", timestamp: "2025-04-24T16:15:00Z" },
  { id: "inc-015", lat: 19.4285, lng: -99.1558, zone: "Cuauhtémoc",        risk: 67, type: "drug_activity",       source: "osint",           timestamp: "2025-04-25T02:00:00Z" },

  // ── Last 7 d (Apr 18–23, not 24 h) ────────────────────────────────────
  { id: "inc-016", lat: 19.4825, lng: -99.1105, zone: "Gustavo A. Madero", risk: 80, type: "recruitment",         source: "social_media",    timestamp: "2025-04-23T21:00:00Z" },
  { id: "inc-017", lat: 19.4270, lng: -99.1048, zone: "Venustiano Carranza",risk:77, type: "drug_activity",       source: "osint",           timestamp: "2025-04-23T14:15:00Z" },
  { id: "inc-018", lat: 19.3480, lng: -99.1638, zone: "Coyoacán",          risk: 75, type: "suspicious_activity", source: "citizen_reports", timestamp: "2025-04-22T11:30:00Z" },
  { id: "inc-019", lat: 19.3880, lng: -99.0985, zone: "Iztacalco",         risk: 83, type: "violence",            source: "official",        timestamp: "2025-04-22T08:45:00Z" },
  { id: "inc-020", lat: 19.4910, lng: -99.1895, zone: "Azcapotzalco",      risk: 78, type: "theft",               source: "social_media",    timestamp: "2025-04-21T19:00:00Z" },
  { id: "inc-021", lat: 19.4345, lng: -99.1325, zone: "Centro Histórico",  risk: 86, type: "theft",               source: "official",        timestamp: "2025-04-21T16:30:00Z" },
  { id: "inc-022", lat: 19.3952, lng: -99.1520, zone: "Benito Juárez",     risk: 54, type: "suspicious_activity", source: "official",        timestamp: "2025-04-20T14:45:00Z" },
  { id: "inc-023", lat: 19.4305, lng: -99.1915, zone: "Polanco",           risk: 52, type: "theft",               source: "citizen_reports", timestamp: "2025-04-20T09:15:00Z" },
  { id: "inc-024", lat: 19.4215, lng: -99.1465, zone: "Doctores",          risk: 69, type: "violence",            source: "social_media",    timestamp: "2025-04-19T22:30:00Z" },
  { id: "inc-025", lat: 19.3695, lng: -99.2225, zone: "Álvaro Obregón",    risk: 63, type: "theft",               source: "osint",           timestamp: "2025-04-19T15:00:00Z" },
  { id: "inc-026", lat: 19.4488, lng: -99.1132, zone: "Morelos",           risk: 71, type: "recruitment",         source: "official",        timestamp: "2025-04-18T11:00:00Z" },
  { id: "inc-027", lat: 19.4168, lng: -99.1782, zone: "Condesa",           risk: 58, type: "suspicious_activity", source: "citizen_reports", timestamp: "2025-04-18T17:30:00Z" },
  { id: "inc-028", lat: 19.4548, lng: -99.1488, zone: "Guerrero",          risk: 65, type: "violence",            source: "citizen_reports", timestamp: "2025-04-18T10:30:00Z" },

  // ── Last 30 d (Mar 26 – Apr 17, not 7 d) ──────────────────────────────
  { id: "inc-029", lat: 19.2950, lng: -99.1645, zone: "Tlalpan",           risk: 60, type: "drug_activity",       source: "social_media",    timestamp: "2025-04-17T08:00:00Z" },
  { id: "inc-030", lat: 19.3625, lng: -99.2602, zone: "Santa Fe",          risk: 53, type: "theft",               source: "official",        timestamp: "2025-04-15T13:30:00Z" },
  { id: "inc-031", lat: 19.4285, lng: -99.2145, zone: "Lomas de Chapultepec", risk: 57, type: "suspicious_activity", source: "osint",       timestamp: "2025-04-14T20:00:00Z" },
  { id: "inc-032", lat: 19.3600, lng: -99.0650, zone: "Iztapalapa",        risk: 90, type: "drug_activity",       source: "osint",           timestamp: "2025-04-13T07:15:00Z" },
  { id: "inc-033", lat: 19.3488, lng: -99.1605, zone: "Coyoacán",          risk: 44, type: "suspicious_activity", source: "citizen_reports", timestamp: "2025-04-12T12:00:00Z" },
  { id: "inc-034", lat: 19.3645, lng: -99.2612, zone: "Santa Fe",          risk: 32, type: "theft",               source: "social_media",    timestamp: "2025-04-11T07:45:00Z" },
  { id: "inc-035", lat: 19.2568, lng: -99.0988, zone: "Xochimilco",        risk: 41, type: "suspicious_activity", source: "osint",           timestamp: "2025-04-10T18:30:00Z" },
  { id: "inc-036", lat: 19.3952, lng: -99.1528, zone: "Benito Juárez",     risk: 35, type: "theft",               source: "official",        timestamp: "2025-04-09T09:00:00Z" },
  { id: "inc-037", lat: 19.3475, lng: -99.1618, zone: "Coyoacán",          risk: 47, type: "theft",               source: "social_media",    timestamp: "2025-04-07T20:15:00Z" },
  { id: "inc-038", lat: 19.2952, lng: -99.0075, zone: "Tláhuac",           risk: 43, type: "drug_activity",       source: "osint",           timestamp: "2025-04-05T11:45:00Z" },
  { id: "inc-039", lat: 19.4135, lng: -99.1768, zone: "Condesa",           risk: 36, type: "suspicious_activity", source: "official",        timestamp: "2025-04-03T15:00:00Z" },
  { id: "inc-040", lat: 19.3655, lng: -99.2238, zone: "Álvaro Obregón",    risk: 40, type: "theft",               source: "citizen_reports", timestamp: "2025-04-01T09:30:00Z" },
  { id: "inc-041", lat: 19.1888, lng: -99.0112, zone: "Milpa Alta",        risk: 27, type: "suspicious_activity", source: "social_media",    timestamp: "2025-03-29T16:00:00Z" },
  { id: "inc-042", lat: 19.4298, lng: -99.1935, zone: "Polanco",           risk: 29, type: "theft",               source: "official",        timestamp: "2025-03-27T10:00:00Z" },
  { id: "inc-043", lat: 19.4502, lng: -99.1422, zone: "Guerrero",          risk: 73, type: "violence",            source: "citizen_reports", timestamp: "2025-03-26T19:30:00Z" },
];

// ── Filter helpers ────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high";
export type DateRange = "24h" | "7d" | "30d";

export interface FilterState {
  riskLevels: RiskLevel[];
  types: IncidentType[];
  dateRange: DateRange;
  sources: IncidentSource[];
}

export const DEFAULT_FILTERS: FilterState = {
  riskLevels: [],
  types: [],
  dateRange: "30d",
  sources: [],
};

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

export function filterIncidents(
  data: Incident[],
  filters: FilterState
): Incident[] {
  const now = new Date("2025-04-25T23:59:59Z").getTime();
  const cutoff: Record<DateRange, number> = {
    "24h": now - 24 * 60 * 60 * 1000,
    "7d":  now - 7  * 24 * 60 * 60 * 1000,
    "30d": now - 30 * 24 * 60 * 60 * 1000,
  };

  return data.filter((inc) => {
    if (filters.riskLevels.length > 0) {
      if (!filters.riskLevels.includes(getRiskLevel(inc.risk))) return false;
    }
    if (filters.types.length > 0) {
      if (!filters.types.includes(inc.type)) return false;
    }
    if (filters.sources.length > 0) {
      if (!filters.sources.includes(inc.source)) return false;
    }
    const ts = new Date(inc.timestamp).getTime();
    if (ts < cutoff[filters.dateRange]) return false;
    return true;
  });
}

// ── Label maps (UI display) ───────────────────────────────────────────────────

export const TYPE_LABELS: Record<IncidentType, string> = {
  theft:                "Robo",
  violence:             "Violencia",
  recruitment:          "Reclutamiento",
  drug_activity:        "Actividad de Drogas",
  suspicious_activity:  "Actividad Sospechosa",
};

export const SOURCE_LABELS: Record<IncidentSource, string> = {
  official:        "Oficial",
  social_media:    "Redes Sociales",
  osint:           "OSINT",
  citizen_reports: "Reportes Ciudadanos",
};

export const responsibleAIPrinciples = [
  {
    icon: "UserCheck",
    title: "Humano en el Ciclo",
    description:
      "Cada puntaje y alerta generado por Layers Core está sujeto a revisión analítica antes de derivar en cualquier decisión operativa o institucional.",
  },
  {
    icon: "Lock",
    title: "Privacidad desde el Diseño",
    description:
      "Minimización de datos, limitación de propósito y controles de acceso estrictos aplicados en cada capa del pipeline de inteligencia.",
  },
  {
    icon: "ShieldOff",
    title: "Sin Acusaciones Automatizadas",
    description:
      "La plataforma expone patrones, correlaciones y probabilidades — nunca genera señalamientos automatizados contra personas o entidades.",
  },
  {
    icon: "GitBranch",
    title: "Trazabilidad Completa",
    description:
      "Seguimiento de procedencia desde cada fuente ingestada hasta la salida de inteligencia, con registros de auditoría inmutables por acción.",
  },
  {
    icon: "Scale",
    title: "Monitoreo de Sesgos",
    description:
      "Métricas continuas de equidad y verificaciones de paridad aplicadas sobre todos los modelos de clasificación y puntaje del sistema.",
  },
];
