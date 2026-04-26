"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  BarChart3,
  Layers2,
  CircleDot,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Radio,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { isAuthenticated, logout } from "@/lib/auth";
import {
  incidents as ALL_INCIDENTS,
  filterIncidents,
  getRiskLevel,
  TYPE_LABELS,
  SOURCE_LABELS,
  type FilterState,
  DEFAULT_FILTERS,
} from "@/lib/mockData";

import Sidebar, { type SidebarPage } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import MapFilters from "@/components/map/MapFilters";
import DashboardMap from "@/components/map/DashboardMap";
import AnalyticsCharts from "@/components/charts/AnalyticsCharts";
import CTIView from "@/components/dashboard/cti/CTIView";
import type { MapViewMode } from "@/components/map/FilteredMapLeaflet";

// ── Derived stats helpers ─────────────────────────────────────────────────────

function avgRisk(incs: typeof ALL_INCIDENTS) {
  if (!incs.length) return 0;
  return Math.round(incs.reduce((s, i) => s + i.risk, 0) / incs.length);
}

// ── Mini stat card ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color = "brand",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: "brand" | "red" | "amber" | "green";
}) {
  const colorMap = {
    brand: "text-brand-600 bg-brand-50",
    red:   "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    green: "text-emerald-600 bg-emerald-50",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Alert item ────────────────────────────────────────────────────────────────

const SEV_STYLES = {
  high:   "bg-red-50 border-red-100 text-red-600",
  medium: "bg-amber-50 border-amber-100 text-amber-600",
  low:    "bg-emerald-50 border-emerald-100 text-emerald-600",
};

const SEV_ICONS = {
  high:   AlertTriangle,
  medium: Radio,
  low:    CheckCircle2,
};

// ── Page ──────────────────────────────────────────────────────────────────────

type ActiveTab = "map" | "analytics";

export default function DashboardPage() {
  const router = useRouter();

  // Auth guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setHydrated(true);
    }
  }, [router]);

  // App state
  const [activePage, setActivePage]         = useState<SidebarPage>("dashboard");
  const [activeTab, setActiveTab]           = useState<ActiveTab>("map");
  const [viewMode, setViewMode]             = useState<MapViewMode>("heatmap");
  const [filters, setFilters]               = useState<FilterState>(DEFAULT_FILTERS);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Derived data — re-filter only when filters change
  const filtered = useMemo(
    () => filterIncidents(ALL_INCIDENTS, filters),
    [filters]
  );

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-600 flex items-center justify-center">
            <Layers2 className="h-5 w-5 text-white" />
          </div>
          <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-brand-600 animate-spin" />
        </div>
      </div>
    );
  }

  // ── Stats derived from filtered incidents ─────────────────────────────────

  const highCount   = filtered.filter((i) => getRiskLevel(i.risk) === "high").length;
  const mediumCount = filtered.filter((i) => getRiskLevel(i.risk) === "medium").length;
  const overallAvg  = avgRisk(filtered);

  // ── Recent alerts list (top 5 by most recent) ────────────────────────────

  const recentAlerts = [...filtered]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map((inc) => ({
      id:          inc.id,
      zone:        inc.zone,
      description: `${TYPE_LABELS[inc.type]} — ${SOURCE_LABELS[inc.source]}`,
      severity:    getRiskLevel(inc.risk) as "high" | "medium" | "low",
      time:        new Date(inc.timestamp).toLocaleString("es-MX", {
                     month: "short", day: "numeric",
                     hour: "2-digit", minute: "2-digit",
                   }),
    }));

  // ── Page title map ────────────────────────────────────────────────────────

  const PAGE_TITLES: Record<SidebarPage, string> = {
    dashboard: "Resumen General",
    map:       "Inteligencia de Mapa",
    signals:   "Señales Digitales",
    cti:       "Cyber Threat Intelligence",
    reports:   "Informes",
    settings:  "Configuración",
  };

  // ── Placeholder pages ─────────────────────────────────────────────────────

  function PlaceholderPage({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Icon className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">Esta sección está en desarrollo.</p>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        active={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar
          title={PAGE_TITLES[activePage]}
          subtitle={activePage === "dashboard" ? "Inteligencia de riesgo en tiempo real" : undefined}
          onLogout={handleLogout}
          alertCount={highCount}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >

              {/* ── Dashboard / Map page ─────────────────────────────────── */}
              {(activePage === "dashboard" || activePage === "map") && (
                <div className="flex flex-col gap-4 sm:gap-5 h-full">

                  {/* Stat bar */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                    <StatCard
                      label="Total de Incidentes"
                      value={filtered.length}
                      sub={`de ${ALL_INCIDENTS.length} totales`}
                      color="brand"
                    />
                    <StatCard
                      label="Riesgo Alto"
                      value={highCount}
                      sub="≥ 75 puntaje"
                      color="red"
                    />
                    <StatCard
                      label="Riesgo Medio"
                      value={mediumCount}
                      sub="50–74 puntaje"
                      color="amber"
                    />
                    <StatCard
                      label="Puntaje Promedio"
                      value={overallAvg}
                      sub="en zonas activas"
                      color={overallAvg >= 75 ? "red" : overallAvg >= 50 ? "amber" : "green"}
                    />
                  </div>

                  {/* Tab + view toggle bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1 shadow-sm">
                      {([["map", Map, "Vista de Mapa"], ["analytics", BarChart3, "Analítica"]] as const).map(
                        ([id, Icon, label]) => (
                          <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                              activeTab === id
                                ? "bg-brand-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            {label}
                          </button>
                        )
                      )}
                    </div>

                    {activeTab === "map" && (
                      <>
                        <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1 shadow-sm">
                          {([["heatmap", Layers2, "Mapa de Calor"], ["markers", CircleDot, "Marcadores"]] as const).map(
                            ([id, Icon, label]) => (
                              <button
                                key={id}
                                onClick={() => setViewMode(id)}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                  viewMode === id
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                              </button>
                            )
                          )}
                        </div>

                        {/* Mobile filters toggle */}
                        <button
                          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                          className="lg:hidden flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-all"
                        >
                          <SlidersHorizontal className="h-3.5 w-3.5" />
                          Filtros
                        </button>
                      </>
                    )}
                  </div>

                  {/* Main content area */}
                  <AnimatePresence mode="wait">
                    {activeTab === "map" ? (
                      <motion.div
                        key="map-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col lg:flex-row gap-4"
                      >
                        {/* Filters — desktop: sidebar; mobile: collapsible panel */}
                        <div className={`lg:w-52 lg:shrink-0 lg:h-[520px] rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
                          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden">
                            <span className="text-xs font-semibold text-slate-700">Filtros</span>
                            <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <MapFilters
                            filters={filters}
                            onChange={setFilters}
                            resultCount={filtered.length}
                          />
                        </div>

                        {/* Map — no flex-1 on mobile so h-[360px] is the authoritative height Leaflet sees */}
                        <div className="min-w-0 lg:flex-1 rounded-2xl border border-slate-100 shadow-card overflow-hidden h-[360px] sm:h-[420px] lg:h-[520px]">
                          <DashboardMap
                            incidents={filtered}
                            viewMode={viewMode}
                          />
                        </div>

                        {/* Right panels */}
                        <div className="lg:w-64 lg:shrink-0 flex flex-col gap-4 lg:h-[520px] lg:overflow-y-auto">
                          {/* Alerts */}
                          <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                                Alertas Recientes
                              </h3>
                              {highCount > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[9px] font-bold text-red-600">
                                  {highCount}
                                </span>
                              )}
                            </div>
                            {recentAlerts.length === 0 ? (
                              <p className="text-xs text-slate-400 py-4 text-center">
                                Sin alertas para los filtros actuales.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {recentAlerts.map((alert) => {
                                  const Icon = SEV_ICONS[alert.severity];
                                  return (
                                    <div
                                      key={alert.id}
                                      className="flex items-start gap-2.5 rounded-xl border bg-slate-50/50 px-2.5 py-2 hover:bg-white transition-colors"
                                    >
                                      <div
                                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${SEV_STYLES[alert.severity]}`}
                                      >
                                        <Icon className="h-2.5 w-2.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="text-[11px] font-semibold text-slate-700 truncate">
                                            {alert.zone}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                                          {alert.description}
                                        </p>
                                        <p className="text-[9px] text-slate-300 mt-1">{alert.time}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Top risk zones */}
                          <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                              Zonas de Mayor Riesgo
                            </h3>
                            {filtered.length === 0 ? (
                              <p className="text-xs text-slate-400 text-center py-4">Sin datos.</p>
                            ) : (
                              <div className="space-y-2.5">
                                {[...filtered]
                                  .sort((a, b) => b.risk - a.risk)
                                  .slice(0, 6)
                                  .map((inc) => (
                                    <div key={inc.id} className="flex flex-col gap-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-medium text-slate-700 truncate max-w-[120px]">
                                          {inc.zone}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <span
                                            className="text-[11px] font-bold"
                                            style={{
                                              color:
                                                inc.risk >= 75 ? "#ef4444" :
                                                inc.risk >= 50 ? "#f97316" : "#f59e0b",
                                            }}
                                          >
                                            {inc.risk}
                                          </span>
                                          {inc.risk >= 75 ? (
                                            <TrendingUp className="h-3 w-3 text-red-400" />
                                          ) : (
                                            <TrendingDown className="h-3 w-3 text-emerald-400" />
                                          )}
                                        </div>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                          className="h-full rounded-full transition-all duration-500"
                                          style={{
                                            width: `${inc.risk}%`,
                                            backgroundColor:
                                              inc.risk >= 75 ? "#ef4444" :
                                              inc.risk >= 50 ? "#f97316" : "#f59e0b",
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Digital signals */}
                          <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                              Señales Digitales
                            </h3>
                            <div className="space-y-2">
                              {[
                                { label: "Redes Sociales",    volume: 1842, change: "+23%", elevated: true  },
                                { label: "OSINT Feeds",       volume: 347,  change: "+7%",  elevated: false },
                                { label: "Dark Web",          volume: 12,   change: "-3%",  elevated: false },
                                { label: "Agregador de Noticias", volume: 689, change: "+41%", elevated: true },
                              ].map((sig) => (
                                <div
                                  key={sig.label}
                                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                                        sig.elevated ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                                      }`}
                                    >
                                      <Activity className="h-2.5 w-2.5" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-700 truncate">{sig.label}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <span className="text-[11px] font-semibold text-slate-700">
                                      {sig.volume.toLocaleString()}
                                    </span>
                                    <span
                                      className={`text-[9px] font-semibold rounded-full px-1.5 py-0.5 ${
                                        sig.elevated
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-emerald-50 text-emerald-600"
                                      }`}
                                    >
                                      {sig.change}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="analytics-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AnalyticsCharts incidents={filtered} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── CTI page ─────────────────────────────────────────────── */}
              {activePage === "cti" && <CTIView />}

              {/* ── Placeholder pages ─────────────────────────────────────── */}
              {activePage === "signals"  && <PlaceholderPage icon={Activity}  title="Señales Digitales" />}
              {activePage === "reports"  && <PlaceholderPage icon={BarChart3} title="Informes"          />}
              {activePage === "settings" && <PlaceholderPage icon={Activity}  title="Configuración"    />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
