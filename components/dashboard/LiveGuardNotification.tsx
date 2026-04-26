"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, ChevronRight, MapPin, Clock, Activity } from "lucide-react";
import type { GuardEvent } from "@/lib/types/heatmap";
import type { GuardNotification } from "@/lib/hooks/useHeatmapPolling";

// ── Helpers ───────────────────────────────────────────────────────────────────

function nivelColor(nivel: string | null) {
  switch (nivel?.toUpperCase()) {
    case "ROJO":     return { bg: "bg-red-900/60",    border: "border-red-500/40",    text: "text-red-300",    badge: "bg-red-600 text-white" };
    case "NARANJA":  return { bg: "bg-orange-900/60", border: "border-orange-500/40", text: "text-orange-300", badge: "bg-orange-600 text-white" };
    case "AMARILLO": return { bg: "bg-yellow-900/50", border: "border-yellow-500/40", text: "text-yellow-300", badge: "bg-yellow-600 text-black" };
    default:         return { bg: "bg-violet-900/40", border: "border-violet-500/30", text: "text-violet-300", badge: "bg-violet-600 text-white" };
  }
}

interface DetalleWord {
  texto:     string;
  categoria: string;
  puntos:    number;
}

function parseDetalle(raw: string | null): DetalleWord[] {
  if (!raw) return [];
  try {
    const obj = JSON.parse(raw);
    if (Array.isArray(obj?.palabras)) return obj.palabras;
    if (Array.isArray(obj)) return obj;
  } catch {}
  return [];
}

// ── Detail modal ──────────────────────────────────────────────────────────────

function DetailModal({ event, onClose }: { event: GuardEvent; onClose: () => void }) {
  const colors  = nivelColor(event.nivel);
  const palabras = parseDetalle(event.detalle);

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, x: 40, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        className="relative w-full sm:max-w-md max-h-screen sm:max-h-[88vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 ${colors.bg} border-b ${colors.border} px-5 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <Shield className={`h-4 w-4 ${colors.text}`} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Detalle de Alerta</p>
              <p className={`text-sm font-bold ${colors.text}`}>
                {event.nivel ?? "Señal"} · Layers Guard
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">

          {/* Score + criticidad */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-center">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Nivel</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                {event.nivel ?? "—"}
              </span>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-center">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Score</p>
              <p className="text-base font-bold text-white">{event.score ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-center">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Intensidad</p>
              <p className="text-base font-bold text-violet-400">{event.intensity.toFixed(1)}</p>
            </div>
          </div>

          {/* Texto detectado */}
          {event.texto && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Texto detectado
              </p>
              <p className="text-sm text-slate-300 bg-slate-800 rounded-xl px-4 py-3 border border-slate-700 leading-relaxed">
                {event.texto}
              </p>
            </div>
          )}

          {/* IOCs / palabras */}
          {palabras.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                IOCs detectados
              </p>
              <div className="flex flex-wrap gap-2">
                {palabras.map((w, i) => (
                  <div key={i} className="rounded-xl border border-red-900/40 bg-red-950/30 px-3 py-1.5">
                    <p className="text-xs font-bold text-red-300">{w.texto}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wide">{w.categoria}</span>
                      <span className="text-[9px] font-semibold text-amber-400">+{w.puntos}pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata grid */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">Información</p>
            <div className="rounded-xl bg-slate-800 border border-slate-700 divide-y divide-slate-700">
              {[
                { label: "Fuente",     value: event.fuente         },
                { label: "Company",    value: event.company        },
                { label: "AS Type",    value: event.as_type        },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[11px] text-slate-500">{label}</span>
                  <span className="text-[11px] font-semibold text-slate-200 text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> Coords</span>
                <span className="text-[11px] font-mono text-slate-300">{event.lat.toFixed(5)}, {event.lng.toFixed(5)}</span>
              </div>
              {event.timestamp_event && (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Evento</span>
                  <span className="text-[11px] text-slate-300">
                    {new Date(event.timestamp_event).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "medium" })}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Ingresado</span>
                <span className="text-[11px] text-slate-300">
                  {new Date(event.created_at).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "medium" })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// ── Single notification card ──────────────────────────────────────────────────

const AUTO_DISMISS_MS = 9_000;

function NotificationCard({
  notification,
  onDismiss,
  onViewDetails,
}: {
  notification:  GuardNotification;
  onDismiss:     () => void;
  onViewDetails: () => void;
}) {
  const { event } = notification;
  const colors    = nivelColor(event.nivel);

  // Auto-dismiss after AUTO_DISMISS_MS
  useEffect(() => {
    const t = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: 48, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className={`w-80 rounded-2xl bg-slate-900 border shadow-2xl overflow-hidden ${colors.border}`}
    >
      {/* Header strip */}
      <div className={`${colors.bg} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-300">
            Nueva señal Layers Guard
          </span>
        </div>
        <button onClick={onDismiss} className="text-slate-500 hover:text-white transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2.5">
        {/* Nivel + score */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors.badge}`}>
            {event.nivel ?? "DESCONOCIDO"}
          </span>
          {event.score != null && (
            <span className="text-[10px] text-slate-400">
              Score: <span className="font-semibold text-white">{event.score}</span>
            </span>
          )}
          <span className={`text-[10px] font-semibold ml-auto ${colors.text}`}>
            ×{event.intensity.toFixed(1)}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
          Alerta{event.nivel ? ` ${event.nivel}` : ""} detectada
          {event.fuente ? ` desde ${event.fuente}` : ""}
          {event.company ? ` · ${event.company}` : ""}
        </p>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
          {event.fuente && (
            <><span className="text-slate-500">Fuente</span><span className="text-slate-300 truncate">{event.fuente}</span></>
          )}
          <span className="text-slate-500 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />Coords</span>
          <span className="text-slate-400 font-mono">{event.lat.toFixed(3)}, {event.lng.toFixed(3)}</span>
          {event.timestamp_event && (
            <><span className="text-slate-500 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />Hora</span>
            <span className="text-slate-300">{new Date(event.timestamp_event).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}</span></>
          )}
        </div>

        {/* Action */}
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-xs font-semibold py-2 transition-colors"
        >
          <Activity className="h-3.5 w-3.5" />
          Ver detalles
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LiveGuardNotification({
  notifications,
  onDismiss,
}: {
  notifications: GuardNotification[];
  onDismiss:     (id: string) => void;
}) {
  const [activeDetail, setActiveDetail] = useState<GuardEvent | null>(null);

  const visible = notifications.filter((n) => !n.dismissed);

  return (
    <>
      {/* Toast stack — bottom right */}
      <div className="fixed bottom-5 right-5 z-[9000] flex flex-col-reverse gap-2 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {visible.map((n) => (
            <div key={n.event.id} className="pointer-events-auto">
              <NotificationCard
                notification={n}
                onDismiss={() => onDismiss(n.event.id)}
                onViewDetails={() => setActiveDetail(n.event)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {activeDetail && (
          <DetailModal event={activeDetail} onClose={() => setActiveDetail(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
