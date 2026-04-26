"use client";

import { motion } from "framer-motion";
import { Layers, RefreshCw, Bell, ChevronDown } from "lucide-react";
import MapCard from "@/components/dashboard/MapCard";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import TrendChart from "@/components/dashboard/TrendChart";
import AlertsList from "@/components/dashboard/AlertsList";
import TopRiskZones from "@/components/dashboard/TopRiskZones";
import DigitalSignals from "@/components/dashboard/DigitalSignals";
import SectionLabel from "@/components/ui/SectionLabel";

export default function DashboardPreview() {
  return (
    <section
      id="dashboard"
      className="section-padding bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <SectionLabel>Panel en Vivo</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Inteligencia a primera vista
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            Un centro de comando unificado para monitorear el riesgo territorial,
            señales digitales y amenazas emergentes — en tiempo real.
          </motion.p>
        </div>

        {/* Dashboard frame */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-slate-200 bg-white shadow-[0_32px_80px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          {/* Mac-style title bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3 py-1 min-w-0 flex-1 max-w-xs mx-auto">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-brand-600">
                <Layers className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-600 truncate">
                Layers Intel — Centro de Mando
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="hidden sm:flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2 py-1 text-[10px] text-slate-500 hover:bg-slate-50 transition-colors">
                <RefreshCw className="h-2.5 w-2.5" />
                En vivo
              </button>
              <button className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                <Bell className="h-3.5 w-3.5 text-slate-500" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>

          {/* Dashboard body */}
          <div className="grid grid-cols-12 gap-4 p-5 bg-slate-50/40">
            {/* Left sidebar */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              {/* Risk score */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Riesgo General
                </div>
                <RiskScoreCard />
              </div>

              {/* Top risk zones */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Zonas de Mayor Riesgo
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <TopRiskZones />
              </div>
            </div>

            {/* Center: Map + Chart */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
              {/* Map */}
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Mapa de Calor Territorial
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      Región Metro A
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
                <div className="h-[220px] lg:h-[260px]">
                  <MapCard />
                </div>
              </div>

              {/* Trend chart */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Tendencias de Riesgo e Incidentes
                  </div>
                  <div className="flex items-center gap-3 text-[9px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-4 rounded bg-brand-400/60 inline-block" />
                      Puntaje de Riesgo
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-4 rounded bg-orange-400/60 inline-block" />
                      Incidentes
                    </span>
                  </div>
                </div>
                <TrendChart />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              {/* Alerts */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Alertas Activas
                  </div>
                  <span className="flex items-center justify-center h-4 w-4 rounded-full bg-red-100 text-[9px] font-bold text-red-600">
                    3
                  </span>
                </div>
                <AlertsList />
              </div>

              {/* Digital signals */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Señales Digitales
                </div>
                <DigitalSignals />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
