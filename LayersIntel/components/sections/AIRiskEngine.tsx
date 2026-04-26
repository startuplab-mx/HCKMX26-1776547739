"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import LayersCoreFlow from "@/components/sections/LayersCoreFlow";

export default function AIRiskEngine() {
  return (
    <section className="section-padding bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <SectionLabel>Layers Core</SectionLabel>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-5"
            >
              Layers Core: el motor de{" "}
              <span className="gradient-text">validación e inteligencia</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg text-slate-500 leading-relaxed mb-8"
            >
              Layers Core integra y valida información desde múltiples capas de
              datos. Desde señales propietarias de alta fidelidad como{" "}
              <span className="font-semibold text-brand-700">Layers Guard</span>,
              hasta datos gubernamentales, OSINT y reportes validados, el sistema
              correlaciona eventos en tiempo real para generar inteligencia de
              riesgo confiable.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button variant="primary" size="md">
                Explorar Layers Core
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Right: Flow diagram */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <LayersCoreFlow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
