"use client";

import { severityDistribution, getSeverityConfig } from "@/lib/mock/ctiData";

export default function SeverityDistribution() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">Distribución por Severidad</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Alertas activas — últimas 24 h</p>
      </div>

      <div className="space-y-3">
        {severityDistribution.map((bucket) => {
          const cfg = getSeverityConfig(bucket.severity);
          return (
            <div key={bucket.severity} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${cfg.text}`}>{cfg.label}</span>
                <span className="tabular-nums text-slate-500 font-semibold">
                  {bucket.count} <span className="font-normal text-slate-400">({bucket.pct}%)</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${bucket.pct}%`, backgroundColor: cfg.dot }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total pill */}
      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total alertas</span>
        <span className="font-bold text-slate-800 tabular-nums">
          {severityDistribution.reduce((s, b) => s + b.count, 0)}
        </span>
      </div>
    </div>
  );
}
