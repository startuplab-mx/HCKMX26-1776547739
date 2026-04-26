"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, useMap } from "react-leaflet";
import type { GuardEvent, HeatmapPoint, HeatmapResponse } from "@/lib/types/heatmap";

const MAX_DISPLAY = 1000;

const SOURCE_COLOR: Record<string, { fill: string; stroke: string }> = {
  events:       { fill: "#f97316", stroke: "#ea580c" },
  layers_guard: { fill: "#7c3aed", stroke: "#5b21b6" },
};

// ── Static pulse icon (small ring on each recent guard point) ─────────────────

const PULSE_ICON = L.divIcon({
  html:      '<div class="guard-pulse-ring"></div>',
  className: "",
  iconSize:  [18, 18],
  iconAnchor:[9, 9],
});

// ── Expand icon (large growing ring + label on critical new events) ───────────

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

// ── Loading / error ───────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto mb-2 rounded-full border-2 border-slate-300 border-t-brand-500 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Cargando puntos reales…</span>
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
  displayed, total, evCount, guardCount, recentCount, lastEvent,
}: {
  displayed:   number;
  total:       number;
  evCount:     number;
  guardCount:  number;
  recentCount: number;
  lastEvent:   GuardEvent | null;
}) {
  return (
    <>
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-600">
          {displayed.toLocaleString()} eventos reales{total > displayed ? ` (de ${total.toLocaleString()})` : ""}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-card px-3 py-2.5 pointer-events-none">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Fuente</p>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600">Territoriales</span>
          <span className="text-[10px] tabular-nums font-semibold text-orange-600 ml-auto pl-3">{evCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-600 shrink-0" />
          <span className="text-[11px] font-medium text-slate-600">Layers Guard</span>
          <span className="text-[10px] tabular-nums font-semibold text-violet-600 ml-auto pl-3">{guardCount.toLocaleString()}</span>
        </div>
      </div>
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 pointer-events-none">
        <span className="text-[10px] font-semibold text-slate-600">Datos reales · Supabase</span>
      </div>

      {/* Impact metrics — bottom right */}
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

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  points?:            HeatmapPoint[];
  recentPointIds?:    string[];
  recentGuardEvents?: GuardEvent[];
}

export default function RealPointsMap({
  points: externalPoints,
  recentPointIds    = [],
  recentGuardEvents = [],
}: Props) {
  const [internalPoints, setInternalPoints] = useState<HeatmapPoint[] | null>(null);
  const [total,          setTotal]          = useState(0);
  const [errMsg,         setErrMsg]         = useState("");

  useEffect(() => {
    if (externalPoints !== undefined) return;

    fetch("/api/heatmap")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${r.statusText}`);
        return r.json() as Promise<HeatmapResponse>;
      })
      .then((data) => {
        const all = data.points ?? [];
        setTotal(all.length);
        setInternalPoints(all);
      })
      .catch((err: unknown) => {
        setErrMsg(err instanceof Error ? err.message : String(err));
        setInternalPoints([]);
      });
  }, [externalPoints]);

  const allPoints  = externalPoints ?? internalPoints;
  const isLoading  = allPoints === null && !errMsg;
  const shown      = useMemo(() => (allPoints ?? []).slice(0, MAX_DISPLAY), [allPoints]);
  const totalCount = externalPoints !== undefined ? (externalPoints?.length ?? 0) : total;
  const recentSet  = useMemo(() => new Set(recentPointIds), [recentPointIds]);

  if (isLoading) return <LoadingState />;
  if (errMsg)    return <ErrorState message={errMsg} />;

  const evCount    = shown.filter((p) => p.source === "events").length;
  const guardCount = shown.filter((p) => p.source === "layers_guard").length;
  const lastEvent  = recentGuardEvents[0] ?? null;

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

        {/* Standard markers */}
        {shown.map((p) => {
          const col = SOURCE_COLOR[p.source] ?? SOURCE_COLOR.events;
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={p.source === "layers_guard" ? 6 : 5}
              pathOptions={{ fillColor: col.fill, fillOpacity: 0.8, color: col.stroke, weight: 1 }}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  {p.title && <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: "#1e293b" }}>{p.title}</p>}
                  <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                    {p.category && <tr><td style={{ color: "#94a3b8", paddingRight: 8 }}>Categoría</td><td style={{ color: "#334155", fontWeight: 600 }}>{p.category}</td></tr>}
                    {p.severity && <tr><td style={{ color: "#94a3b8", paddingRight: 8 }}>Severidad</td><td style={{ color: "#334155", fontWeight: 600 }}>{p.severity}</td></tr>}
                    <tr><td style={{ color: "#94a3b8", paddingRight: 8 }}>Fuente</td>
                      <td style={{ color: p.source === "layers_guard" ? "#7c3aed" : "#ea580c", fontWeight: 600 }}>
                        {p.source === "layers_guard" ? "Layers Guard" : "Territorial"}
                      </td>
                    </tr>
                    {p.description && <tr><td colSpan={2} style={{ color: "#94a3b8", paddingTop: 6, fontSize: 10 }}>{p.description}</td></tr>}
                  </table>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Small pulse rings on recently-arrived guard points already in view */}
        {shown
          .filter((p) => recentSet.has(p.id) && p.source === "layers_guard")
          .map((p) => (
            <Marker key={`pulse-${p.id}`} position={[p.lat, p.lng]} icon={PULSE_ICON} />
          ))}

        {/* Large expand rings for newly-arrived critical events */}
        {recentGuardEvents.map((ev) => (
          <Marker
            key={`expand-${ev.id}`}
            position={[ev.lat, ev.lng]}
            icon={createExpandIcon(ev.nivel)}
          />
        ))}
      </MapContainer>

      <Overlays
        displayed={shown.length}
        total={totalCount}
        evCount={evCount}
        guardCount={guardCount}
        recentCount={recentGuardEvents.length}
        lastEvent={lastEvent}
      />
    </div>
  );
}
