"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { ctiMetrics, type CTIMetric } from "@/lib/mock/ctiData";

function MetricCard({ metric }: { metric: CTIMetric }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {metric.label}
      </span>
      <div className="flex items-end justify-between gap-2 mt-1">
        <span className="text-2xl font-bold text-slate-900 tabular-nums">
          {typeof metric.value === "number" ? metric.value.toLocaleString("es-MX") : metric.value}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 ${
            metric.deltaUp
              ? "bg-red-50 text-red-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {metric.deltaUp ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {metric.delta}
        </span>
      </div>
      <span className="text-[11px] text-slate-400">{metric.sub}</span>
    </div>
  );
}

export default function CTIMetricCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {ctiMetrics.map((m) => (
        <MetricCard key={m.id} metric={m} />
      ))}
    </div>
  );
}
