"use client";

import { motion } from "framer-motion";
import { UserCheck, Lock, ShieldOff, GitBranch, Scale } from "lucide-react";
import { responsibleAIPrinciples } from "@/lib/mockData";
import SectionLabel from "@/components/ui/SectionLabel";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Lock,
  ShieldOff,
  GitBranch,
  Scale,
};

export default function ResponsibleAI() {
  return (
    <section className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <SectionLabel>Ética, Trazabilidad y Privacidad</SectionLabel>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-5"
            >
              Inteligencia que puedes{" "}
              <span className="gradient-text">trazar y auditar</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-slate-500 leading-relaxed mb-8"
            >
              Creemos que la inteligencia de riesgo debe ser trazable, auditable
              y construida con principios éticos rigurosos. Layers Core está
              diseñado para potenciar el juicio humano e institucional — no reemplazarlo.
            </motion.p>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {["Arquitectura de Seguridad", "Privacidad desde el Diseño", "Trazabilidad Total", "Auditabilidad"].map(
                (cert) => (
                  <span
                    key={cert}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {cert}
                  </span>
                )
              )}
            </motion.div>
          </div>

          {/* Right: Principles */}
          <div className="flex flex-col gap-4">
            {responsibleAIPrinciples.map((principle, i) => {
              const Icon = iconMap[principle.icon];
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                  className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 transition-colors">
                    <Icon className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
