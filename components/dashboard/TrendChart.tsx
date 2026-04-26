"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { riskTrendData } from "@/lib/mockData";

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
    <div className="glass rounded-xl border border-slate-100 px-3 py-2 shadow-card text-xs">
      <p className="font-medium text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-medium text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart
        data={riskTrendData}
        margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
      >
        <defs>
          <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6172f7" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6172f7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradIncidents" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="risk"
          stroke="#6172f7"
          strokeWidth={2}
          fill="url(#gradRisk)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="incidents"
          stroke="#f97316"
          strokeWidth={1.5}
          fill="url(#gradIncidents)"
          dot={false}
          strokeDasharray="4 2"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
