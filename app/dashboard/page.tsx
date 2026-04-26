"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Box,
  Layers2,
  CircleDot,
  Map,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Radio,
} from "lucide-react";

import { isAuthenticated, logout } from "@/lib/auth";
import {
  incidents as ALL_INCIDENTS,
  getRiskLevel,
  TYPE_LABELS,
  SOURCE_LABELS,
} from "@/lib/mockData";
import { useHeatmapPolling } from "@/lib/hooks/useHeatmapPolling";

import Sidebar, { type SidebarPage } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import AnalyticsCharts from "@/components/charts/AnalyticsCharts";
import CTIView from "@/components/dashboard/cti/CTIView";
import DigitalSignalsView from "@/components/dashboard/sections/DigitalSignalsView";
import ReportsView from "@/components/dashboard/sections/ReportsView";
import SettingsView from "@/components/dashboard/sections/SettingsView";
import RealPointsMapWrapper from "@/components/map/RealPointsMapWrapper";
import LiveHeatmapMap from "@/components/map/LiveHeatmapMap";
import Mapbox3DVolumeMapWrapper from "@/components/map/Mapbox3DVolumeMapWrapper";
import LiveGuardNotification from "@/components/dashboard/LiveGuardNotification";

// ── Types ─────────────────────────────────────────────────────────────────────

type ActiveTab = "map" | "analytics";
type MapView   = "points" | "heatmap" | "3d";

// ── Stat helpers ──────────────────────────────────────────────────────────────

function avgRisk(incs: typeof ALL_INCIDENTS) {
  if (!incs.length) return 0;
  return Math.round(incs.reduce((s, i) => s + i.risk, 0) / incs.length);
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub,
  color = "brand",
}: {
  label: string; value: string | number; sub?: string;
  color?: "brand" | "red" | "amber" | "green";
}) {
  const colorMap = {
    brand: "text-brand-600",
    red:   "text-red-600",
    amber: "text-amber-600",
    green: "text-emerald-600",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-card">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${colorMap[color]}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Alert severity ────────────────────────────────────────────────────────────

const SEV_STYLES = {
  high:   "bg-red-50 border-red-100 text-red-600",
  medium: "bg-amber-50 border-amber-100 text-amber-600",
  low:    "bg-emerald-50 border-emerald-100 text-emerald-600",
};
const SEV_ICONS  = { high: AlertTriangle, medium: Radio, low: CheckCircle2 };

// ── Map view config ───────────────────────────────────────────────────────────

const MAP_VIEWS: {
  id:    MapView;
  label: string;
  desc:  string;
  Icon:  React.ElementType;
}[] = [
  { id: "points",  label: "Mapa 2D",      Icon: CircleDot, desc: "Eventos reales como puntos georreferenciados"      },
  { id: "heatmap", label: "Heatmap Real",  Icon: Layers2,   desc: "Densidad territorial calculada desde Supabase"     },
  { id: "3d",      label: "Volumetría 3D", Icon: Box,       desc: "Columnas por volumen de eventos"                   },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [hydrated,        setHydrated]        = useState(false);
  const [activePage,      setActivePage]      = useState<SidebarPage>("dashboard");
  const [activeTab,       setActiveTab]       = useState<ActiveTab>("map");
  const [mapView,         setMapView]         = useState<MapView>("points");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { points, recentPointIds, notifications, status: pollingStatus, dismissNotification } = useHeatmapPolling();

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    else setHydrated(true);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

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

  // ── Derived stats (from mock incidents — used for auxiliary panels) ─────────

  const highCount   = ALL_INCIDENTS.filter((i) => getRiskLevel(i.risk) === "high").length;
  const mediumCount = ALL_INCIDENTS.filter((i) => getRiskLevel(i.risk) === "medium").length;
  const overallAvg  = avgRisk(ALL_INCIDENTS);

  const recentAlerts = [...ALL_INCIDENTS]
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

  const PAGE_TITLES: Record<SidebarPage, string> = {
    dashboard: "Resumen General",
    map:       "Inteligencia de Mapa",
    signals:   "Señales Digitales",
    cti:       "Cyber Threat Intelligence",
    reports:   "Informes",
    settings:  "Configuración",
  };

  const currentMapView = MAP_VIEWS.find((v) => v.id === mapView)!;

  // ── Layout ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Live toast notifications for new Layers Guard events */}
      <LiveGuardNotification notifications={notifications} onDismiss={dismissNotification} />

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
            >

              {/* ── Dashboard / Map page ────────────────────────────────── */}
              {(activePage === "dashboard" || activePage === "map") && (
                <div className="flex flex-col gap-4 sm:gap-5">

                  {/* Stat bar */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                    <StatCard label="Total de Incidentes" value={ALL_INCIDENTS.length} sub="en base de datos" color="brand" />
                    <StatCard label="Riesgo Alto"   value={highCount}   sub="≥ 75 puntaje" color="red"   />
                    <StatCard label="Riesgo Medio"  value={mediumCount} sub="50–74 puntaje" color="amber" />
                    <StatCard
                      label="Puntaje Promedio"
                      value={overallAvg}
                      sub="en zonas activas"
                      color={overallAvg >= 75 ? "red" : overallAvg >= 50 ? "amber" : "green"}
                    />
                  </div>

                  {/* Top-level tabs: Mapa | Analítica */}
                  <div className="flex rounded-xl border border-slate-200 bg-white p-1 gap-1 shadow-sm w-fit">
                    {([["map", Map, "Mapa"], ["analytics", BarChart3, "Analítica"]] as const).map(
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

                  {/* Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "map" ? (
                      <motion.div
                        key="map-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                      >
                        {/* ── Geo toolbar ───────────────────────────────── */}
                        <div className="rounded-2xl border border-slate-100 bg-white shadow-card px-4 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">

                            {/* Title + subtitle */}
                            <div className="min-w-0">
                              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                <span>🗺</span> Inteligencia Geoespacial
                              </h2>
                              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                                {currentMapView.desc}
                              </p>
                            </div>

                            {/* Sub-view tabs + badge */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
                                {MAP_VIEWS.map(({ id, Icon, label }) => (
                                  <button
                                    key={id}
                                    onClick={() => setMapView(id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                      mapView === id
                                        ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                                        : "text-slate-500 hover:text-slate-700"
                                    }`}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                  </button>
                                ))}
                              </div>

                              {pollingStatus === "new-signal" ? (
                                <div className="flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-ping" />
                                  <span className="text-[10px] font-semibold text-violet-700 whitespace-nowrap">
                                    Nueva señal detectada
                                  </span>
                                </div>
                              ) : pollingStatus === "polling" ? (
                                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
                                  <span className="text-[10px] font-semibold text-slate-500 whitespace-nowrap">
                                    Revisando…
                                  </span>
                                </div>
                              ) : pollingStatus === "error" ? (
                                <div className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                  <span className="text-[10px] font-semibold text-red-600 whitespace-nowrap">
                                    Error de conexión
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[10px] font-semibold text-emerald-700 whitespace-nowrap">
                                    {pollingStatus === "loading" ? "Conectando…" : "Monitoreando · cada 5s"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Map area ──────────────────────────────────── */}
                        <div className={`flex flex-col gap-4 ${mapView !== "3d" ? "lg:flex-row" : ""}`}>

                          {/* Map container */}
                          <div
                            className={`min-w-0 rounded-2xl border shadow-card overflow-hidden ${
                              mapView === "3d"
                                ? "w-full border-slate-800 bg-slate-900"
                                : "lg:flex-1 border-slate-100 h-[360px] sm:h-[420px] lg:h-[520px]"
                            }`}
                          >
                            <AnimatePresence mode="wait">
                              {mapView === "points" && (
                                <motion.div key="points" className="absolute inset-0"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ position: "relative", width: "100%", height: "100%" }}
                                >
                                  <RealPointsMapWrapper
                                    points={points.length > 0 ? points : undefined}
                                    recentPointIds={recentPointIds}
                                  />
                                </motion.div>
                              )}
                              {mapView === "heatmap" && (
                                <motion.div key="heatmap" className="absolute inset-0"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ position: "relative", width: "100%", height: "100%" }}
                                >
                                  <LiveHeatmapMap points={points.length > 0 ? points : undefined} />
                                </motion.div>
                              )}
                              {mapView === "3d" && (
                                <motion.div key="3d"
                                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Mapbox3DVolumeMapWrapper points={points.length > 0 ? points : undefined} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Right panels — only for 2D views */}
                          {mapView !== "3d" && (
                            <div className="lg:w-64 lg:shrink-0 flex flex-col gap-4 lg:h-[520px] lg:overflow-y-auto">

                              {/* Recent alerts */}
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
                                  <p className="text-xs text-slate-400 py-4 text-center">Sin alertas.</p>
                                ) : (
                                  <div className="space-y-2">
                                    {recentAlerts.map((alert) => {
                                      const Icon = SEV_ICONS[alert.severity];
                                      return (
                                        <div key={alert.id}
                                          className="flex items-start gap-2.5 rounded-xl border bg-slate-50/50 px-2.5 py-2 hover:bg-white transition-colors"
                                        >
                                          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border ${SEV_STYLES[alert.severity]}`}>
                                            <Icon className="h-2.5 w-2.5" />
                                          </div>
                                          <div className="min-w-0">
                                            <span className="text-[11px] font-semibold text-slate-700 truncate block">{alert.zone}</span>
                                            <p className="text-[10px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{alert.description}</p>
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
                                <div className="space-y-2.5">
                                  {[...ALL_INCIDENTS]
                                    .sort((a, b) => b.risk - a.risk)
                                    .slice(0, 6)
                                    .map((inc) => (
                                      <div key={inc.id} className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-medium text-slate-700 truncate max-w-[120px]">{inc.zone}</span>
                                          <div className="flex items-center gap-1">
                                            <span className="text-[11px] font-bold"
                                              style={{ color: inc.risk >= 75 ? "#ef4444" : inc.risk >= 50 ? "#f97316" : "#f59e0b" }}>
                                              {inc.risk}
                                            </span>
                                            {inc.risk >= 75
                                              ? <TrendingUp className="h-3 w-3 text-red-400" />
                                              : <TrendingDown className="h-3 w-3 text-emerald-400" />}
                                          </div>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                          <div className="h-full rounded-full transition-all duration-500"
                                            style={{
                                              width: `${inc.risk}%`,
                                              backgroundColor: inc.risk >= 75 ? "#ef4444" : inc.risk >= 50 ? "#f97316" : "#f59e0b",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>

                              {/* Digital signals */}
                              <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-4">
                                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
                                  Señales Digitales
                                </h3>
                                <div className="space-y-2">
                                  {[
                                    { label: "Redes Sociales",        volume: 1842, change: "+23%", elevated: true  },
                                    { label: "OSINT Feeds",           volume: 347,  change: "+7%",  elevated: false },
                                    { label: "Dark Web",              volume: 12,   change: "-3%",  elevated: false },
                                    { label: "Agregador de Noticias", volume: 689,  change: "+41%", elevated: true  },
                                  ].map((sig) => (
                                    <div key={sig.label}
                                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-2.5 py-2"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                                          sig.elevated ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                                        }`}>
                                          <Activity className="h-2.5 w-2.5" />
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-700 truncate">{sig.label}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        <span className="text-[11px] font-semibold text-slate-700">
                                          {sig.volume.toLocaleString()}
                                        </span>
                                        <span className={`text-[9px] font-semibold rounded-full px-1.5 py-0.5 ${
                                          sig.elevated ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                          {sig.change}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}
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
                        <AnalyticsCharts incidents={ALL_INCIDENTS} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* ── CTI ──────────────────────────────────────────────────── */}
              {activePage === "cti" && <CTIView />}

              {/* ── Sections ─────────────────────────────────────────────── */}
              {activePage === "signals"  && <DigitalSignalsView />}
              {activePage === "reports"  && <ReportsView />}
              {activePage === "settings" && <SettingsView />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
