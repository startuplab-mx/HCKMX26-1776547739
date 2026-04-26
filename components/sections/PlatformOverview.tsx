"use client";

import { motion } from "framer-motion";
import {
  Map,
  Shield,
  BarChart3,
  TrendingUp,
  Search,
  FileText,
} from "lucide-react";
import { platformFeatures } from "@/lib/mockData";
import SectionLabel from "@/components/ui/SectionLabel";

const iconMap: Record<string, React.ElementType> = {
  Map,
  Shield,
  BarChart3,
  TrendingUp,
  Search,
  FileText,
};

const colorMap: Record<
  string,
  { bg: string; icon: string; border: string; glow: string }
> = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-100",
    glow: "group-hover:shadow-blue-100/60",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-100",
    glow: "group-hover:shadow-purple-100/60",
  },
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    border: "border-indigo-100",
    glow: "group-hover:shadow-indigo-100/60",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    border: "border-cyan-100",
    glow: "group-hover:shadow-cyan-100/60",
  },
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    border: "border-teal-100",
    glow: "group-hover:shadow-teal-100/60",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    border: "border-violet-100",
    glow: "group-hover:shadow-violet-100/60",
  },
};

export default function PlatformOverview() {
  return (
    <section id="platform" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <SectionLabel>Capacidades de Layers Intel</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Todo lo que necesitas para convertir datos en inteligencia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            Seis módulos impulsados por Layers Core que trabajan juntos para
            clasificar, correlacionar y convertir señales fragmentadas en
            inteligencia de riesgo accionable para cualquier partner o institución.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className={`group relative rounded-2xl border ${colors.border} bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border`}
                >
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>

                <h3 className="mb-2 text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-brand-600 transition-colors">
                  <span>Más información</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
