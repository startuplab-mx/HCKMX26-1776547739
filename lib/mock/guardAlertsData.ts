import type { AlertCase } from "@/lib/mock/ctiData";

// ── Enriched AlertCase data for the new guard-event feed ──────────────────────
// IDs match the layersGuardEvents array in ctiData.ts (tk-001 … rblx-001).

const guardAlertCases: AlertCase[] = [
  // ── tk-001 — @user1334248711265 — Cuenta desechable CRÍTICO ──────────────────
  {
    id: "tk-001",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "@user1334248711265",
    userContext: "cuenta de reciente creación sin contenido publicado",
    approximateLocation: "Japón (posible VPN — geolocalización no confiable)",
    sourceIp: "N/D — geolocalización inconsistente con VPN detectado",
    riskType: "Cuenta desechable con geolocalización inconsistente",
    severity: "critical",
    status: "open",
    confidence: 88,
    timestamp: "2026-04-26T08:48:00Z",
    summary:
      "Layers Guard detectó la cuenta @user1334248711265 creada en las últimas 24 horas con configuración de privacidad máxima, geolocalización inconsistente (Japón, posible uso de VPN), idioma de interfaz ZH y cero videos publicados. El patrón observado es compatible con una cuenta desechable preparada para reclutamiento efímero o difusión encubierta hacia menores. No se ha detectado contacto directo con perfiles protegidos al momento de este análisis. Requiere validación humana prioritaria antes de cualquier acción.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    riskScore: 82,
    hypothesis:
      "Posible cuenta desechable creada para reclutamiento encubierto o difusión de material de riesgo hacia menores. El uso de VPN y la configuración de privacidad máxima desde el inicio son indicadores compatibles con un actor que opera sin trazabilidad. Esta hipótesis requiere validación humana.",
    geolocation: "Japón (posible VPN — no confiable como geolocalización real)",
    language: "ZH — chino simplificado (inconsistente con mercado objetivo MX)",
    accountAge: "Creada hace menos de 24 horas",
    accountStatus: "Privada — sin contenido publicado — sin seguidores verificados",
    evidence: [
      {
        id: "ev-tk001-1",
        title: "Captura de perfil — @user1334248711265",
        description:
          "Perfil de TikTok con privacidad máxima activada, cero videos publicados y geolocalización inconsistente. Idioma de interfaz configurado en ZH (chino simplificado). Capturado por Layers Guard — TikTok Monitor a las 08:48:50.",
        url: "https://res.cloudinary.com/dkucopkow/image/upload/v1777214994/Captura_de_pantalla_2026-04-26_a_la_s_8.48.50_a.m._vvdf2e.png",
        timestamp: "2026-04-26T08:48:50Z",
        source: "Layers Guard — TikTok Monitor",
      },
    ],
    iocEntries: [
      {
        tipo: "handle",
        valor: "@user1334248711265",
        categoria: "Identidad digital",
        severidad: "critical",
        confianza: 95,
        explicacion:
          "Cuenta creada hace menos de 24 horas con privacidad máxima y cero contenido. El nombre de usuario generado automáticamente es consistente con cuentas creadas de forma masiva.",
      },
      {
        tipo: "emoji",
        valor: "🥷",
        categoria: "Comunicación encubierta",
        severidad: "high",
        confianza: 72,
        explicacion:
          "Indicador simbólico compatible con perfiles de reclutamiento encubierto. Presencia observada en cuentas de red identificadas en el mismo período.",
      },
      {
        tipo: "keyword",
        valor: "trabajo fácil",
        categoria: "Reclutamiento aspiracional",
        severidad: "high",
        confianza: 80,
        explicacion:
          "Keyword asociada a patrones de reclutamiento aspiracional dirigido a menores. Correlacionada con 12 publicaciones activas en el mismo período.",
      },
    ],
    recommendedActions: [
      "Verificar si la cuenta ha realizado contacto con perfiles de menores protegidos en las últimas 24 horas.",
      "Solicitar datos de registro de la IP real a TikTok Trust & Safety si se detecta contacto con menores.",
      "Mantener monitoreo activo durante 48 horas antes de tomar acciones irreversibles.",
      "Si se detecta contacto con perfiles protegidos: escalar inmediatamente a Ciberpolicía Nacional.",
      "Documentar todos los indicadores actuales preservando capturas con timestamp para cadena de evidencia.",
      "Correlacionar con otras cuentas de creación reciente en el mismo período para identificar posible red.",
    ],
    artifacts: [
      {
        type: "handle",
        value: "@user1334248711265",
        confidence: 95,
        description: "Cuenta de TikTok — creada hace < 24 h, privada, sin contenido, idioma ZH",
      },
      {
        type: "ip",
        value: "N/D — VPN detectado",
        confidence: 60,
        description: "Geolocalización reportada en Japón — probable VPN comercial",
      },
    ],
    investigation: {
      findings:
        "La cuenta @user1334248711265 presenta múltiples indicadores de cuenta desechable: creación en las últimas 24 horas, configuración de privacidad máxima desde el inicio (comportamiento atípico en usuarios nuevos), idioma de interfaz ZH inconsistente con el mercado objetivo, geolocalización aparente en Japón (compatible con VPN) y cero videos publicados. El perfil de cuenta es consistente con infraestructura preparada para reclutamiento efímero o contacto directo con menores sin trazabilidad. No se han detectado interacciones con perfiles protegidos al momento del análisis.",
      correlatedEvidence: [
        "Patrón de 'cuenta nueva + privada + sin contenido' correlacionado con 3 casos previos de reclutamiento en TikTok (reportes LG-2026-012, LG-2026-019, LG-2026-025)",
        "Geolocalización en Japón con idioma ZH es marcador de VPN comercial — no indica presencia real en Asia",
        "Nombre de usuario numérico autogenerado es consistente con creación masiva de cuentas mediante automatización",
      ],
      observedSignals: [
        "Cuenta creada en las últimas 24 horas — ventana típica de cuentas desechables operativas",
        "Configuración de privacidad máxima desde el inicio — atípico en usuarios nuevos orgánicos",
        "Idioma ZH inconsistente con mercado objetivo en México",
        "Cero videos — la cuenta no está orientada a contenido orgánico",
        "Geolocalización inconsistente — posible VPN para ocultar ubicación real",
      ],
      riskVector:
        "Posible infraestructura de reclutamiento encubierto en fase preparatoria. Sin evidencia de daño directo al momento del análisis. El riesgo se eleva si se detecta contacto con perfiles de menores protegidos.",
      recommendation:
        "Monitoreo activo durante 48 horas. Si se detecta contacto con menores protegidos: escalamiento inmediato a Ciberpolicía Nacional y solicitud urgente a TikTok Trust & Safety.",
    },
    timeline: [
      {
        time: "2026-04-26T08:47:00Z",
        title: "Cuenta detectada — Layers Guard",
        description:
          "LG-TikTok-Monitor identifica la cuenta por patrón de creación anómalo: cuenta nueva + privada + sin contenido + idioma inconsistente.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:48:00Z",
        title: "Clasificación automática",
        description:
          "LayersCore-Guardian-v1 clasifica como cuenta desechable de riesgo crítico. Confianza: 88%. Severidad: Crítica.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:48:50Z",
        title: "Captura de evidencia",
        description:
          "Captura del perfil almacenada con timestamp en sistema de evidencia. Hash verificable disponible.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:49:00Z",
        title: "Caso tk-001 creado",
        description: "Caso generado y enviado a cola de revisión humana prioritaria.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Validación humana",
        description: "Revisar indicadores y determinar si hubo contacto con perfiles protegidos.",
        status: "pending",
      },
      {
        time: "Pendiente",
        title: "Decisión de escalamiento",
        description: "Escalar a Ciberpolicía si se confirma contacto con menores.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety TikTok + Ciberpolicía Nacional",
      status: "not_escalated",
      sla: "4 horas (crítico)",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── tk-002 — @angelriver053 — Narcocultura Tamaulipas ALTO ───────────────────
  {
    id: "tk-002",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "@angelriver053",
    userContext: "perfil con comportamiento orgánico e indicadores de afinidad cultural criminal",
    approximateLocation: "Tamaulipas, México",
    sourceIp: "N/D — perfil público",
    riskType: "Perfil con indicadores de afinidad a grupos criminales",
    severity: "high",
    status: "open",
    confidence: 85,
    timestamp: "2026-04-26T08:51:00Z",
    summary:
      "Layers Guard identificó el perfil @angelriver053 en TikTok con 871 seguidores y 9,376 me gusta, engagement del 3.5% y actividad concentrada los viernes a las 23:00 CST. El análisis de sus interacciones muestra patrones de afinidad con narcocultura: comentarios en videos relacionados con grupos criminales de Tamaulipas y uso de lenguaje asociado a reclutamiento en contextos de crimen organizado. El comportamiento es orgánico —no automatizado—, lo que sugiere un actor real con conocimiento del entorno. Requiere validación humana para determinar nivel de riesgo real.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    riskScore: 71,
    hypothesis:
      "Perfil con comportamiento orgánico y afinidad cultural asociada a grupos criminales activos en Tamaulipas. La combinación de engagement elevado, horario nocturno de actividad y contenido asociado a narcocultura es compatible con un actor dentro del ecosistema de comunicación de grupos de crimen organizado. Esta hipótesis requiere validación humana antes de cualquier acción.",
    geolocation: "Tamaulipas, México (referencia explícita en perfil e interacciones)",
    language: "Español — MX (Noreste)",
    accountAge: "Cuenta establecida — antigüedad no determinada en este análisis",
    accountStatus: "Pública — 871 seguidores · 9,376 me gusta · engagement 3.5%",
    evidence: [
      {
        id: "ev-tk002-1",
        title: "Captura de perfil — @angelriver053",
        description:
          "Perfil público de TikTok con ubicación en Tamaulipas. 871 seguidores, 9,376 me gusta, engagement del 3.5%. Actividad concentrada los viernes a las 23:00 CST. Capturado por Layers Guard — TikTok Monitor.",
        url: "https://res.cloudinary.com/dkucopkow/image/upload/v1777215136/Captura_de_pantalla_2026-04-26_a_la_s_8.51.59_a.m._hxcpnl.png",
        timestamp: "2026-04-26T08:51:59Z",
        source: "Layers Guard — TikTok Monitor",
      },
    ],
    iocEntries: [
      {
        tipo: "handle",
        valor: "@angelriver053",
        categoria: "Identidad digital",
        severidad: "high",
        confianza: 88,
        explicacion:
          "Perfil con comportamiento orgánico e indicadores de afinidad con narcocultura. Tamaulipas es región de alta actividad de grupos criminales. El engagement del 3.5% sugiere audiencia real y comprometida.",
      },
      {
        tipo: "keyword",
        valor: "Reynosa la Maldosa",
        categoria: "Referencia geográfica criminal",
        severidad: "high",
        confianza: 82,
        explicacion:
          "Audio y expresión asociada a grupos criminales activos en Reynosa, Tamaulipas. Presencia en el ecosistema de interacciones del perfil.",
      },
      {
        tipo: "keyword",
        valor: "Canasteo",
        categoria: "Código de comunicación",
        severidad: "high",
        confianza: 79,
        explicacion:
          "Término de uso en contextos de reclutamiento por grupos criminales del noreste de México. Detectado en el ecosistema de interacciones del perfil.",
      },
      {
        tipo: "emoji",
        valor: "🪖",
        categoria: "Comunicación encubierta",
        severidad: "medium",
        confianza: 70,
        explicacion:
          "Emoji de casco militar con uso frecuente en comunicaciones de grupos paramilitares y de crimen organizado en redes sociales.",
      },
      {
        tipo: "keyword",
        valor: "trabajo fácil",
        categoria: "Reclutamiento aspiracional",
        severidad: "high",
        confianza: 76,
        explicacion:
          "Keyword asociada a patrones de reclutamiento. Presente en el ecosistema de interacciones relacionadas con el perfil.",
      },
    ],
    recommendedActions: [
      "Analizar el historial completo de comentarios e interacciones del perfil para confirmar o descartar patrón de reclutamiento.",
      "Verificar si el perfil ha tenido contacto directo con perfiles de menores protegidos mediante DMs.",
      "Correlacionar con otros perfiles de Tamaulipas identificados en el mismo período de análisis.",
      "Compartir indicadores con fuentes de inteligencia especializadas en grupos criminales del noreste (si corresponde y se tiene autorización).",
      "Si se confirma patrón de reclutamiento: reportar a FGR — FEADLE y mantener monitoreo activo.",
      "No tomar acciones públicas que puedan alertar al actor antes de la validación humana.",
    ],
    artifacts: [
      {
        type: "handle",
        value: "@angelriver053",
        confidence: 88,
        description: "Perfil TikTok — Tamaulipas · 871 seguidores · engagement 3.5% · actividad viernes 23:00 CST",
      },
      {
        type: "keyword",
        value: "Reynosa la Maldosa",
        confidence: 82,
        description: "Audio/expresión asociada a grupos criminales activos en Tamaulipas",
      },
      {
        type: "keyword",
        value: "Canasteo",
        confidence: 79,
        description: "Término de reclutamiento detectado en ecosistema de interacciones",
      },
    ],
    investigation: {
      findings:
        "El perfil @angelriver053 muestra comportamiento orgánico —no automatizado— con engagement real del 3.5%, lo que sugiere una audiencia genuinamente comprometida. La ubicación declarada en Tamaulipas, el horario de actividad nocturno (viernes 23:00 CST) y los indicadores de afinidad con narcocultura detectados en sus interacciones son elementos que, en conjunto, configuran un perfil de riesgo. El análisis no puede determinar con certeza si el actor es un facilitador activo de reclutamiento o un individuo con afinidad pasiva al entorno cultural. La validación humana es esencial para esta distinción.",
      correlatedEvidence: [
        "Tamaulipas es una de las regiones con mayor actividad de grupos criminales que utilizan redes sociales para reclutamiento (reportes SEDENA Q1 2026)",
        "Horario de actividad concentrado en fines de semana nocturnos correlaciona con patrones de comunicación encubierta documentados",
        "Audio 'Reynosa la Maldosa' detectado como IOC activo en 3 casos previos de LG en los últimos 60 días",
      ],
      observedSignals: [
        "Ubicación explícita en Tamaulipas con afinidad cultural al entorno criminal local",
        "Engagement del 3.5% — audiencia real y comprometida, no bots",
        "Actividad concentrada los viernes a las 23:00 CST — horario consistente con comunicación encubierta",
        "Interacciones con contenido de narcocultura identificado como indicador de reclutamiento",
        "Presencia de keywords 'Canasteo' y 'Reynosa la Maldosa' en ecosistema de interacciones",
      ],
      riskVector:
        "Perfil con indicadores compatibles con participación en el ecosistema de comunicación de grupos criminales de Tamaulipas. No se ha confirmado actividad de reclutamiento directo de menores al momento del análisis. El riesgo es real pero requiere validación antes de ser clasificado como amenaza activa.",
      recommendation:
        "Análisis humano del historial completo de interacciones. Si se confirma patrón de reclutamiento activo: reporte a FGR — FEADLE con evidencia documentada.",
    },
    timeline: [
      {
        time: "2026-04-26T08:50:00Z",
        title: "Perfil identificado — Layers Guard",
        description:
          "LG-TikTok-Monitor identifica @angelriver053 por indicadores de afinidad criminal en interacciones.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:51:00Z",
        title: "Clasificación automática",
        description:
          "LayersCore-Guardian-v1 clasifica como perfil de riesgo alto. Confianza: 85%. Severidad: Alta.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:51:59Z",
        title: "Captura de evidencia",
        description:
          "Captura del perfil con métricas almacenada en sistema de evidencia con timestamp verificable.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:52:00Z",
        title: "Caso tk-002 creado",
        description: "Caso generado y enviado a cola de revisión. Monitoreo activo activado.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Análisis de historial completo",
        description: "Revisión de interacciones y DMs para determinar nivel de riesgo real.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "FGR — FEADLE + Ciberpolicía Nacional (si se confirma reclutamiento)",
      status: "not_escalated",
      sla: "8 horas (alto)",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── tk-003 — Emoji IOC code symbols ──────────────────────────────────────────
  {
    id: "tk-003",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "Múltiples cuentas no identificadas",
    userContext: "patrón de comunicación encubierta en comentarios",
    approximateLocation: "No determinable",
    sourceIp: "N/D — actividad en comentarios públicos",
    riskType: "Código simbólico con indicadores de comunicación encubierta",
    severity: "high",
    status: "open",
    confidence: 76,
    timestamp: "2026-04-26T08:35:00Z",
    summary:
      "Layers Guard detectó un patrón de uso recurrente de emojis 🥷🪖🍕🐔😈 en comentarios de TikTok dirigidos a perfiles con indicadores de minoría de edad. El uso coordinado de estos símbolos en el contexto observado es compatible con patrones de comunicación encubierta documentados en análisis previos de reclutamiento digital. La confianza del modelo es media (76%) — la interpretación simbólica requiere validación por analista con contexto cultural específico.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    riskScore: 68,
    hypothesis:
      "Posible uso de código simbólico para comunicación encubierta entre actores de riesgo en TikTok. El patrón de uso coordinado de emojis específicos en comentarios hacia menores es compatible con señales de reclutamiento encubierto. Esta hipótesis tiene confianza media y requiere validación humana con contexto cultural.",
    evidence: [],
    iocEntries: [
      {
        tipo: "emoji",
        valor: "🥷",
        categoria: "Comunicación encubierta",
        severidad: "high",
        confianza: 82,
        explicacion:
          "Ninja — emoji con uso documentado en comunicaciones de reclutamiento encubierto. Aparece de forma recurrente en los comentarios analizados.",
      },
      {
        tipo: "emoji",
        valor: "🪖",
        categoria: "Comunicación encubierta",
        severidad: "high",
        confianza: 78,
        explicacion:
          "Casco militar — emoji asociado a grupos paramilitares y de crimen organizado en comunicaciones de redes sociales.",
      },
      {
        tipo: "emoji",
        valor: "🍕",
        categoria: "Código de reclutamiento",
        severidad: "medium",
        confianza: 65,
        explicacion:
          "Pizza — emoji con uso en código de comunicación de grupos criminales. Confianza media — requiere contexto adicional para confirmar.",
      },
      {
        tipo: "emoji",
        valor: "🐔",
        categoria: "Código de comunicación",
        severidad: "medium",
        confianza: 63,
        explicacion:
          "Pollo — presente en el patrón de emojis coordinados. Uso simbólico en comunicaciones de grupos de la región noreste.",
      },
      {
        tipo: "emoji",
        valor: "😈",
        categoria: "Comunicación de riesgo",
        severidad: "high",
        confianza: 74,
        explicacion:
          "Diablo sonriente — emoji de uso frecuente en comunicaciones de grupos criminales y en contextos de reclutamiento agresivo.",
      },
    ],
    recommendedActions: [
      "Revisar el contexto completo de los comentarios donde aparecen estos emojis antes de clasificar como amenaza.",
      "Validar con analista especializado en comunicación de grupos criminales del noreste de México.",
      "Identificar las cuentas que repiten el patrón para determinar si existe coordinación.",
      "Si se confirma código coordinado: documentar el patrón para base de conocimiento de Layers Guard.",
    ],
    artifacts: [
      { type: "keyword", value: "🥷🪖🍕🐔😈 (patrón de emojis)", confidence: 76, description: "Patrón de uso coordinado en comentarios hacia perfiles de menores" },
    ],
    investigation: {
      findings:
        "Se detectó el uso coordinado de los emojis 🥷🪖🍕🐔😈 en comentarios de múltiples cuentas de TikTok dirigidos a perfiles con indicadores de minoría de edad. El patrón de uso no es aleatorio — los emojis aparecen en combinaciones específicas y de forma recurrente. Sin embargo, la interpretación del significado de estos símbolos requiere contexto cultural especializado y validación humana.",
      correlatedEvidence: [
        "Patrón de 'emoji code' documentado en análisis de comunicaciones de crimen organizado en redes sociales (referencia: UNODC Digital Threats 2025)",
        "Los emojis 🥷 y 🪖 correlacionan con casos previos de reclutamiento identificados por LG (LG-2026-019, LG-2026-025)",
      ],
      observedSignals: [
        "Combinación de 5 emojis específicos en comentarios hacia el mismo perfil de menores",
        "Patrón de uso no aleatorio — aparece en secuencias similares en múltiples cuentas",
        "Concentración de comentarios en perfiles con indicadores de minoría de edad",
      ],
      riskVector:
        "Patrón de comunicación con indicadores de coordinación encubierta. La confianza media del modelo refleja la ambigüedad inherente de la interpretación simbólica. El riesgo potencial es alto si se confirma el uso intencionado como código.",
      recommendation:
        "Validación humana con contexto cultural especializado antes de cualquier acción. Documentar el patrón para enriquecer el modelo de detección de Layers Guard.",
    },
    timeline: [
      {
        time: "2026-04-26T08:34:00Z",
        title: "Patrón de emojis detectado",
        description: "LG-TikTok-Monitor identifica uso coordinado de emojis de riesgo en comentarios.",
        status: "completed",
      },
      {
        time: "2026-04-26T08:35:00Z",
        title: "Caso tk-003 creado",
        description: "Clasificado como código simbólico de riesgo alto. Confianza: 76%. Enviado a revisión.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Validación de contexto",
        description: "Revisión por analista con expertise en comunicación de grupos criminales.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG — análisis cultural",
      status: "not_escalated",
      sla: "8 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── tk-004 — Audios narcocultura ──────────────────────────────────────────────
  {
    id: "tk-004",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "Múltiples cuentas de TikTok",
    userContext: "videos con audio de narcocultura dirigidos a menores",
    approximateLocation: "Noreste de México (Tamaulipas / Nuevo León — referencia en contenido)",
    sourceIp: "N/D — contenido público",
    riskType: "Contenido auditivo con referencias a crimen organizado y reclutamiento",
    severity: "high",
    status: "open",
    confidence: 83,
    timestamp: "2026-04-26T07:22:00Z",
    summary:
      "Layers Guard detectó los audios 'Reynosa la Maldosa' y 'El Canasteo' en videos de TikTok dirigidos a perfiles con indicadores de minoría de edad. Las letras contienen referencias explícitas a reclutamiento forzado y glorificación de actividades de crimen organizado. El uso de estos audios específicos en videos orientados a perfiles jóvenes es un indicador de riesgo activo que requiere validación humana.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    riskScore: 75,
    hypothesis:
      "Posible uso deliberado de contenido musical de narcocultura para normalizar la cultura del crimen organizado entre menores y facilitar el reclutamiento. La selección específica de estos audios, el contexto de los videos y la orientación hacia perfiles de menores sugiere un patrón coordinado.",
    geolocation: "Noreste de México — Tamaulipas / Nuevo León (referencia en contenido auditivo)",
    evidence: [],
    iocEntries: [
      {
        tipo: "keyword",
        valor: "Reynosa la Maldosa",
        categoria: "Audio de narcocultura",
        severidad: "high",
        confianza: 87,
        explicacion:
          "Audio asociado a grupos criminales de Reynosa, Tamaulipas. Detectado en videos dirigidos a perfiles con indicadores de menores. Letra con referencias a reclutamiento forzado.",
      },
      {
        tipo: "keyword",
        valor: "Canasteo",
        categoria: "Código de reclutamiento",
        severidad: "high",
        confianza: 83,
        explicacion:
          "Término de uso en el contexto de reclutamiento por grupos criminales del noreste de México. Aparece como nombre de audio y como keyword en comentarios.",
      },
      {
        tipo: "emoji",
        valor: "🪖",
        categoria: "Comunicación encubierta",
        severidad: "medium",
        confianza: 71,
        explicacion:
          "Emoji de casco militar presente en los comentarios de los videos con estos audios.",
      },
    ],
    recommendedActions: [
      "Reportar los videos con estos audios a TikTok Trust & Safety para evaluación y posible eliminación.",
      "Documentar qué perfiles de menores han interactuado con este contenido.",
      "Correlacionar con otros indicadores de los actores tk-001 y tk-002 para identificar posible coordinación.",
      "Si se identifica un patrón de reclutamiento activo: escalar a Ciberpolicía Nacional.",
    ],
    artifacts: [
      { type: "keyword", value: "Reynosa la Maldosa", confidence: 87, description: "Audio de narcocultura — referencias a reclutamiento forzado" },
      { type: "keyword", value: "El Canasteo", confidence: 83, description: "Audio con código de reclutamiento — detectado en videos hacia menores" },
    ],
    investigation: {
      findings:
        "Los audios 'Reynosa la Maldosa' y 'El Canasteo' fueron detectados en videos de TikTok que muestran indicadores de estar orientados hacia perfiles de menores (horario de publicación, hashtags utilizados, cuentas a las que se dirigen). Las letras contienen referencias explícitas a grupos criminales del noreste de México y lenguaje asociado al reclutamiento. El análisis no puede determinar si los videos son creados deliberadamente para reclutar o si son contenido de entretenimiento sin intención maliciosa.",
      correlatedEvidence: [
        "Ambos audios correlacionan con el perfil @angelriver053 (caso tk-002) identificado en el mismo período",
        "El término 'Canasteo' aparece como IOC activo en el caso tk-002",
        "'Reynosa la Maldosa' es un marcador geográfico-criminal de Tamaulipas — zona de alta actividad de grupos criminales",
      ],
      observedSignals: [
        "Dos audios distintos con temática de crimen organizado en videos hacia menores en el mismo período",
        "Horario de publicación compatible con audiencia de menores",
        "Correlación con el perfil de Tamaulipas identificado en tk-002",
      ],
      riskVector:
        "Contenido que normaliza la cultura del crimen organizado entre menores. El riesgo de reclutamiento indirecto a través de la normalización cultural es real aunque difícil de cuantificar.",
      recommendation:
        "Reporte a TikTok Trust & Safety. Documentar impacto en perfiles protegidos. Correlacionar con casos tk-001 y tk-002.",
    },
    timeline: [
      {
        time: "2026-04-26T07:21:00Z",
        title: "Audios detectados",
        description: "LG-TikTok-Monitor identifica 'Reynosa la Maldosa' y 'El Canasteo' en videos hacia menores.",
        status: "completed",
      },
      {
        time: "2026-04-26T07:22:00Z",
        title: "Caso tk-004 creado",
        description: "Clasificado como contenido de riesgo alto. Confianza: 83%. En espera de revisión.",
        status: "completed",
      },
      {
        time: "2026-04-26T07:22:00Z",
        title: "Marcado como procesado",
        description: "Señal recibida y en proceso de correlación con casos tk-001 y tk-002.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Reporte a TikTok Trust & Safety",
        description: "Enviar evidencia de los videos con estos audios para evaluación.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety TikTok + Ciberpolicía (si se confirma reclutamiento)",
      status: "not_escalated",
      sla: "8 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── tk-005 — Keyword "trabajo fácil" ─────────────────────────────────────────
  {
    id: "tk-005",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "Múltiples cuentas — posible campaña coordinada",
    userContext: "publicaciones aspiracionales dirigidas a menores",
    approximateLocation: "No determinable — distribución nacional",
    sourceIp: "N/D — contenido público",
    riskType: "Campaña de reclutamiento aspiracional con keyword de alto riesgo",
    severity: "high",
    status: "open",
    confidence: 86,
    timestamp: "2026-04-26T06:58:00Z",
    summary:
      "Layers Guard detectó la keyword 'trabajo fácil' en 12 publicaciones recientes de TikTok con indicadores de estar dirigidas a perfiles con características de menores de edad. En 7 de los 12 casos se identificó un patrón de redirección hacia contacto privado. La distribución del patrón en múltiples cuentas en el mismo período es compatible con una campaña coordinada de reclutamiento aspiracional.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "pending_review",
    riskScore: 79,
    hypothesis:
      "Campaña coordinada de reclutamiento aspiracional usando la keyword 'trabajo fácil' para captar la atención de menores con promesas económicas y redirigirlos hacia contacto privado. El patrón en múltiples cuentas en el mismo período sugiere coordinación.",
    evidence: [],
    iocEntries: [
      {
        tipo: "keyword",
        valor: "trabajo fácil",
        categoria: "Reclutamiento aspiracional",
        severidad: "high",
        confianza: 89,
        explicacion:
          "Keyword central de la campaña detectada. Aparece en 12 publicaciones con indicadores de orientación hacia menores. Asociada a promesas de ingresos sin verificación de edad.",
      },
      {
        tipo: "keyword",
        valor: "mensaje privado",
        categoria: "Redirección encubierta",
        severidad: "high",
        confianza: 84,
        explicacion:
          "Instrucción de redirección a contacto privado presente en 7 de los 12 casos. Indicador de intención de mover la conversación fuera de la plataforma pública.",
      },
    ],
    recommendedActions: [
      "Identificar las 12 cuentas específicas y analizar si tienen patrones de coordinación comunes.",
      "Verificar si alguna de las cuentas tiene contacto previo con perfiles de menores protegidos.",
      "Reportar los 12 videos a TikTok Trust & Safety con la evidencia del patrón coordinado.",
      "Correlacionar con el caso tk-001 (@user1334248711265) que también usa 'trabajo fácil' como keyword.",
      "Si se confirma campaña coordinada: escalar a Ciberpolicía Nacional con evidencia de coordinación.",
    ],
    artifacts: [
      { type: "keyword", value: "trabajo fácil", confidence: 89, description: "12 publicaciones con este keyword dirigidas a menores — posible campaña coordinada" },
      { type: "keyword", value: "mensaje privado", confidence: 84, description: "Instrucción de redirección a DMs presente en 7 de 12 casos" },
    ],
    investigation: {
      findings:
        "El análisis de las 12 publicaciones con la keyword 'trabajo fácil' muestra un patrón consistente: contenido aspiracional sobre ingresos fáciles, sin requisitos de experiencia ni verificación de edad, con llamada a la acción que dirige al usuario hacia mensajes privados. La distribución en múltiples cuentas en el mismo período y el patrón repetido sugieren coordinación, aunque podría tratarse también de contenido orgánico que imita un estilo popular.",
      correlatedEvidence: [
        "La keyword 'trabajo fácil' correlaciona con el caso tk-001 (@user1334248711265) como IOC activo",
        "Patrón de 'keyword aspiracional + redirección a DM' documentado en 5 casos previos de LG (reportes Q1 2026)",
        "7 de las 12 cuentas fueron creadas en los últimos 30 días — indicador de posible campaña nueva",
      ],
      observedSignals: [
        "12 publicaciones con el mismo keyword en un período de 48 horas",
        "7 de 12 con instrucción de redirección a mensajes privados",
        "Mayoría de cuentas creadas en los últimos 30 días",
        "Publicaciones sin verificación de edad en las interacciones",
      ],
      riskVector:
        "Campaña de captación con indicadores de coordinación. La escala (12 publicaciones, posiblemente más no detectadas) amplifica el riesgo de exposición masiva de menores.",
      recommendation:
        "Reporte coordinado a TikTok Trust & Safety. Identificar y monitorear las 12 cuentas. Correlacionar con tk-001.",
    },
    timeline: [
      {
        time: "2026-04-26T06:57:00Z",
        title: "Keyword detectada",
        description: "LG detecta 'trabajo fácil' en 12 publicaciones con indicadores de orientación a menores.",
        status: "completed",
      },
      {
        time: "2026-04-26T06:58:00Z",
        title: "Caso tk-005 creado",
        description: "Clasificado como campaña de reclutamiento de riesgo alto. Confianza: 86%.",
        status: "completed",
      },
      {
        time: "2026-04-26T06:58:00Z",
        title: "Marcado como procesado",
        description: "Señal en proceso de correlación con casos activos.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Identificación de cuentas coordinadas",
        description: "Análisis de las 12 cuentas para confirmar coordinación.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety TikTok + Ciberpolicía (si se confirma campaña)",
      status: "not_escalated",
      sla: "8 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── tk-006 — Patrón "mensaje privado" ────────────────────────────────────────
  {
    id: "tk-006",
    source: "layers_guard",
    platform: "tiktok",
    accountHandle: "8 cuentas nuevas de TikTok",
    userContext: "cuentas sin publicaciones orientadas a contacto directo con menores",
    approximateLocation: "No determinable",
    sourceIp: "N/D",
    riskType: "Patrón de captación mediante mensajes directos",
    severity: "medium",
    status: "open",
    confidence: 74,
    timestamp: "2026-04-26T05:44:00Z",
    summary:
      "Layers Guard detectó 8 cuentas nuevas de TikTok con actividad concentrada exclusivamente en mensajes directos hacia perfiles con indicadores de minoría de edad. Las cuentas no tienen publicaciones públicas, lo que es atípico y sugiere que fueron creadas únicamente para contacto directo. El modelo clasificó este patrón como de riesgo medio con confianza del 74% — se requiere revisión humana para confirmar la intención.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "auto_classified",
    riskScore: 61,
    hypothesis:
      "Posibles cuentas creadas exclusivamente para contacto directo con menores sin dejar rastro público. El patrón de 'sin publicaciones + DMs activos hacia menores' es un indicador de captación encubierta, aunque podría tratarse de usuarios con privacidad alta. Requiere validación.",
    evidence: [],
    iocEntries: [
      {
        tipo: "keyword",
        valor: "mensaje privado",
        categoria: "Captación encubierta",
        severidad: "medium",
        confianza: 74,
        explicacion:
          "Patrón de solicitud de contacto privado en 8 cuentas nuevas sin publicaciones. El comportamiento es atípico y compatible con captación encubierta.",
      },
    ],
    recommendedActions: [
      "Revisar si las 8 cuentas tienen interacciones con los mismos perfiles de menores protegidos.",
      "Verificar si estas cuentas tienen relación con los casos tk-001 o tk-005.",
      "Si se detecta contacto con perfiles protegidos: escalar a revisión prioritaria.",
      "Mantener monitoreo pasivo sin alertar a los actores.",
    ],
    artifacts: [
      { type: "keyword", value: "mensaje privado (patrón en 8 cuentas)", confidence: 74, description: "8 cuentas nuevas sin publicaciones con DMs activos hacia menores" },
    ],
    investigation: {
      findings:
        "Las 8 cuentas identificadas tienen en común: creación reciente, ausencia de publicaciones públicas y actividad concentrada en mensajes directos hacia perfiles con indicadores de minoría de edad. Este comportamiento es atípico para usuarios orgánicos pero podría explicarse por razones de privacidad legítimas. La confianza del 74% refleja esta ambigüedad.",
      correlatedEvidence: [
        "Patrón de 'cuenta nueva + solo DMs' correlaciona con casos de captación en fases tempranas (reportes LG Q4 2025)",
      ],
      observedSignals: [
        "8 cuentas nuevas sin publicaciones públicas",
        "Actividad concentrada en mensajes directos hacia menores",
        "Creación reciente de las cuentas (últimos 7 días)",
      ],
      riskVector:
        "Riesgo medio. El patrón es compatible con captación encubierta pero también con comportamiento legítimo de alta privacidad. Se requiere más contexto.",
      recommendation:
        "Monitoreo pasivo. Escalamiento solo si se detecta contacto confirmado con perfiles de menores protegidos.",
    },
    timeline: [
      {
        time: "2026-04-26T05:43:00Z",
        title: "Patrón detectado",
        description: "LG detecta 8 cuentas con comportamiento de DMs exclusivos hacia menores.",
        status: "completed",
      },
      {
        time: "2026-04-26T05:44:00Z",
        title: "Caso tk-006 creado",
        description: "Clasificado como riesgo medio. Confianza: 74%. Monitoreo pasivo activado.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Revisión humana",
        description: "Determinar si el patrón es captación o comportamiento legítimo de privacidad.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Equipo Respuesta LG",
      status: "not_escalated",
      sla: "12 horas",
      lastSent: null,
      reportsSent: 0,
    },
  },

  // ── rblx-001 — Roblox captación de datos ─────────────────────────────────────
  {
    id: "rblx-001",
    source: "layers_guard",
    platform: "roblox",
    accountHandle: "RBX_NewNet_Accounts (3 cuentas)",
    userContext: "menores de 9–11 años en Roblox",
    approximateLocation: "No determinable — distribución nacional",
    sourceIp: "IP compartida entre 3 cuentas — posible infraestructura unificada",
    riskType: "Red coordinada de captación de datos de menores en Roblox",
    severity: "high",
    status: "open",
    confidence: 81,
    timestamp: "2026-04-26T04:15:00Z",
    summary:
      "Layers Guard identificó 3 cuentas nuevas en Roblox con comportamiento coordinado, ofreciendo Robux gratuitos condicionados a que los menores llenen un formulario externo con datos personales. El dominio del formulario fue registrado hace 7 días. La IP compartida entre las 3 cuentas sugiere infraestructura unificada. El patrón es compatible con una operación de captación de datos de menores.",
    classifier: "LayersCore-Guardian-v1",
    validationStatus: "auto_classified",
    riskScore: 77,
    hypothesis:
      "Operación coordinada de captación de datos personales de menores mediante ingeniería social en Roblox. El objetivo puede ser la recopilación de datos para otras formas de explotación o contacto posterior. La infraestructura unificada sugiere un actor con experiencia previa.",
    geolocation: "No determinable — posible operación distribuida",
    accountAge: "Cuentas creadas en los últimos 7 días",
    accountStatus: "Activas — comportamiento coordinado confirmado",
    evidence: [],
    iocEntries: [
      {
        tipo: "handle",
        valor: "RBX_NewNet_Accounts",
        categoria: "Red de cuentas coordinadas",
        severidad: "high",
        confianza: 83,
        explicacion:
          "3 cuentas de Roblox creadas en los últimos 7 días con comportamiento idéntico coordinado. Posible automatización parcial.",
      },
      {
        tipo: "url",
        valor: "hxxps://robux-claim-now[.]net/free",
        categoria: "Phishing / captación de datos",
        severidad: "high",
        confianza: 88,
        explicacion:
          "Dominio de formulario externo registrado hace 7 días. Solicita nombre, correo y número de teléfono del menor para 'recibir Robux gratis'. Sin WHOIS público.",
      },
      {
        tipo: "keyword",
        valor: "Robux gratis",
        categoria: "Ingeniería social",
        severidad: "medium",
        confianza: 91,
        explicacion:
          "Oferta de artículos virtuales condicionada a datos personales — técnica documentada de captación en plataformas de videojuegos.",
      },
    ],
    recommendedActions: [
      "Reportar las 3 cuentas a Roblox Trust & Safety con evidencia de coordinación.",
      "Solicitar takedown del dominio robux-claim-now[.]net por phishing.",
      "Verificar si algún perfil protegido accedió al formulario externo.",
      "Notificar a Ciberpolicía Nacional sobre la operación coordinada de captación de datos de menores.",
      "Alertar a padres/tutores de los perfiles expuestos si se identifica acceso al formulario.",
    ],
    artifacts: [
      { type: "handle",  value: "RBX_NewNet_Accounts (3 cuentas)", confidence: 83, description: "Red de 3 cuentas coordinadas en Roblox — creadas en los últimos 7 días" },
      { type: "url",     value: "hxxps://robux-claim-now[.]net/free", confidence: 88, description: "Dominio phishing para captación de datos de menores — registrado hace 7 días" },
      { type: "keyword", value: "Robux gratis / formulario externo", confidence: 91, description: "Técnica de ingeniería social — oferta condicionada a datos personales" },
    ],
    investigation: {
      findings:
        "Las 3 cuentas de Roblox presentan comportamiento de aproximación idéntico: oferta de Robux gratuitos, dirección hacia formulario externo y solicitud de datos personales. La IP compartida confirma infraestructura unificada. El dominio del formulario fue registrado 7 días antes de la actividad, lo que indica preparación previa. El objetivo aparente es la captación de datos de contacto de menores.",
      correlatedEvidence: [
        "Dominio registrado 7 días antes de la actividad — preparación previa deliberada",
        "Patrón de 'Robux gratis + formulario externo' documentado en alerta de seguridad de Roblox Q1 2026",
        "IP compartida entre 3 cuentas — infraestructura unificada",
      ],
      observedSignals: [
        "3 cuentas nuevas con comportamiento coordinado idéntico",
        "IP compartida — infraestructura centralizada",
        "Dominio phishing activo registrado 7 días antes",
        "Oferta condicionada a datos personales — ingeniería social documentada",
      ],
      riskVector:
        "Captación activa de datos personales de menores en plataforma de videojuegos. Los datos captados pueden usarse para otras formas de explotación o contacto posterior.",
      recommendation:
        "Reporte urgente a Roblox Trust & Safety y takedown de dominio. Notificación a Ciberpolicía si hay víctimas confirmadas.",
    },
    timeline: [
      {
        time: "2026-04-26T04:14:00Z",
        title: "Red coordinada detectada",
        description: "LG-Roblox-Monitor identifica 3 cuentas con comportamiento coordinado y dominio phishing.",
        status: "completed",
      },
      {
        time: "2026-04-26T04:15:00Z",
        title: "Caso rblx-001 creado",
        description: "Clasificado como captación de datos de alto riesgo. Confianza: 81%.",
        status: "completed",
      },
      {
        time: "2026-04-26T04:15:00Z",
        title: "Monitoreo activo",
        description: "Perfiles de menores expuestos bajo monitoreo. Verificando acceso al formulario.",
        status: "active",
      },
      {
        time: "Pendiente",
        title: "Reporte a Roblox Trust & Safety",
        description: "Enviar evidencia de coordinación y solicitar eliminación de las 3 cuentas.",
        status: "pending",
      },
      {
        time: "Pendiente",
        title: "Takedown de dominio",
        description: "Solicitar baja del dominio robux-claim-now[.]net.",
        status: "pending",
      },
    ],
    escalation: {
      suggestedPartner: "Trust & Safety Roblox + Ciberpolicía Nacional",
      status: "not_escalated",
      sla: "6 horas (alto)",
      lastSent: null,
      reportsSent: 0,
    },
  },
];

export function getGuardAlertCase(id: string): AlertCase | undefined {
  return guardAlertCases.find((c) => c.id === id);
}
