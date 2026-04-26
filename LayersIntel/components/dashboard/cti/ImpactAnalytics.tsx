"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { alertsByHour, platformDistribution, weeklyTrend } from "@/lib/mock/ctiData";

// ── Custom tooltip ─────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name ?? p.dataKey}:</span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Hourly alerts bar chart ───────────────────────────────────────────────────

function HourlyAlertsChart() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
      <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Alertas por Hora</h4>
      <p className="text-[11px] text-slate-400 mb-4">Hoy (UTC-6)</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={alertsByHour} barSize={10} barGap={2}>
          <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f1f5f9" }} />
          <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} name="Crítico" />
          <Bar dataKey="high"     stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} name="Alto" />
          <Bar dataKey="medium"   stackId="a" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Medio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Weekly IOC trend area chart ───────────────────────────────────────────────

function WeeklyTrendChart() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
      <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Tendencia Semanal</h4>
      <p className="text-[11px] text-slate-400 mb-4">IOCs detectados vs alertas generadas</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={weeklyTrend}>
          <defs>
            <linearGradient id="iocGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="iocs"   stroke="#6366f1" strokeWidth={2} fill="url(#iocGrad)"   name="IOCs" dot={false} />
          <Area type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} fill="url(#alertGrad)" name="Alertas" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Platform distribution donut ───────────────────────────────────────────────

function PlatformDonut() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-5">
      <h4 className="text-sm font-semibold text-slate-800 mb-0.5">Fuente por Plataforma</h4>
      <p className="text-[11px] text-slate-400 mb-2">% de señales detectadas</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={platformDistribution}
            dataKey="value"
            nameKey="platform"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            strokeWidth={0}
          >
            {platformDistribution.map((d) => (
              <Cell key={d.platform} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => [`${val}%`, ""]} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(val) => <span style={{ fontSize: 10, color: "#64748b" }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ImpactAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <HourlyAlertsChart />
      <WeeklyTrendChart />
      <PlatformDonut />
    </div>
  );
}
