"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  intelligenceQueue,
  getSeverityConfig,
  getStatusConfig,
  getPlatformConfig,
  type Severity,
  type CaseStatus,
} from "@/lib/mock/ctiData";

interface Props {
  onSelectCase: (id: string) => void;
  localStatuses?: Record<string, CaseStatus>;
}

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

export default function IntelligenceQueue({ onSelectCase, localStatuses = {} }: Props) {
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterStatus, setFilterStatus]     = useState<CaseStatus | "all">("all");

  const filtered = intelligenceQueue
    .filter((c) => filterSeverity === "all" || c.severity === filterSeverity)
    .filter((c) => {
      const effectiveStatus = localStatuses[c.id] ?? c.status;
      return filterStatus === "all" || effectiveStatus === filterStatus;
    })
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card flex flex-col overflow-hidden">
      {/* Header + filters */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">Cola de Inteligencia</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{filtered.length} casos · click en fila para ver detalle</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Severity filter */}
          <div className="relative">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as Severity | "all")}
              className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-slate-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="all">Todas las severidades</option>
              <option value="critical">Crítico</option>
              <option value="high">Alto</option>
              <option value="medium">Medio</option>
              <option value="low">Bajo</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as CaseStatus | "all")}
              className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-slate-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="all">Todos los estados</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En proceso</option>
              <option value="in_review">En revisión</option>
              <option value="escalated">Escalado</option>
              <option value="closed">Cerrado</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">ID</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Caso</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Severidad</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Estado</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden lg:table-cell">Asignado</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">IOCs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => {
              const effectiveStatus = (localStatuses[c.id] ?? c.status) as CaseStatus;
              const sev  = getSeverityConfig(c.severity);
              const sta  = getStatusConfig(effectiveStatus);
              const plat = getPlatformConfig(c.platform);
              const updatedTime = new Date(c.updated).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{c.id}</td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <div className="font-medium text-slate-800 leading-tight line-clamp-1 group-hover:text-brand-700 transition-colors">{c.title}</div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {c.accountHandle && (
                        <>
                          <span className="font-mono text-[9px] text-slate-500">{c.accountHandle}</span>
                          <span className="text-slate-200">·</span>
                        </>
                      )}
                      <span className="text-[9px] font-medium" style={{ color: plat.color }}>{plat.label}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-[9px] text-slate-400">{updatedTime}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sta.bg} ${sta.text}`}>
                      {sta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden lg:table-cell truncate max-w-[100px]">
                    {c.assignee}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-600 hidden sm:table-cell">
                    {c.iocCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">
            No hay casos con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
}
