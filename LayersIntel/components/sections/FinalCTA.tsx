"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section id="cta" className="section-padding bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-12 sm:px-8 sm:py-16 text-center shadow-2xl"
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />

          {/* Grid dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative">
            {/* Logo mark */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur border border-white/20">
                <Layers className="h-7 w-7 text-white" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
              Transforma datos fragmentados en{" "}
              <span className="text-brand-200">inteligencia accionable</span>
            </h2>
            <p className="text-lg text-brand-200/80 max-w-lg mx-auto mb-10 leading-relaxed">
              Únete a los partners, instituciones y equipos que ya usan Layers Intel
              para anticipar, validar y responder ante riesgos con inteligencia confiable.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50 border-white"
              >
                Iniciar Piloto
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                Agendar una Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[11px] text-brand-300">
              {[
                "Sin compromiso requerido",
                "Piloto de 14 días",
                "Onboarding completo incluido",
                "Arquitectura orientada a seguridad",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
