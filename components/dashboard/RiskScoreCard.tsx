"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { overallRiskScore } from "@/lib/mockData";

function RiskGauge({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference * 0.75;
  const rotation = -135;

  const color =
    score >= 75 ? "#ef4444" : score >= 50 ? "#f97316" : "#22c55e";

  return (
    <svg viewBox="0 0 100 80" className="w-36 h-28">
      {/* Background arc */}
      <circle
        cx="50"
        cy="58"
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="6"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={0}
        strokeLinecap="round"
        transform={`rotate(${rotation}, 50, 58)`}
      />
      {/* Score arc */}
      <motion.circle
        cx="50"
        cy="58"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(${rotation}, 50, 58)`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      />
      {/* Center text */}
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="font-bold"
        style={{ fontSize: "18px", fontWeight: "700", fill: color }}
      >
        {score}
      </text>
      <text
        x="50"
        y="65"
        textAnchor="middle"
        style={{ fontSize: "7px", fill: "#94a3b8" }}
      >
        PUNTAJE DE RIESGO
      </text>
    </svg>
  );
}

export default function RiskScoreCard() {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <RiskGauge score={overallRiskScore} />

      <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1">
        <TrendingUp className="h-3 w-3 text-amber-600" />
        <span className="text-xs font-medium text-amber-700">
          +12 pts vs semana pasada
        </span>
      </div>

      <div className="grid grid-cols-3 w-full gap-2 mt-1">
        {[
          { label: "Zonas", value: "14", color: "text-slate-800" },
          { label: "Activas", value: "3", color: "text-red-500" },
          { label: "Estables", value: "11", color: "text-emerald-600" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`text-base font-semibold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
