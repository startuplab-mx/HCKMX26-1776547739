"use client";

import { useState } from "react";
import { FileText, CheckCircle, AlertTriangle, Layers, Eye, Download, Send, Edit3, X } from "lucide-react";
import {
  reports,
  type Report,
  type ReportType,
  type ReportStatus,
  type ReportSeverity,
} from "@/lib/mock/dashboardSectionsData";

// ── Config maps ───────────────────────────────────────────────────────────────

const TYPE_CFG: Record<ReportType, { label: string; bg: string; text: string }> = {
  executive:        { label: "Ejecutivo",         bg: "bg-brand-50",  text: "text-brand-700"  },
  technical_cti:    { label: "CTI Técnico",        bg: "bg-purple-50", text: "text-purple-700" },
  escalation:       { label: "Escalamiento",       bg: "bg-red-50",    text: "text-red-700"    },
  weekly_trend:     { label: "Tendencia semanal",  bg: "bg-teal-50",   text: "text-teal-700"   },
  territorial_risk: { label: "Riesgo territorial", bg: "bg-amber-50",  text: "text-amber-700"  },
};

const STATUS_CFG: Record<ReportStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft:     { label: "Borrador",    bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-300"  },
  in_review: { label: "En revisión", bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-400"  },
  sent:      { label: "Enviado",     bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500"  },
  archived:  { label: "Archivado",   bg: "bg-slate-100", text: "text-slate-400", dot: "bg-slate-200"  },
};

const SEV_CFG: Record<ReportSeverity, { label: string; bg: string; text: string }> = {
  critical: { label: "Crítica", bg: "bg-red-50",    text: "text-red-700"    },
  high:     { label: "Alta",    bg: "bg-orange-50", text: "text-orange-700" },
  medium:   { label: "Media",   bg: "bg-amber-50",  text: "text-amber-700"  },
  low:      { label: "Baja",    bg: "bg-slate-100", text: "text-slate-600"  },
};

const VALIDATION_CFG = {
  auto_generated:  { label: "Generado automáticamente", icon: Layers,        color: "text-brand-600"  },
  human_validated: { label: "Validado por analista",    icon: CheckCircle,   color: "text-green-600"  },
  pending_review:  { label: "Pendiente de revisión",    icon: AlertTriangle, color: "text-amber-600"  },
};

// ── Report preview panel ──────────────────────────────────────────────────────

function ReportPreview({ report, onClose }: { report: Report; onClose: () => void }) {
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  function mockAction(label: string) {
    setActionMsg(label);
    setTimeout(() => setActionMsg(null), 2000);
  }

  const sev  = SEV_CFG[report.severity];
  const sta  = STATUS_CFG[report.status];
  const type = TYPE_CFG[report.type];
  const val  = VALIDATION_CFG[report.validationStatus];
  const ValIcon = val.icon;

  const formattedDate = new Date(report.date).toLocaleString("es-MX", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 mt-0.5">
          <FileText className="h-4 w-4 text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="font-mono text-[10px] text-slate-400">{report.id}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${type.bg} ${type.text}`}>{type.label}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>{sev.label}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{report.title}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{formattedDate} · {report.partner}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Status + validation */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${sta.dot}`} />
            <span className={`text-xs font-semibold ${sta.text}`}>{sta.label}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${val.color}`}>
            <ValIcon className="h-3.5 w-3.5" />
            {val.label}
          </div>
        </div>

        {/* Summary */}
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Resumen ejecutivo</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{report.summary}</p>
        </section>

        {/* Findings */}
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Hallazgos principales</h4>
          <ul className="space-y-2">
            {report.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0 mt-2" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* Sources */}
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Fuentes utilizadas</h4>
          <div className="flex flex-wrap gap-2">
            {report.sources.map((s, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-brand-400 mb-2">Recomendaciones</h4>
          <ul className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-semibold">Aviso: </span>
              Este informe es de apoyo a la decisión. Cualquier acción operativa requiere validación humana autorizada.
            </p>
          </div>
        </section>

        {/* Action buttons */}
        <section className="space-y-2">
          {actionMsg && (
            <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-2.5 text-xs font-semibold text-green-700">
              {actionMsg}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => mockAction("Vista de informe abierta (demo)")}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 text-white px-3 py-2.5 text-xs font-semibold hover:bg-brand-700 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> Ver informe
            </button>
            <button
              onClick={() => mockAction("Exportación PDF simulada")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Exportar PDF
            </button>
            <button
              onClick={() => mockAction(`Enviado a ${report.partner} (demo)`)}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-white px-3 py-2.5 text-xs font-semibold hover:bg-purple-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Enviar a partner
            </button>
            <button
              onClick={() => mockAction("Marcado en revisión")}
              disabled={report.status === "in_review"}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-3 py-2.5 text-xs font-semibold hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Edit3 className="h-3.5 w-3.5" /> Marcar en revisión
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function ReportsView() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterType, setFilterType] = useState<ReportType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");

  const filtered = reports
    .filter((r) => filterType   === "all" || r.type   === filterType)
    .filter((r) => filterStatus === "all" || r.status === filterStatus);

  const metrics = [
    { label: "Informes generados",         value: "156",   sub: "total acumulado"        },
    { label: "Informes críticos",          value: "18",    sub: "severidad crítica"       },
    { label: "Partners receptores",        value: "7",     sub: "activos este mes"        },
    { label: "Tiempo promedio generación", value: "2.4 min", sub: "Layers Core pipeline" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Informes</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Reportes ejecutivos, técnicos y operativos generados a partir de inteligencia validada.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-brand-600">{m.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* List + preview */}
      <div className={`grid gap-4 ${selectedReport ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Report list */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-800">Lista de informes</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} informes · click para ver detalle</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as ReportType | "all")}
                className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-6 py-1.5 text-slate-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="all">Todos los tipos</option>
                <option value="executive">Ejecutivo</option>
                <option value="technical_cti">CTI Técnico</option>
                <option value="escalation">Escalamiento</option>
                <option value="weekly_trend">Tendencia semanal</option>
                <option value="territorial_risk">Riesgo territorial</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ReportStatus | "all")}
                className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-6 py-1.5 text-slate-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="in_review">En revisión</option>
                <option value="sent">Enviado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">ID</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Informe</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Tipo</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Severidad</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden lg:table-cell">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => {
                  const sev  = SEV_CFG[r.severity];
                  const sta  = STATUS_CFG[r.status];
                  const type = TYPE_CFG[r.type];
                  const date = new Date(r.date).toLocaleDateString("es-MX", { month: "short", day: "numeric" });
                  const isSelected = selectedReport?.id === r.id;
                  return (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedReport(isSelected ? null : r)}
                      className={`cursor-pointer transition-colors group ${isSelected ? "bg-brand-50" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{r.id}</td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className={`font-medium leading-tight line-clamp-1 transition-colors ${isSelected ? "text-brand-700" : "text-slate-800 group-hover:text-brand-700"}`}>
                          {r.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{r.partner} · {date}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${type.bg} ${type.text}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${sta.dot}`} />
                          <span className={`text-[10px] font-semibold ${sta.text}`}>{sta.label}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-400">No hay informes con los filtros seleccionados.</div>
            )}
          </div>
        </div>

        {/* Preview */}
        {selectedReport && (
          <ReportPreview report={selectedReport} onClose={() => setSelectedReport(null)} />
        )}
      </div>
    </div>
  );
}
