"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, User, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { getCaseDetail, getSeverityConfig, getStatusConfig, getPlatformConfig } from "@/lib/mock/ctiData";

interface Props {
  caseId: string | null;
  onClose: () => void;
}

export default function CaseDetailDrawer({ caseId, onClose }: Props) {
  const detail = caseId ? getCaseDetail(caseId) : null;

  return (
    <AnimatePresence>
      {detail && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            {(() => {
              const sev = getSeverityConfig(detail.severity);
              const sta = getStatusConfig(detail.status);
              const plat = getPlatformConfig(detail.platform);
              return (
                <>
                  <div className="flex items-start gap-3 px-6 py-5 border-b border-slate-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-[11px] text-slate-400">{detail.id}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                          {sev.label}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sta.bg} ${sta.text}`}>
                          {sta.label}
                        </span>
                        <span className="text-[10px] font-medium" style={{ color: plat.color }}>{plat.label}</span>
                      </div>
                      <h2 className="text-sm font-semibold text-slate-900 leading-snug">{detail.title}</h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Scrollable body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Description */}
                    <section>
                      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Descripción</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
                    </section>

                    {/* Metadata grid */}
                    <section>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: User,          label: "Asignado",   value: detail.assignee },
                          { icon: Clock,         label: "Creado",     value: new Date(detail.created).toLocaleString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) },
                          { icon: AlertTriangle, label: "IOCs",       value: `${detail.iocCount} indicadores` },
                          { icon: CheckCircle,   label: "Actualizado",value: new Date(detail.updated).toLocaleString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50">
                            <Icon className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{label}</div>
                              <div className="text-xs text-slate-700 font-medium mt-0.5">{value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* MITRE ATT&CK */}
                    {detail.mitreTactics.length > 0 && (
                      <section>
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">MITRE ATT&CK</h3>
                        <div className="flex flex-wrap gap-2">
                          {detail.mitreTactics.map((t) => (
                            <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                              {t}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Artifacts */}
                    {detail.artifacts.length > 0 && (
                      <section>
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Artefactos vinculados</h3>
                        <div className="space-y-2">
                          {detail.artifacts.map((a) => {
                            const asev = getSeverityConfig(a.severity);
                            return (
                              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 bg-white">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase`}>
                                  {a.type}
                                </span>
                                <span className="font-mono text-[11px] text-slate-700 flex-1 truncate">{a.value}</span>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${asev.bg} ${asev.text}`}>
                                  {asev.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    )}

                    {/* Timeline */}
                    <section>
                      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Línea de tiempo</h3>
                      <ol className="relative ml-3 border-l border-slate-200 space-y-4">
                        {detail.timeline.map((ev, i) => (
                          <li key={i} className="pl-5 relative">
                            <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-brand-400 bg-white" />
                            <div className="text-[10px] text-slate-400 mb-0.5">
                              {new Date(ev.ts).toLocaleString("es-MX", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              <span className="ml-2 font-semibold text-slate-600">{ev.actor}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{ev.action}</p>
                          </li>
                        ))}
                      </ol>
                    </section>

                    {/* Recommendation */}
                    <section className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-brand-600" />
                        <h3 className="text-xs font-semibold text-brand-800">Recomendación</h3>
                      </div>
                      <p className="text-xs text-brand-700 leading-relaxed">{detail.recommendation}</p>
                    </section>
                  </div>

                  {/* Footer actions */}
                  <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                    <button className="flex-1 rounded-xl bg-brand-600 text-white text-sm font-semibold py-2.5 hover:bg-brand-700 transition-colors">
                      Escalar a Socio
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
