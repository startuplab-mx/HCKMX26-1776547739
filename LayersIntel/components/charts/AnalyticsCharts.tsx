"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { Incident } from "@/lib/mockData";
import { TYPE_LABELS, SOURCE_LABELS } from "@/lib/mockData";

// ── Shared tooltip ────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-card text-xs">
      {label && <p className="font-medium text-slate-700 mb-1">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Derived datasets ──────────────────────────────────────────────────────────

function byType(incidents: Incident[]) {
  const counts: Record<string, number> = {};
  incidents.forEach((i) => {
    counts[i.type] = (counts[i.type] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([type, count]) => ({ name: TYPE_LABELS[type as keyof typeof TYPE_LABELS], count }))
    .sort((a, b) => b.count - a.count);
}

function bySource(incidents: Incident[]) {
  const counts: Record<string, number> = {};
  incidents.forEach((i) => {
    counts[i.source] = (counts[i.source] ?? 0) + 1;
  });
  return Object.entries(counts).map(([src, value]) => ({
    name: SOURCE_LABELS[src as keyof typeof SOURCE_LABELS],
    value,
  }));
}

function byRiskBand(incidents: Incident[]) {
  const bands = [
    { range: "0–24",  min: 0,  max: 25 },
    { range: "25–49", min: 25, max: 50 },
    { range: "50–74", min: 50, max: 75 },
    { range: "75–100",min: 75, max: 101},
  ];
  return bands.map(({ range, min, max }) => ({
    range,
    count: incidents.filter((i) => i.risk >= min && i.risk < max).length,
  }));
}

function byDay(incidents: Incident[]) {
  const counts: Record<string, number> = {};
  incidents.forEach((i) => {
    const day = i.timestamp.slice(0, 10); // "YYYY-MM-DD"
    counts[day] = (counts[day] ?? 0) + 1;
  });
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14) // last 14 days in dataset
    .map(([date, count]) => ({
      day: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    }));
}

function topZones(incidents: Incident[]) {
  const avg: Record<string, { total: number; count: number }> = {};
  incidents.forEach((i) => {
    if (!avg[i.zone]) avg[i.zone] = { total: 0, count: 0 };
    avg[i.zone].total += i.risk;
    avg[i.zone].count += 1;
  });
  return Object.entries(avg)
    .map(([zone, { total, count }]) => ({ zone, avgRisk: Math.round(total / count) }))
    .sort((a, b) => b.avgRisk - a.avgRisk)
    .slice(0, 8);
}

// ── Colour palettes ───────────────────────────────────────────────────────────

const SRC_COLORS = ["#6172f7", "#f97316", "#22c55e", "#a855f7"];
const RISK_COLORS = ["#22c55e", "#f59e0b", "#f97316", "#ef4444"];

// ── Chart cards ──────────────────────────────────────────────────────────────

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface Props {
  incidents: Incident[];
}

export default function AnalyticsCharts({ incidents }: Props) {
  const typeData   = byType(incidents);
  const sourceData = bySource(incidents);
  const riskData   = byRiskBand(incidents);
  const dayData    = byDay(incidents);
  const zoneData   = topZones(incidents);

  if (incidents.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-400">Ningún incidente coincide con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
      {/* Incidents over time */}
      <ChartCard title="Incidentes en el Tiempo">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={dayData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6172f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6172f7" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#6172f7" strokeWidth={2} dot={false} name="Incidentes" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By type */}
      <ChartCard title="Incidentes por Tipo">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={typeData} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6172f7" radius={[0, 4, 4, 0]} name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By source */}
      <ChartCard title="Incidentes por Fuente">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {sourceData.map((_, i) => (
                <Cell key={i} fill={SRC_COLORS[i % SRC_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Risk distribution */}
      <ChartCard title="Distribución de Puntaje de Riesgo">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={riskData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="range" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Total">
              {riskData.map((_, i) => (
                <Cell key={i} fill={RISK_COLORS[i % RISK_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top zones by avg risk — full width */}
      <div className="md:col-span-2">
        <ChartCard title="Zonas con Mayor Puntaje de Riesgo">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={zoneData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="zone" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgRisk" fill="#6172f7" radius={[4, 4, 0, 0]} name="Riesgo Prom." />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
