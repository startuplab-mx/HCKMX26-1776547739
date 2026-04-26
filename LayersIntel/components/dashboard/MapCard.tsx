"use client";

import dynamic from "next/dynamic";

const RealHeatmapMap = dynamic(
  () => import("@/components/map/RealHeatmapMap"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
        <span className="text-xs text-slate-400 font-medium">Cargando mapa…</span>
      </div>
    ),
  }
);

// The parent MUST have an explicit pixel height.
// absolute inset-0 guarantees Leaflet always measures a concrete size at mount.
export default function MapCard() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <RealHeatmapMap />
      </div>
    </div>
  );
}
