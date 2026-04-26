"use client";

import { motion } from "framer-motion";
import { Lock, Building2, Globe, FileText, Cpu, ChevronDown } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const secondarySources = [
  {
    id: "gov",
    Icon: Building2,
    label: "Datos Gubernamentales",
    description: "CDMX, SESNSP, PNT",
  },
  {
    id: "osint",
    Icon: Globe,
    label: "OSINT & Datos Abiertos",
    description: "Redes sociales, noticias, fuentes abiertas",
  },
  {
    id: "reports",
    Icon: FileText,
    label: "Reportes Validados",
    description: "Analistas, campo, inputs humanos",
  },
  {
    id: "specialized",
    Icon: Cpu,
    label: "Fuentes Especializadas",
    description: "ACLED, datasets externos",
  },
];

const engineSteps = [
  "Normalización",
  "Deduplicación",
  "Validación multi-fuente",
  "Clasificación (ML)",
  "Correlación de eventos",
  "Detección de anomalías",
  "Scoring dinámico",
];

const outputs = [
  { label: "Puntajes de Riesgo Dinámicos", icon: "📊" },
  { label: "Alertas en Tiempo Real",        icon: "⚡" },
  { label: "Tendencias y Correlaciones",    icon: "🔍" },
  { label: "Reportes Accionables",          icon: "📄" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-2">
      <div className="h-5 w-px bg-gradient-to-b from-brand-300 to-brand-500" />
      <ChevronDown className="h-3.5 w-3.5 text-brand-500" />
      {label && (
        <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LayersCoreFlow() {
  return (
    <div className="w-full select-none">

      {/* ── LABEL ── */}
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Fuentes de Ingesta
      </p>

      {/* ── LAYERS GUARD (featured) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="relative mb-2.5 overflow-hidden rounded-2xl border-2 border-brand-400 bg-gradient-to-r from-brand-50 to-white px-4 py-3.5 shadow-[0_0_28px_rgba(97,114,247,0.18)]"
      >
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-full bg-brand-200/40 blur-2xl" />

        <div className="relative flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 shadow-lg">
            <Lock className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-bold text-brand-900">Layers Guard</span>
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                Alta confiabilidad
              </span>
              <span className="rounded-full border border-brand-200 bg-brand-100 px-2 py-0.5 text-[9px] font-semibold text-brand-700">
                Fuente Propietaria
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-snug text-brand-600">
              IOCs, señales digitales y comportamiento en tiempo real
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── SECONDARY SOURCES (2×2 grid, 1 col on mobile) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {secondarySources.map(({ id, Icon, label, description }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.06 }}
            className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <Icon className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold leading-tight text-slate-700">{label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CONNECTOR ── */}
      <Connector label="Procesamiento en tiempo real" />

      {/* ── LAYERS CORE ENGINE ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-5 py-5 shadow-[0_0_40px_rgba(97,114,247,0.30)]"
      >
        {/* Rotating dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full border-2 border-dashed border-white/20"
        />
        {/* Secondary ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -bottom-6 -left-6 h-20 w-20 rounded-full border border-dashed border-white/10"
        />

        <div className="relative">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-brand-200">
            Motor Propietario
          </p>
          <p className="mb-3 text-base font-bold text-white">Layers Core Engine</p>

          <div className="flex flex-wrap gap-1.5">
            {engineSteps.map((step, i) => (
              <motion.span
                key={step}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm"
              >
                {step}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── CONNECTOR ── */}
      <Connector />

      {/* ── OUTPUTS ── */}
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Salidas de Inteligencia
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {outputs.map(({ label, icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex items-center gap-2.5 rounded-xl border border-brand-100 bg-brand-50/70 px-3 py-2.5"
          >
            <span className="text-base leading-none">{icon}</span>
            <span className="text-[11px] font-medium leading-snug text-brand-800">{label}</span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
