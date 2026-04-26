"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { HeatmapPoint, HeatmapResponse } from "@/lib/types/heatmap";

// ── leaflet.heat loader ───────────────────────────────────────────────────────
// Load once per browser session; guards against double-require.
let heatPluginLoaded = false;
function ensureHeatPlugin() {
  if (heatPluginLoaded) return;
  // @ts-ignore — leaflet.heat has no bundled TS types
  require("leaflet.heat");
  heatPluginLoaded = true;
  console.log(
    "[LiveHeatmap] leaflet.heat loaded. L.heatLayer available:",
    typeof (L as any).heatLayer === "function"
  );
}

// ── Inner component: renders one heat layer inside MapContainer ───────────────

interface HeatLayerProps {
  points:   HeatmapPoint[];
  gradient: Record<number, string>;
  label:    string;
  radius?:  number;
  blur?:    number;
}

function HeatLayer({ points, gradient, label, radius = 18, blur = 15 }: HeatLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) {
      console.log(`[HeatLayer:${label}] skip — 0 points`);
      return;
    }

    ensureHeatPlugin();

    const lHeat = (L as any).heatLayer;
    if (typeof lHeat !== "function") {
      console.error(`[HeatLayer:${label}] L.heatLayer is not a function — leaflet.heat did not load`);
      return;
    }

    // Use reduce (not spread) to avoid call-stack overflow on large arrays
    const maxIntensity = points.reduce((m, p) => Math.max(m, p.intensity), 1);

    // Enforce source-specific minimums so points are always visible
    const minWeight = label === "guard" ? 0.9 : 0.75;
    const heatData: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lng,
      Math.max(minWeight, p.intensity / maxIntensity),
    ]);

    console.log(
      `[HeatLayer:${label}] adding ${heatData.length} pts, maxIntensity=${maxIntensity}, radius=${radius}`
    );

    const layer = lHeat(heatData, { radius, blur, maxZoom: 17, gradient });
    layer.addTo(map);
    console.log(`[HeatLayer:${label}] layer added to map`);

    return () => {
      map.removeLayer(layer);
      console.log(`[HeatLayer:${label}] layer removed (cleanup)`);
    };
  }, [map, points, gradient, label, radius, blur]);

  return null;
}

// ── Gradient presets ─────────────────────────────────────────────────────────

const EVENTS_GRADIENT: Record<number, string> = {
  0.10: "#fef3c7",
  0.25: "#fbbf24",
  0.45: "#f97316",
  0.70: "#ef4444",
  1.00: "#7f1d1d",
};
const GUARD_GRADIENT: Record<number, string> = {
  0.10: "#ede9fe",
  0.30: "#a78bfa",
  0.55: "#7c3aed",
  0.80: "#4c1d95",
};

// ── Loading / error states ────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto mb-2 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Cargando datos de Supabase…</span>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
      <div className="text-center px-6 max-w-xs">
        <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center">
          <span className="text-red-500 text-lg font-bold">!</span>
        </div>
        <p className="text-sm font-semibold text-red-600 mb-1">Error al cargar datos</p>
        <p className="text-xs text-slate-400 break-words">{message}</p>
      </div>
    </div>
  );
}

// ── Overlays ──────────────────────────────────────────────────────────────────

function Overlays({ total, eventCount, guardCount }: { total: number; eventCount: number; guardCount: number }) {
  return (
    <>
      {/* Counter — top right */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-600">
          Puntos cargados: {total.toLocaleString()}
        </span>
      </div>

      {/* Legend — bottom left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-card px-3 py-2.5 pointer-events-none">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Fuente de datos
        </p>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600">Datos territoriales</span>
          <span className="text-[10px] tabular-nums font-semibold text-orange-600 ml-auto pl-3">
            {eventCount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600">Alertas Layers Guard</span>
          <span className="text-[10px] tabular-nums font-semibold text-indigo-600 ml-auto pl-3">
            {guardCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Source badge — top left */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 pointer-events-none">
        <span className="text-[10px] font-semibold text-slate-600">Datos reales · Supabase</span>
      </div>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function LiveHeatmapLeaflet() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [points, setPoints] = useState<HeatmapPoint[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    console.log("[LiveHeatmap] component mounted, starting fetch /api/heatmap");

    fetch("/api/heatmap")
      .then((r) => {
        console.log("[LiveHeatmap] fetch response status:", r.status);
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${r.statusText}`);
        return r.json() as Promise<HeatmapResponse>;
      })
      .then((data) => {
        const total  = data.points?.length ?? 0;
        const events = data.points?.filter((p) => p.source === "events").length ?? 0;
        const guard  = data.points?.filter((p) => p.source === "layers_guard").length ?? 0;

        console.log(
          `[LiveHeatmap] fetch OK — total: ${total}, events: ${events}, layers_guard: ${guard}`
        );

        // Sanity-check: log first point for coordinate verification
        if (data.points?.length) {
          const first = data.points[0];
          console.log(
            `[LiveHeatmap] first point sample — source: ${first.source}, lat: ${first.lat}, lng: ${first.lng}, intensity: ${first.intensity}`
          );
        }

        setPoints(data.points ?? []);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[LiveHeatmap] fetch error:", msg);
        setErrMsg(msg);
        setStatus("error");
      });
  }, []);

  const eventPoints = points.filter((p) => p.source === "events");
  const guardPoints = points.filter((p) => p.source === "layers_guard");

  if (status === "loading") return <LoadingState />;
  if (status === "error")   return <ErrorState message={errMsg} />;

  console.log(
    `[LiveHeatmap] rendering MapContainer — eventPoints: ${eventPoints.length}, guardPoints: ${guardPoints.length}`
  );

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[19.4326, -99.1332]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Territorial events — warm orange/red, high radius for density visibility */}
        {eventPoints.length > 0 && (
          <HeatLayer
            points={eventPoints}
            gradient={EVENTS_GRADIENT}
            label="events"
            radius={38}
            blur={28}
          />
        )}

        {/* Layers Guard digital alerts — cool violet, slightly larger for prominence */}
        {guardPoints.length > 0 && (
          <HeatLayer
            points={guardPoints}
            gradient={GUARD_GRADIENT}
            label="guard"
            radius={42}
            blur={32}
          />
        )}
      </MapContainer>

      <Overlays
        total={points.length}
        eventCount={eventPoints.length}
        guardCount={guardPoints.length}
      />
    </div>
  );
}
