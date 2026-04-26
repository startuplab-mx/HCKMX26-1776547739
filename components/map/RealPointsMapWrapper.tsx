"use client";

import dynamic from "next/dynamic";
import type { HeatmapPoint } from "@/lib/types/heatmap";

const RealPointsMap = dynamic(
  () => import("./RealPointsMap"),
  {
    ssr:     false,
    loading: () => (
      <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-2 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Cargando mapa…</span>
        </div>
      </div>
    ),
  }
);

interface Props {
  points?:         HeatmapPoint[];
  recentPointIds?: string[];
}

export default function RealPointsMapWrapper({ points, recentPointIds }: Props) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <RealPointsMap points={points} recentPointIds={recentPointIds} />
      </div>
    </div>
  );
}
