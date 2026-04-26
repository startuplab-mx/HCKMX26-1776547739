"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Shield,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Layers,
  FileDown,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import {
  getAlertCase,
  getSeverityConfig,
  getStatusConfig,
  getPlatformConfig,
  type CaseStatus,
  type AlertCase,
  type AlertIOC,
  type EvidenceItem,
  type EscalationStatus,
} from "@/lib/mock/ctiData";
import { getGuardAlertCase } from "@/lib/mock/guardAlertsData";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "resumen" | "evidencia" | "iocs" | "timeline" | "recomendaciones";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumen",         label: "Resumen"         },
  { id: "evidencia",       label: "Evidencia"        },
  { id: "iocs",            label: "IOCs"             },
  { id: "timeline",        label: "Timeline"         },
  { id: "recomendaciones", label: "Recomendaciones"  },
];

export interface AlertDetailDrawerProps {
  caseId: string | null;
  localStatus?: CaseStatus;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: CaseStatus) => void;
}

// ── Badge configs ─────────────────────────────────────────────────────────────

const IOC_TIPO_CFG: Record<string, { label: string; bg: string; text: string }> = {
  emoji:   { label: "Emoji",   bg: "bg-violet-100", text: "text-violet-700" },
  handle:  { label: "Handle",  bg: "bg-blue-50",    text: "text-blue-700"   },
  url:     { label: "URL",     bg: "bg-orange-50",  text: "text-orange-700" },
  ip:      { label: "IP",      bg: "bg-red-50",     text: "text-red-700"    },
  keyword: { label: "Keyword", bg: "bg-amber-50",   text: "text-amber-700"  },
  hash:    { label: "Hash",    bg: "bg-slate-100",  text: "text-slate-600"  },
  domain:  { label: "Domain",  bg: "bg-indigo-50",  text: "text-indigo-700" },
  location:{ label: "Lugar",   bg: "bg-teal-50",    text: "text-teal-700"   },
  email:   { label: "Email",   bg: "bg-pink-50",    text: "text-pink-700"   },
};

const SEV_DOT: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-orange-400",
  medium:   "bg-amber-400",
  low:      "bg-blue-400",
  info:     "bg-slate-300",
};

const ESCALATION_CFG: Record<EscalationStatus, { label: string; dot: string; text: string }> = {
  not_escalated: { label: "No escalado",    dot: "bg-slate-300",  text: "text-slate-500"  },
  pending:       { label: "Pendiente",      dot: "bg-amber-400",  text: "text-amber-700"  },
  sent:          { label: "Enviado",        dot: "bg-blue-500",   text: "text-blue-700"   },
  acknowledged:  { label: "Acuse recibido", dot: "bg-purple-500", text: "text-purple-700" },
  resolved:      { label: "Resuelto",       dot: "bg-green-500",  text: "text-green-700"  },
};

const VALIDATION_CFG = {
  auto_classified: { label: "Clasificado automáticamente", icon: Layers,        color: "text-brand-600"  },
  human_validated: { label: "Validado por analista",       icon: CheckCircle,   color: "text-green-600"  },
  pending_review:  { label: "Pendiente de revisión",       icon: AlertTriangle, color: "text-amber-600"  },
};

// ── Tab: Resumen ──────────────────────────────────────────────────────────────

function ResumenTab({ c, effectiveStatus }: { c: AlertCase; effectiveStatus: CaseStatus }) {
  const sev    = getSeverityConfig(c.severity);
  const sta    = getStatusConfig(effectiveStatus);
  const val    = VALIDATION_CFG[c.validationStatus];
  const ValIcon = val.icon;
  const dt     = new Date(c.timestamp).toLocaleString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="space-y-5">
      {/* Summary */}
      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Resumen ejecutivo
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed">{c.summary}</p>
      </section>

      {/* Hypothesis — new enriched field */}
      {c.hypothesis && (
        <section className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-brand-400 mb-2">
            Hipótesis de análisis
          </h4>
          <p className="text-xs text-brand-800 leading-relaxed italic">"{c.hypothesis}"</p>
          <p className="text-[10px] text-brand-400 mt-2">
            Indicadores compatibles con el patrón observado · requiere validación humana
          </p>
        </section>
      )}

      {/* Classification grid */}
      <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Clasificación
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Tipo de riesgo",  value: c.riskType },
            { label: "Severidad",       value: <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{sev.label}</span> },
            { label: "Confianza",       value: <span className="text-sm font-bold text-slate-800">{c.confidence}%</span> },
            { label: "Clasificador",    value: <span className="font-mono text-xs text-slate-600">{c.classifier}</span> },
            { label: "Validación",      value: <span className={`flex items-center gap-1 text-xs font-medium ${val.color}`}><ValIcon className="h-3.5 w-3.5"/>{val.label}</span> },
            { label: "Estado",          value: <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sta.bg} ${sta.text}`}>{sta.label}</span> },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
              <div className="text-xs text-slate-700">{value}</div>
            </div>
          ))}
        </div>

        {/* Risk score bar — new enriched field */}
        {c.riskScore !== undefined && (
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>Score de riesgo Layers Core</span>
              <span className="font-semibold text-slate-600">{c.riskScore}/100</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${c.riskScore}%`,
                  backgroundColor: c.riskScore >= 80 ? "#ef4444" : c.riskScore >= 60 ? "#f97316" : "#f59e0b",
                }}
              />
            </div>
          </div>
        )}

        {/* Confidence bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span>Confianza del modelo</span>
            <span>{c.confidence}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${c.confidence}%`,
                backgroundColor: c.confidence >= 90 ? "#22c55e" : c.confidence >= 75 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
        </div>
      </section>

      {/* Account metadata — enriched + classic */}
      {(c.geolocation || c.language || c.accountAge || c.accountStatus ||
        c.accountHandle || c.userContext || c.approximateLocation || c.sourceIp) && (
        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Metadatos del actor
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {c.accountHandle && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Cuenta origen</p>
                <span className="font-mono text-xs text-slate-700">{c.accountHandle}</span>
              </div>
            )}
            {c.geolocation && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Geolocalización</p>
                <span className="text-xs text-slate-700">{c.geolocation}</span>
              </div>
            )}
            {!c.geolocation && c.approximateLocation && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Localidad aprox.</p>
                <span className="text-xs text-slate-700">{c.approximateLocation}</span>
              </div>
            )}
            {c.language && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Idioma</p>
                <span className="text-xs text-slate-700">{c.language}</span>
              </div>
            )}
            {c.accountAge && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Antigüedad</p>
                <span className="text-xs text-slate-700">{c.accountAge}</span>
              </div>
            )}
            {c.accountStatus && (
              <div className="col-span-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Estado de la cuenta</p>
                <span className="text-xs text-slate-700">{c.accountStatus}</span>
              </div>
            )}
            {c.userContext && !c.accountStatus && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Contexto</p>
                <span className="text-xs text-slate-600">{c.userContext}</span>
              </div>
            )}
            {c.sourceIp && !c.geolocation && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">IP aproximada</p>
                <span className="font-mono text-xs text-slate-700">{c.sourceIp}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Meta row */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { icon: Clock,        label: "Detectado",  value: dt },
          { icon: Shield,       label: "Plataforma", value: getPlatformConfig(c.platform).label },
          { icon: ArrowUpRight, label: "Fuente",     value: c.source === "layers_guard" ? "Layers Guard" : c.source },
          { icon: Eye,          label: "Analista",   value: "Pendiente de asignación" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50">
            <Icon className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
              <div className="text-xs text-slate-700 font-medium mt-0.5">{value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Ethical disclaimer */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Aviso: </span>
            Esta plataforma genera inteligencia de apoyo a la decisión. Los indicadores mostrados son patrones observados que requieren validación humana autorizada antes de cualquier acción operativa.
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Tab: Evidencia ────────────────────────────────────────────────────────────

function EvidenciaTab({ c }: { c: AlertCase }) {
  const items: EvidenceItem[] = c.evidence ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-400">Sin evidencia visual disponible</p>
        <p className="text-xs text-slate-300 max-w-xs">
          Las capturas de pantalla y material visual asociado a este caso no están disponibles en este análisis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-slate-400">{items.length} elemento{items.length !== 1 ? "s" : ""} de evidencia</p>
      {items.map((item) => {
        const ts = new Date(item.timestamp).toLocaleString("es-MX", {
          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
        });
        return (
          <div key={item.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
            {/* Image */}
            <div className="relative bg-slate-100 overflow-hidden" style={{ maxHeight: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full object-cover object-top"
                style={{ maxHeight: 280 }}
              />
            </div>
            {/* Meta */}
            <div className="p-3.5 space-y-2">
              <div>
                <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{item.source}</span>
                <span className="text-[10px] font-mono text-slate-400">{ts}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: IOCs ─────────────────────────────────────────────────────────────────

function IOCRow({ ioc }: { ioc: AlertIOC }) {
  const cfg = IOC_TIPO_CFG[ioc.tipo] ?? IOC_TIPO_CFG["keyword"];
  const dot = SEV_DOT[ioc.severidad] ?? "bg-slate-300";
  const isEmoji = ioc.tipo === "emoji";

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3.5 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text} shrink-0`}>
            {cfg.label}
          </span>
          {isEmoji ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl leading-none">{ioc.valor}</span>
            </div>
          ) : (
            <span className="font-mono text-xs text-slate-700 break-all">{ioc.valor}</span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <span className="text-[10px] text-slate-400 capitalize">{ioc.severidad}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100">
          {ioc.categoria}
        </span>
        <span className="text-[10px] text-slate-400 shrink-0">
          Confianza: <span className="font-semibold text-slate-600">{ioc.confianza}%</span>
        </span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">{ioc.explicacion}</p>
      <div className="h-1 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{
            width: `${ioc.confianza}%`,
            backgroundColor: ioc.confianza >= 85 ? "#22c55e" : ioc.confianza >= 70 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
    </div>
  );
}

function IOCsTab({ c }: { c: AlertCase }) {
  // Use enriched iocEntries if present; fall back to legacy artifacts
  if (c.iocEntries && c.iocEntries.length > 0) {
    return (
      <div className="space-y-3">
        <p className="text-[11px] text-slate-400">{c.iocEntries.length} indicadores de compromiso</p>
        {c.iocEntries.map((ioc, i) => (
          <IOCRow key={i} ioc={ioc} />
        ))}
      </div>
    );
  }

  // Legacy artifacts fallback
  if (c.artifacts.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-400">Sin IOCs extraídos para este caso.</div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-slate-400">{c.artifacts.length} artefactos extraídos</p>
      {c.artifacts.map((a, i) => {
        const iocFallback: AlertIOC = {
          tipo:        a.type,
          valor:       a.value,
          categoria:   a.type.charAt(0).toUpperCase() + a.type.slice(1),
          severidad:   "high",
          confianza:   a.confidence,
          explicacion: a.description,
        };
        return <IOCRow key={i} ioc={iocFallback} />;
      })}
    </div>
  );
}

// ── Tab: Timeline ─────────────────────────────────────────────────────────────

function TimelineTab({ c }: { c: AlertCase }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-slate-400 mb-4">{c.timeline.length} eventos registrados</p>
      <ol className="relative ml-4 border-l-2 border-slate-200 space-y-5">
        {c.timeline.map((ev, i) => {
          const isCompleted = ev.status === "completed";
          const isActive    = ev.status === "active";
          return (
            <li key={i} className="pl-5 relative">
              <span
                className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted ? "border-green-400 bg-green-50"
                  : isActive  ? "border-brand-400 bg-brand-50"
                  :             "border-slate-200 bg-white"
                }`}
              >
                {isCompleted && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                {isActive    && <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />}
              </span>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono text-slate-400">
                  {ev.time === "Pendiente"
                    ? "Pendiente"
                    : new Date(ev.time).toLocaleString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                {isActive    && <span className="text-[9px] font-semibold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded-full">ACTIVO</span>}
                {!isCompleted && !isActive && <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">PENDIENTE</span>}
              </div>
              <p className="text-xs font-semibold text-slate-800">{ev.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{ev.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Tab: Recomendaciones ──────────────────────────────────────────────────────

function RecomendacionesTab({
  c,
  effectiveStatus,
  onStatusChange,
}: {
  c: AlertCase;
  effectiveStatus: CaseStatus;
  onStatusChange: (newStatus: CaseStatus) => void;
}) {
  const [exported, setExported] = useState(false);

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 3_000);
  }

  const esc    = c.escalation;
  const escCfg = ESCALATION_CFG[esc.status];

  // Use enriched recommendedActions if present; fall back to investigation.recommendation
  const hasActions = c.recommendedActions && c.recommendedActions.length > 0;

  return (
    <div className="space-y-5">
      {/* Recommended actions list */}
      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Acciones recomendadas
        </h4>
        {hasActions ? (
          <ol className="space-y-2">
            {c.recommendedActions!.map((action, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                  {i + 1}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{action}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-brand-600" />
              <h4 className="text-xs font-semibold text-brand-800">Recomendación</h4>
            </div>
            <p className="text-xs text-brand-700 leading-relaxed whitespace-pre-line">
              {c.investigation.recommendation}
            </p>
          </div>
        )}
      </section>

      {/* Escalation status */}
      <section className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Escalamiento</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Socio sugerido</p>
            <p className="text-xs text-slate-700">{esc.suggestedPartner}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Estado</p>
            <span className={`flex items-center gap-1.5 text-xs font-semibold ${escCfg.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${escCfg.dot}`} />
              {escCfg.label}
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">SLA</p>
            <p className="text-xs text-slate-700">{esc.sla}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Reportes enviados</p>
            <p className="text-xs font-bold text-slate-800">{esc.reportsSent}</p>
          </div>
        </div>
      </section>

      {/* Action buttons */}
      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Acciones del caso</h4>
        <div className="grid grid-cols-1 gap-2.5">
          <button
            onClick={() => onStatusChange("in_review")}
            disabled={effectiveStatus === "in_review" || effectiveStatus === "closed"}
            className="flex items-center justify-between w-full rounded-xl bg-blue-600 text-white px-4 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Marcar en revisión</span>
            <User className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStatusChange("escalated")}
            disabled={effectiveStatus === "escalated" || effectiveStatus === "closed"}
            className="flex items-center justify-between w-full rounded-xl bg-purple-600 text-white px-4 py-3 text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Escalar caso</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStatusChange("closed")}
            disabled={effectiveStatus === "closed"}
            className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white text-slate-600 px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Cerrar caso</span>
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            className={`flex items-center justify-between w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              exported
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>{exported ? "Reporte generado (demo)" : "Exportar reporte"}</span>
            <FileDown className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Aviso ético: </span>
            La plataforma genera inteligencia de apoyo a la decisión. Cualquier acción operativa requiere validación humana autorizada. Las acciones marcadas aquí son locales al sistema y no tienen efecto externo automático.
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Main drawer ───────────────────────────────────────────────────────────────

export default function AlertDetailDrawer({
  caseId,
  localStatus,
  onClose,
  onStatusChange,
}: AlertDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("resumen");

  useEffect(() => {
    if (!caseId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [caseId, onClose]);

  useEffect(() => {
    setActiveTab("resumen");
  }, [caseId]);

  // Enriched guard case takes priority; fall back to legacy alertCases
  const alertCase = caseId
    ? (getGuardAlertCase(caseId) ?? getAlertCase(caseId))
    : null;
  const effectiveStatus: CaseStatus = localStatus ?? alertCase?.status ?? "open";

  return (
    <AnimatePresence>
      {alertCase && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            {(() => {
              const sev  = getSeverityConfig(alertCase.severity);
              const sta  = getStatusConfig(effectiveStatus);
              const plat = getPlatformConfig(alertCase.platform);
              const dt   = new Date(alertCase.timestamp).toLocaleString("es-MX", {
                day: "numeric", month: "short",
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <div className="shrink-0 border-b border-slate-100">
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div
                      className="mt-1 w-1 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: sev.dot }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="font-mono text-[10px] text-slate-400">{alertCase.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{sev.label}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sta.bg} ${sta.text}`}>{sta.label}</span>
                        <span className="text-[10px] font-medium" style={{ color: plat.color }}>{plat.label}</span>
                        <span className="text-[10px] text-slate-400 ml-auto shrink-0">{dt}</span>
                      </div>
                      <h2 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                        {alertCase.riskType}
                      </h2>
                      {alertCase.accountHandle && (
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">{alertCase.accountHandle}</p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Tab bar */}
                  <div className="flex overflow-x-auto scrollbar-hide px-4 gap-0 border-t border-slate-100">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-brand-500 text-brand-700"
                            : "border-transparent text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Scrollable tab content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {activeTab === "resumen"         && <ResumenTab         c={alertCase} effectiveStatus={effectiveStatus} />}
              {activeTab === "evidencia"       && <EvidenciaTab       c={alertCase} />}
              {activeTab === "iocs"            && <IOCsTab            c={alertCase} />}
              {activeTab === "timeline"        && <TimelineTab        c={alertCase} />}
              {activeTab === "recomendaciones" && (
                <RecomendacionesTab
                  c={alertCase}
                  effectiveStatus={effectiveStatus}
                  onStatusChange={(s) => onStatusChange(alertCase.id, s)}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
