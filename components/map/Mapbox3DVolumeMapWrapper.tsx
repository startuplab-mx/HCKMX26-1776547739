"use client";

import dynamic from "next/dynamic";
import type { GuardEvent, HeatmapPoint } from "@/lib/types/heatmap";

const Mapbox3DVolumeMap = dynamic(
  () => import("./Mapbox3DVolumeMap"),
  {
    ssr:     false,
    loading: () => (
      <div className="h-full min-h-[420px] sm:min-h-[500px] bg-slate-900 flex items-center justify-center rounded-2xl">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-2 rounded-full border-2 border-slate-700 border-t-violet-500 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Cargando mapa 3D…</span>
        </div>
      </div>
    ),
  }
);

interface Props {
  points?:            HeatmapPoint[];
  recentGuardEvents?: GuardEvent[];
}

export default function Mapbox3DVolumeMapWrapper({ points, recentGuardEvents }: Props) {
  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] overflow-hidden rounded-2xl">
      <Mapbox3DVolumeMap points={points} recentGuardEvents={recentGuardEvents} />
    </div>
  );
}
