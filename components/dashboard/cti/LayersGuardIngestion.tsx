"use client";

import { Shield, CheckCircle2 } from "lucide-react";
import { layersGuardEvents, getSeverityConfig, getPlatformConfig, type GuardEvent } from "@/lib/mock/ctiData";

function EventRow({ ev }: { ev: GuardEvent }) {
  const sev = getSeverityConfig(ev.severity);
  const plat = getPlatformConfig(ev.platform);
  const time = new Date(ev.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-3 p-3 rounded-xl border transition-colors ${ev.processed ? "border-slate-100 bg-white" : "border-orange-100 bg-orange-50/40"}`}>
      {/* Severity dot */}
      <div className="mt-0.5 shrink-0">
        <span
          className="block h-2.5 w-2.5 rounded-full mt-1"
          style={{ backgroundColor: sev.dot }}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${sev.bg} ${sev.text}`}
          >
            {sev.label}
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
            style={{ color: plat.color }}>
            {plat.label}
          </span>
          <span className="text-[10px] text-slate-400 ml-auto">{time}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{ev.snippet}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400">{ev.source}</span>
          {ev.processed && (
            <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              Procesado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LayersGuardIngestion() {
  const unprocessed = layersGuardEvents.filter((e) => !e.processed).length;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Layers Guard — Ingesta</h3>
            <p className="text-[11px] text-slate-400">Señales propietarias en tiempo real</p>
          </div>
        </div>
        {unprocessed > 0 && (
          <span className="text-[11px] font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
            {unprocessed} sin procesar
          </span>
        )}
      </div>

      {/* Scrollable event list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[440px]">
        {layersGuardEvents.map((ev) => (
          <EventRow key={ev.id} ev={ev} />
        ))}
      </div>
    </div>
  );
}
