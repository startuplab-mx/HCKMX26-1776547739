"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { GuardEvent, HeatmapPoint, HeatmapResponse } from "@/lib/types/heatmap";

// ── leaflet.heat loader ───────────────────────────────────────────────────────

let heatPluginLoaded = false;
function ensureHeatPlugin() {
  if (heatPluginLoaded) return;
  // @ts-ignore
  require("leaflet.heat");
  heatPluginLoaded = true;
}

// ── Expand icon per recent event ──────────────────────────────────────────────

function createExpandIcon(nivel: string | null): L.DivIcon {
  const lvl   = nivel?.toUpperCase();
  const color = lvl === "ROJO" ? "#dc2626" : lvl === "NARANJA" ? "#f97316" : "#7c3aed";
  const label = nivel ? `Nueva señal ${nivel}` : "Nueva señal";
  return L.divIcon({
    html: `<div style="position:relative;width:90px;height:90px;">
      <div class="guard-expand-ring" style="border:2.5px solid ${color};box-shadow:0 0 12px 0 ${color}88;"></div>
      <span class="guard-signal-label" style="color:${color};">${label}</span>
    </div>`,
    className: "",
    iconSize:   [90, 90],
    iconAnchor: [45, 45],
  });
}

// ── CDMX bounding box for point validation ────────────────────────────────────

const LAT_MIN = 18.0, LAT_MAX = 20.5;
const LNG_MIN = -100.5, LNG_MAX = -98.0;

function isValidHeatPoint([lat, lng]: [number, number, number]): boolean {
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= LAT_MIN && lat <= LAT_MAX &&
    lng >= LNG_MIN && lng <= LNG_MAX
  );
}

// ── Resize handler ────────────────────────────────────────────────────────────

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    const handler = () => map.invalidateSize();
    window.addEventListener("resize", handler);
    return () => { clearTimeout(t); window.removeEventListener("resize", handler); };
  }, [map]);
  return null;
}

// ── Inner: HeatLayer ──────────────────────────────────────────────────────────

const MAX_RETRY = 8;

interface HeatLayerProps {
  points:      HeatmapPoint[];
  extraRaw?:   [number, number, number][];
  gradient:    Record<number, string>;
  label:       string;
  radius?:     number;
  blur?:       number;
  maxOpacity?: number;
  onWaiting?:  (waiting: boolean) => void;
}

function HeatLayer({ points, extraRaw, gradient, label, radius = 18, blur = 15, maxOpacity = 0.7, onWaiting }: HeatLayerProps) {
  const map   = useMap();
  const cbRef = useRef(onWaiting);
  cbRef.current = onWaiting;

  useEffect(() => {
    const allData = buildHeatData(points, extraRaw).filter(isValidHeatPoint);
    if (!allData.length) return;

    ensureHeatPlugin();
    const lHeat = (L as any).heatLayer;
    if (typeof lHeat !== "function") return;

    let layerRef: any   = null;
    let timer:    ReturnType<typeof setTimeout> | null = null;
    let cancelled       = false;
    let attempt         = 0;

    function tryAdd() {
      if (cancelled) return;

      const size = map.getSize();
      const el   = map.getContainer();

      if (!size || size.x <= 0 || size.y <= 0 || el.clientWidth <= 0 || el.clientHeight <= 0) {
        if (attempt < MAX_RETRY) {
          attempt++;
          cbRef.current?.(true);
          try { map.invalidateSize({ animate: false }); } catch {}
          timer = setTimeout(tryAdd, 200);
        }
        return;
      }

      cbRef.current?.(false);

      try {
        layerRef = lHeat(allData, { radius, blur, maxZoom: 17, gradient, maxOpacity });
        layerRef.addTo(map);
      } catch (err) {
        console.warn(`[HeatLayer:${label}] addTo error (attempt ${attempt}):`, err);
        layerRef = null;
        if (attempt < MAX_RETRY) {
          attempt++;
          timer = setTimeout(tryAdd, 200);
        }
      }
    }

    tryAdd();

    return () => {
      cancelled = true;
      if (timer !== null) clearTimeout(timer);
      if (layerRef !== null) {
        try {
          if (map.hasLayer(layerRef)) map.removeLayer(layerRef);
        } catch {}
        layerRef = null;
      }
    };
  // onWaiting is accessed via cbRef — intentionally omitted from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, points, extraRaw, gradient, label, radius, blur, maxOpacity]);

  return null;
}

function buildHeatData(
  points:   HeatmapPoint[],
  extraRaw: [number, number, number][] = [],
): [number, number, number][] {
  const maxIntensity = points.reduce((m, p) => Math.max(m, p.intensity), 1);
  const base = points.map<[number, number, number]>((p) => [
    p.lat,
    p.lng,
    Math.max(p.source === "layers_guard" ? 0.9 : 0.75, p.intensity / maxIntensity),
  ]);
  return [...base, ...extraRaw];
}

// ── Jitter amplification for recent events ────────────────────────────────────

function buildJitterPoints(events: GuardEvent[]): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (const ev of events) {
    const w = Math.min(1.0, Math.max(0.78, ev.intensity / 5));
    for (let i = 0; i < 12; i++) {
      out.push([
        ev.lat + (Math.random() - 0.5) * 0.004,
        ev.lng + (Math.random() - 0.5) * 0.004,
        w,
      ]);
    }
  }
  return out;
}

// ── Gradient presets ──────────────────────────────────────────────────────────

const EVENTS_GRADIENT: Record<number, string> = {
  0.10: "#fef3c7",
  0.25: "#fbbf24",
  0.45: "#f97316",
  0.70: "#ef4444",
  1.00: "#7f1d1d",
};

const GUARD_GRADIENT: Record<number, string> = {
  0.10: "#fde68a",
  0.25: "#f59e0b",
  0.45: "#f97316",
  0.65: "#ef4444",
  0.85: "#dc2626",
  1.00: "#450a0a",
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

function Overlays({
  total, eventCount, guardCount, recentCount, lastEvent,
}: {
  total:       number;
  eventCount:  number;
  guardCount:  number;
  recentCount: number;
  lastEvent:   GuardEvent | null;
}) {
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

      {/* Recent impact metrics — bottom right */}
      {recentCount > 0 && lastEvent && (
        <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md rounded-xl border border-red-900/60 shadow-lg px-3 py-2 pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Impacto activo</span>
          </div>
          <p className="text-[10px] font-bold text-white">
            +{lastEvent.intensity.toFixed(1)} criticidad
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            {recentCount} señal{recentCount > 1 ? "es" : ""} reciente{recentCount > 1 ? "s" : ""} · &lt;30s
          </p>
        </div>
      )}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface LiveHeatmapLeafletProps {
  points?:            HeatmapPoint[];
  recentGuardEvents?: GuardEvent[];
}

export default function LiveHeatmapLeaflet({ points: externalPoints, recentGuardEvents = [] }: LiveHeatmapLeafletProps) {
  const [status,         setStatus]         = useState<"loading" | "ready" | "error">("loading");
  const [internalPoints, setInternalPoints] = useState<HeatmapPoint[]>([]);
  const [errMsg,         setErrMsg]         = useState<string>("");
  const [heatWaiting,    setHeatWaiting]    = useState(false);

  useEffect(() => {
    if (externalPoints !== undefined) { setStatus("ready"); return; }

    fetch("/api/heatmap")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${r.statusText}`);
        return r.json() as Promise<HeatmapResponse>;
      })
      .then((data) => { setInternalPoints(data.points ?? []); setStatus("ready"); })
      .catch((err: unknown) => {
        setErrMsg(err instanceof Error ? err.message : String(err));
        setStatus("error");
      });
  }, [externalPoints]);

  useEffect(() => {
    if (externalPoints !== undefined) setStatus("ready");
  }, [externalPoints]);

  const points      = externalPoints ?? internalPoints;
  const eventPoints = points.filter((p) => p.source === "events");
  const guardPoints = points.filter((p) => p.source === "layers_guard");

  // Jitter amplification — recomputed only when recentGuardEvents changes
  const guardJitter = useMemo(() => buildJitterPoints(recentGuardEvents), [recentGuardEvents]);

  if (status === "loading") return <LoadingState />;
  if (status === "error")   return <ErrorState message={errMsg} />;

  const lastEvent = recentGuardEvents[0] ?? null;

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
        <ResizeHandler />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Territorial events — warm orange/red */}
        {eventPoints.length > 0 && (
          <HeatLayer
            points={eventPoints}
            gradient={EVENTS_GRADIENT}
            label="events"
            radius={38}
            blur={28}
            onWaiting={setHeatWaiting}
          />
        )}

        {/* Guard events — dramatic red gradient + jitter amplification */}
        {(guardPoints.length > 0 || guardJitter.length > 0) && (
          <HeatLayer
            points={guardPoints}
            extraRaw={guardJitter}
            gradient={GUARD_GRADIENT}
            label="guard"
            radius={45}
            blur={30}
            maxOpacity={0.95}
            onWaiting={setHeatWaiting}
          />
        )}

        {/* Expand rings for newly-arrived guard events */}
        {recentGuardEvents.map((ev) => (
          <Marker
            key={`expand-${ev.id}`}
            position={[ev.lat, ev.lng]}
            icon={createExpandIcon(ev.nivel)}
          />
        ))}
      </MapContainer>

      <Overlays
        total={points.length}
        eventCount={eventPoints.length}
        guardCount={guardPoints.length}
        recentCount={recentGuardEvents.length}
        lastEvent={lastEvent}
      />

      {heatWaiting && (
        <div className="absolute inset-x-0 bottom-16 z-[1001] flex justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-amber-200 shadow-sm px-3 py-1.5">
            <span className="text-[10px] text-amber-700 font-medium">
              Heatmap esperando tamaño del contenedor…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
