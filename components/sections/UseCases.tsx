"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Truck,
  Globe,
  Siren,
  Shield,
} from "lucide-react";
import { useCases } from "@/lib/mockData";
import SectionLabel from "@/components/ui/SectionLabel";
import Badge from "@/components/ui/Badge";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Briefcase,
  Truck,
  Globe,
  Siren,
  Shield,
};

const cardColors = [
  "from-blue-50 to-white border-blue-100",
  "from-purple-50 to-white border-purple-100",
  "from-teal-50 to-white border-teal-100",
  "from-violet-50 to-white border-violet-100",
  "from-rose-50 to-white border-rose-100",
  "from-emerald-50 to-white border-emerald-100",
];

const iconColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-teal-100 text-teal-600",
  "bg-violet-100 text-violet-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
];

export default function UseCases() {
  return (
    <section id="use-cases" className="section-padding bg-white">
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
            <SectionLabel>Partners y Casos de Uso</SectionLabel>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Diseñado para los partners e instituciones que protegen lo que importa
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            Desde procuradurías y fiscalías hasta seguridad corporativa y
            protección digital, Layers Intel se adapta a las necesidades específicas
            de cada partner, institución o equipo.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, i) => {
            const Icon = iconMap[useCase.icon];
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group relative rounded-2xl border bg-gradient-to-br ${cardColors[i % cardColors.length]} p-6 shadow-card hover:shadow-card-hover transition-all duration-300`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${iconColors[i % iconColors.length]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-base font-semibold text-slate-900">
                  {useCase.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500">
                  {useCase.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {useCase.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/80 border border-slate-200 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
