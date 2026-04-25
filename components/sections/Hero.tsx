"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Layers } from "lucide-react";
import Button from "@/components/ui/Button";
import MapCard from "@/components/dashboard/MapCard";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import TrendChart from "@/components/dashboard/TrendChart";
import { alertsData } from "@/lib/mockData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 pt-24 pb-16">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-brand-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-40 h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full bg-blue-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0">
            {/* Eyebrow */}
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                Layers Core · Motor de Inteligencia de Riesgo
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              className="text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Inteligencia de riesgo impulsada por IA para{" "}
              <span className="gradient-text">decisiones más seguras</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.2)}
              className="text-base sm:text-lg leading-relaxed text-slate-500 max-w-lg"
            >
              Layers Intel transforma datos territoriales, digitales, sociales y
              operativos en inteligencia accionable para partners, instituciones,
              empresas y equipos que necesitan anticipar, validar y responder ante riesgos.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Button size="lg" variant="primary" className="w-full sm:w-auto justify-center">
                Solicitar Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center">
                <Play className="h-4 w-4 text-brand-600" />
                Ver Plataforma
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              {...fadeUp(0.4)}
              className="flex items-center gap-6 pt-2 flex-wrap"
            >
              {[
                { value: "12+", label: "Fuentes de Datos" },
                { value: "99.4%", label: "Disponibilidad SLA" },
                { value: "<60s", label: "Latencia de Alerta" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard Mockup — hidden on mobile to avoid overflow */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Floating dashboard card */}
            <div className="relative rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-[0_24px_64px_rgba(97,114,247,0.12)] p-4 lg:p-5">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                    <Layers className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      Panel de Inteligencia
                    </div>
                    <div className="text-[10px] text-slate-400">
                      En vivo · Actualizado ahora
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Map + Risk Score row */}
              <div className="grid grid-cols-5 gap-3 mb-3">
                <div className="col-span-3 rounded-xl overflow-hidden h-[180px]">
                  <MapCard />
                </div>
                <div className="col-span-2 rounded-xl border border-slate-100 bg-white px-2 py-3 flex flex-col items-center justify-center">
                  <RiskScoreCard />
                </div>
              </div>

              {/* Trend chart row */}
              <div className="rounded-xl border border-slate-100 bg-white px-3 pt-3 pb-1 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
                    Tendencia de Riesgo
                  </span>
                  <span className="text-[10px] text-slate-400">8 meses</span>
                </div>
                <TrendChart />
              </div>

              {/* Alerts row */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2">
                <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Alertas Recientes
                </div>
                <div className="space-y-1.5">
                  {alertsData.slice(0, 2).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-2 text-[10px]"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                          alert.severity === "high"
                            ? "bg-red-500"
                            : alert.severity === "medium"
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      />
                      <span className="text-slate-500 truncate">
                        {alert.zone} — {alert.description}
                      </span>
                      <span className="ml-auto text-slate-400 shrink-0">
                        {alert.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 rounded-xl bg-white px-3 py-2 shadow-card border border-slate-100 flex items-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">
                3 nuevas alertas
              </span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-4 -left-4 rounded-xl bg-white px-3 py-2 shadow-card border border-slate-100 flex items-center gap-2"
            >
              <span className="text-xs">🔐</span>
              <span className="text-xs font-medium text-slate-700">
                Arquitectura Segura
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
