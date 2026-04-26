"use client";

import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import {
  digitalSignalsMetrics,
  digitalSignalsFeed,
  platformDistributionSignals,
  triggerKeywords,
  type SignalSeverity,
  type SignalStatus,
  type SignalType,
} from "@/lib/mock/dashboardSectionsData";
import { emojiSymbols } from "@/lib/mock/emojiIocs";
import type { GuardEvent } from "@/lib/types/heatmap";
import RiskIndicatorsTable from "@/components/dashboard/RiskIndicatorsTable";

// ── Config maps ───────────────────────────────────────────────────────────────

const SEV_CFG: Record<SignalSeverity, { bg: string; text: string; dot: string; label: string }> = {
  critical: { bg: "bg-red-50",    text: "text-red-700",    dot: "#ef4444", label: "Crítica" },
  high:     { bg: "bg-orange-50", text: "text-orange-700", dot: "#f97316", label: "Alta"    },
  medium:   { bg: "bg-amber-50",  text: "text-amber-700",  dot: "#f59e0b", label: "Media"   },
  low:      { bg: "bg-slate-100", text: "text-slate-600",  dot: "#94a3b8", label: "Baja"    },
};

const STATUS_CFG: Record<SignalStatus, { bg: string; text: string; label: string }> = {
  new:        { bg: "bg-blue-50",   text: "text-blue-700",  label: "Nueva"       },
  processing: { bg: "bg-amber-50",  text: "text-amber-700", label: "Procesando"  },
  classified: { bg: "bg-green-50",  text: "text-green-700", label: "Clasificada" },
  archived:   { bg: "bg-slate-100", text: "text-slate-500", label: "Archivada"   },
};

const TYPE_LABELS: Record<SignalType, string> = {
  keyword_trigger:     "Keyword detonante",
  suspicious_url:      "URL sospechosa",
  private_redirect:    "Redirección privada",
  coordinated_account: "Cuenta coordinada",
  risky_hashtag:       "Hashtag riesgoso",
  associated_ip:       "IP asociada",
};

const PLATFORM_COLORS: Record<string, string> = {
  TikTok:        "#010101",
  Instagram:     "#e1306c",
  Discord:       "#5865f2",
  Roblox:        "#e42020",
  Telegram:      "#06b6d4",
  "Web / Otros": "#64748b",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-brand-600">{value}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
    </div>
  );
}

function PlatformBars() {
  const max = Math.max(...platformDistributionSignals.map((p) => p.count));
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Distribución por plataforma</h3>
      <p className="text-[11px] text-slate-400 mb-4">Señales detectadas por origen</p>
      <div className="space-y-3">
        {platformDistributionSignals.map((p) => (
          <div key={p.platform}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700" style={{ color: PLATFORM_COLORS[p.platform] ?? undefined }}>
                {p.platform}
              </span>
              <span className="text-slate-400 tabular-nums">{p.count.toLocaleString()} · {p.pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(p.count / max) * 100}%`,
                  backgroundColor: PLATFORM_COLORS[p.platform] ?? "#6366f1",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordChips() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-1">Keywords y hashtags detonantes</h3>
      <p className="text-[11px] text-slate-400 mb-4">Términos que activan clasificación de riesgo en Layers Core</p>
      <div className="flex flex-wrap gap-2">
        {triggerKeywords.map((kw) => (
          <span
            key={kw}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-100"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function DigitalSignalsView({ recentGuardEvents = [] }: { recentGuardEvents?: GuardEvent[] }) {
  const [lastRefresh, setLastRefresh] = useState<string>(
    new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );
  const [refreshing, setRefreshing] = useState(false);
  const [filterSev, setFilterSev]   = useState<SignalSeverity | "all">("all");

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 900);
  }, []);

  const filteredFeed = filterSev === "all"
    ? digitalSignalsFeed
    : digitalSignalsFeed.filter((s) => s.severity === filterSev);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">Señales Digitales</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitoreo de actividad digital, señales OSINT e indicadores de riesgo clasificados por Layers Core.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">Actualizado: {lastRefresh}</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-60"
            disabled={refreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar señales
          </button>
        </div>
      </div>

      {/* Metrics — 7 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {digitalSignalsMetrics.map((m) => (
          <MetricCard key={m.id} label={m.label} value={m.value} sub={m.sub} />
        ))}
      </div>

      {/* Platform bars + Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlatformBars />
        <KeywordChips />
      </div>

      {/* Signal feed */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-800">Feed de señales recientes</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{filteredFeed.length} señales</p>
          </div>
          <div className="relative">
            <select
              value={filterSev}
              onChange={(e) => setFilterSev(e.target.value as SignalSeverity | "all")}
              className="appearance-none text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-slate-600 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="all">Todas las severidades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Señal</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Tipo</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Severidad</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden lg:table-cell">Confianza</th>
                <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFeed.map((sig) => {
                const sev         = SEV_CFG[sig.severity];
                const sta         = STATUS_CFG[sig.status];
                const time        = new Date(sig.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
                const hasEmojiIOC = emojiSymbols.some((s) => sig.value.includes(s));
                return (
                  <tr key={sig.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">{sig.id}</td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: sev.dot }} />
                        <span className="text-[10px] font-medium text-slate-500 capitalize">{sig.platform}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-[10px] text-slate-400">{time}</span>
                        {hasEmojiIOC && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                            Emoji IOC detectado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-snug line-clamp-2">{sig.value}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap">
                      <span className="text-[10px] text-slate-500">{TYPE_LABELS[sig.type]}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-16 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${sig.confidence}%`,
                              backgroundColor: sig.confidence >= 85 ? "#22c55e" : sig.confidence >= 70 ? "#f59e0b" : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-[10px] tabular-nums text-slate-500">{sig.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sta.bg} ${sta.text}`}>
                        {sta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredFeed.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              No hay señales con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>

      {/* Unified risk indicators */}
      <RiskIndicatorsTable recentGuardEvents={recentGuardEvents} />
    </div>
  );
}
