"use client";

import dynamic from "next/dynamic";
import type { MapViewMode } from "./FilteredMapLeaflet";
import type { Incident } from "@/lib/mockData";

const FilteredMapLeaflet = dynamic(
  () => import("./FilteredMapLeaflet"),
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

interface DashboardMapProps {
  incidents: Incident[];
  viewMode: MapViewMode;
  className?: string;
}

// The parent MUST have an explicit pixel height and position:relative.
// We use absolute inset-0 so Leaflet always receives a concrete pixel size
// at mount time, regardless of any flex/grid context above.
export default function DashboardMap({ incidents, viewMode }: DashboardMapProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        <FilteredMapLeaflet incidents={incidents} viewMode={viewMode} />
      </div>
    </div>
  );
}
