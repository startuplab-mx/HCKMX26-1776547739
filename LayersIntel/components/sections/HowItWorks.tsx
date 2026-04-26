"use client";

import { motion } from "framer-motion";
import {
  Database,
  Layers,
  Cpu,
  BrainCircuit,
  Bell,
} from "lucide-react";
import { howItWorksSteps } from "@/lib/mockData";
import SectionLabel from "@/components/ui/SectionLabel";

const iconMap: Record<string, React.ElementType> = {
  Database,
  Layers,
  Cpu,
  BrainCircuit,
  Bell,
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding bg-white"
    >
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
            <SectionLabel>Cómo Funciona Layers Core</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            De señales fragmentadas a inteligencia confiable
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            El pipeline propietario de Layers Core ingesta, valida, correlaciona
            y distribuye inteligencia de riesgo a cada partner o institución.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-8 bottom-8 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-200 to-transparent lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {howItWorksSteps.map((step, i) => {
              const Icon = iconMap[step.icon];
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -32 : 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-center gap-8 lg:gap-16 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`flex-1 ${isEven ? "lg:text-right" : "lg:text-left"}`}
                  >
                    <div
                      className={`w-full lg:inline-block lg:max-w-md rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all group ${
                        isEven ? "lg:ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`flex items-start gap-4 ${
                          isEven ? "lg:flex-row-reverse" : ""
                        }`}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 group-hover:bg-brand-600 transition-colors">
                          <Icon className="h-5 w-5 text-brand-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className={isEven ? "lg:text-right" : ""}>
                          <span className="text-xs font-bold text-brand-500 tracking-widest uppercase">
                            Paso {step.step}
                          </span>
                          <h3 className="mt-1 text-base font-semibold text-slate-900">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold shadow-lg z-10">
                    {i + 1}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
