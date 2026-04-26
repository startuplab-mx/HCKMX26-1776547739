"use client";

import dynamic from "next/dynamic";
import type { GuardEvent, HeatmapPoint } from "@/lib/types/heatmap";

const LiveHeatmapLeaflet = dynamic(
  () => import("./LiveHeatmapLeaflet"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-2 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Cargando mapa…</span>
        </div>
      </div>
    ),
  }
);

interface Props {
  points?:            HeatmapPoint[];
  recentGuardEvents?: GuardEvent[];
}

export default function LiveHeatmapMap({ points, recentGuardEvents }: Props) {
  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] overflow-hidden rounded-2xl">
      <div className="absolute inset-0">
        <LiveHeatmapLeaflet points={points} recentGuardEvents={recentGuardEvents} />
      </div>
    </div>
  );
}
