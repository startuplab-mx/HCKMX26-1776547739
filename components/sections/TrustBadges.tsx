"use client";

import { motion } from "framer-motion";
import { Building2, Briefcase, Globe, Shield } from "lucide-react";

const partners = [
  {
    icon: Building2,
    label: "Instituciones y Gobierno",
    sub: "Procuradurías, fiscalías y agencias",
  },
  {
    icon: Briefcase,
    label: "Empresas y Partners",
    sub: "Inteligencia corporativa y operativa",
  },
  {
    icon: Globe,
    label: "Plataformas Digitales",
    sub: "Protección y confianza digital",
  },
  {
    icon: Shield,
    label: "Equipos de Inteligencia",
    sub: "Análisis, OSINT y respuesta",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-widest mb-10 px-4"
        >
          Diseñado para instituciones, partners, equipos de inteligencia y soluciones de protección digital
        </motion.p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-6 hover:bg-white hover:shadow-card transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:border-brand-100 group-hover:bg-brand-50 transition-all">
                <partner.icon className="h-5 w-5 text-slate-500 group-hover:text-brand-600 transition-colors" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-800">
                  {partner.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{partner.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
