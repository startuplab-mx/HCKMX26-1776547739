"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, TrendingUp } from "lucide-react";
import type { GuardEvent } from "@/lib/types/heatmap";
import type { UnifiedIOC, IOCTipo } from "@/lib/types/ioc";
import { unifiedIocs as INITIAL_IOCS } from "@/lib/mock/unifiedIocs";

// ── Config ─────────────────────────────────────────────────────────────────────

const TIPO_CFG: Record<IOCTipo, { label: string; bg: string; text: string }> = {
  emoji:   { label: "Emoji IOC", bg: "bg-violet-100", text: "text-violet-700"  },
  handle:  { label: "Handle",    bg: "bg-blue-50",    text: "text-blue-700"    },
  url:     { label: "URL",       bg: "bg-orange-50",  text: "text-orange-700"  },
  ip:      { label: "IP",        bg: "bg-red-50",     text: "text-red-700"     },
  keyword: { label: "Keyword",   bg: "bg-amber-50",   text: "text-amber-700"   },
};

const SEV_CFG: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-red-50",    text: "text-red-700",    label: "Crítica" },
  high:     { bg: "bg-orange-50", text: "text-orange-700", label: "Alta"    },
  medium:   { bg: "bg-amber-50",  text: "text-amber-700",  label: "Media"   },
  low:      { bg: "bg-slate-100", text: "text-slate-600",  label: "Baja"    },
};

// ── Match logic ────────────────────────────────────────────────────────────────

function matchesIOC(ioc: UnifiedIOC, ev: GuardEvent): boolean {
  const haystack = `${ev.texto ?? ""} ${ev.detalle ?? ""} ${ev.fuente ?? ""}`.toLowerCase();
  switch (ioc.tipo) {
    case "emoji":   return !!(ev.texto?.includes(ioc.valor));
    case "handle":  return haystack.includes(ioc.valor.toLowerCase().replace(/^@/, ""));
    case "keyword": return haystack.includes(ioc.valor.toLowerCase());
    case "ip":      return haystack.includes(ioc.valor.toLowerCase());
    case "url":     return haystack.includes(ioc.valor.replace(/^hxxps?/, "http").toLowerCase());
    default:        return false;
  }
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  recentGuardEvents?: GuardEvent[];
}

const TIPOS: IOCTipo[] = ["emoji", "handle", "url", "ip", "keyword"];

export default function RiskIndicatorsTable({ recentGuardEvents = [] }: Props) {
  const [iocs,   setIocs]   = useState<UnifiedIOC[]>(INITIAL_IOCS);
  const [filter, setFilter] = useState<IOCTipo | "all">("all");
  const [hotIds, setHotIds] = useState<Set<string>>(new Set());
  const processedRef        = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!recentGuardEvents.length) return;
    const newEvts = recentGuardEvents.filter((ev) => !processedRef.current.has(ev.id));
    if (!newEvts.length) return;
    newEvts.forEach((ev) => processedRef.current.add(ev.id));

    const matchedIds = new Set<string>();
    setIocs((prev) =>
      prev.map((ioc) => {
        const hit = newEvts.some((ev) => matchesIOC(ioc, ev));
        if (hit) matchedIds.add(ioc.id);
        return hit ? { ...ioc, hits: ioc.hits + 1, ultima_deteccion: "hace 1 s" } : ioc;
      })
    );

    if (matchedIds.size > 0) {
      setHotIds(matchedIds);
      setTimeout(() => setHotIds(new Set()), 4_000);
    }
  }, [recentGuardEvents]);

  const filtered = iocs
    .filter((ioc) => filter === "all" || ioc.tipo === filter)
    .sort((a, b) => b.score - a.score || b.hits - a.hits);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800">Indicadores de Riesgo</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {filtered.length} indicadores · Emoji IOCs, handles, URLs, IPs y keywords unificados
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos
          </button>
          {TIPOS.map((t) => {
            const cfg = TIPO_CFG[t];
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  filter === t
                    ? `${cfg.bg} ${cfg.text} ring-1 ring-current ring-opacity-30`
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Tipo</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Indicador</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Categoría</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Criticidad</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Score</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Hits</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden lg:table-cell">Última detección</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((ioc) => {
              const tipoCfg = TIPO_CFG[ioc.tipo];
              const sevCfg  = SEV_CFG[ioc.severity] ?? SEV_CFG.low;
              const isEmoji = ioc.tipo === "emoji";
              const isHot   = hotIds.has(ioc.id);

              return (
                <tr
                  key={ioc.id}
                  className={`transition-colors ${
                    isHot   ? "bg-violet-100/60"     :
                    isEmoji ? "bg-violet-50/30 hover:bg-violet-50/60" :
                              "hover:bg-slate-50"
                  }`}
                >
                  {/* Type badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tipoCfg.bg} ${tipoCfg.text}`}>
                      {tipoCfg.label}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3 max-w-[220px]">
                    {isEmoji ? (
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl leading-none select-none" role="img" aria-label={ioc.label}>
                          {ioc.valor}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{ioc.label}</p>
                          {ioc.emoji_meaning && (
                            <p className="text-[10px] text-slate-400 leading-snug line-clamp-1 max-w-[160px]">
                              {ioc.emoji_meaning}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-mono text-[11px] text-slate-700 truncate block max-w-[200px]">
                          {ioc.valor}
                        </span>
                        {ioc.tags && ioc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {ioc.tags.slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[10px] text-slate-500">{ioc.categoria}</span>
                  </td>

                  {/* Criticidad dots */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < ioc.criticidad
                              ? ioc.criticidad >= 5 ? "bg-red-500"
                              : ioc.criticidad >= 4 ? "bg-orange-400"
                              : ioc.criticidad >= 3 ? "bg-amber-400"
                              : "bg-blue-400"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className={`text-[11px] font-bold tabular-nums ${
                      ioc.score >= 85 ? "text-red-600"    :
                      ioc.score >= 70 ? "text-orange-600" :
                      ioc.score >= 55 ? "text-amber-600"  : "text-slate-500"
                    }`}>
                      {ioc.score}
                    </span>
                  </td>

                  {/* Hits */}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      {isHot && <TrendingUp className="h-3 w-3 text-violet-500 shrink-0" />}
                      <span className={`text-[11px] font-semibold tabular-nums ${
                        isHot ? "text-violet-600" : "text-slate-600"
                      }`}>
                        {ioc.hits.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  {/* Last seen */}
                  <td className="px-4 py-3 text-[10px] text-slate-400 hidden lg:table-cell whitespace-nowrap">
                    {ioc.ultima_deteccion}
                  </td>

                  {/* Copy */}
                  <td className="px-4 py-3 text-right">
                    {!isEmoji && (
                      <button
                        onClick={() => navigator.clipboard.writeText(ioc.valor).catch(() => {})}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Copiar"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-400">
            No hay indicadores con el filtro seleccionado.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-violet-100 bg-violet-50/40">
        <p className="text-[11px] text-violet-700 leading-relaxed">
          <span className="font-semibold">Emoji IOCs:</span>{" "}
          patrones semánticos utilizados en entornos digitales para comunicar afiliación, intención
          o contexto de riesgo. Requieren validación humana para confirmar relevancia contextual.
        </p>
      </div>
    </div>
  );
}
