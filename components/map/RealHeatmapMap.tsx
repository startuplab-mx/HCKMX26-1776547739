"use client";

// Leaflet CSS must be imported here (client-only module) — Next.js bundles it correctly.
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import { mexicoCityRiskPoints, type RiskPoint } from "@/lib/mockData";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getRiskColor(score: number): string {
  if (score >= 75) return "#ef4444"; // red
  if (score >= 50) return "#f97316"; // orange
  return "#f59e0b";                  // amber
}

function getRiskLabel(score: number): "Alto" | "Medio" | "Bajo" {
  if (score >= 75) return "Alto";
  if (score >= 50) return "Medio";
  return "Bajo";
}

/** Geographic radii in metres. Produces a layered heat-glow effect at zoom 11. */
function getRadii(score: number): { outer: number; mid: number; dot: number } {
  if (score >= 75) return { outer: 2200, mid: 1100, dot: 480 };
  if (score >= 50) return { outer: 1700, mid: 850, dot: 380 };
  return { outer: 1200, mid: 600, dot: 280 };
}

// ── Per-point risk zone (three concentric circles + popup) ───────────────────

function RiskZone({ point }: { point: RiskPoint }) {
  const color = getRiskColor(point.riskScore);
  const label = getRiskLabel(point.riskScore);
  const { outer, mid, dot } = getRadii(point.riskScore);

  const popupContent = (
    <div style={{ minWidth: 170, fontFamily: "inherit" }}>
      <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 6 }}>
        {point.zone}
      </div>
      <span
        style={{
          display: "inline-block",
          background: color,
          color: "#fff",
          borderRadius: 999,
          padding: "2px 10px",
          fontSize: 11,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        {label} Risk · {point.riskScore}
      </span>
      <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
        <div>
          <span style={{ color: "#94a3b8" }}>Tipo: </span>
          {point.incidentType}
        </div>
        <div>
          <span style={{ color: "#94a3b8" }}>Actualizado: </span>
          {point.lastUpdated}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Outer diffuse glow */}
      <Circle
        center={[point.lat, point.lng]}
        radius={outer}
        pathOptions={{
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.07,
          weight: 0,
          interactive: false,
        }}
      />

      {/* Mid glow ring */}
      <Circle
        center={[point.lat, point.lng]}
        radius={mid}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.14,
          weight: 0.8,
          opacity: 0.25,
          interactive: false,
        }}
      />

      {/* Core dot — carries the popup */}
      <Circle
        center={[point.lat, point.lng]}
        radius={dot}
        pathOptions={{
          color: "#ffffff",
          fillColor: color,
          fillOpacity: 0.92,
          weight: 2,
          opacity: 0.9,
        }}
      >
        <Popup
          minWidth={180}
          className="leaflet-popup-layers"
          closeButton={true}
          autoPan={true}
        >
          {popupContent}
        </Popup>
      </Circle>
    </>
  );
}

// ── Legend ───────────────────────────────────────────────────────────────────

const legendItems = [
  { label: "Riesgo Alto",  color: "#ef4444" },
  { label: "Riesgo Medio", color: "#f97316" },
  { label: "Riesgo Bajo",  color: "#f59e0b" },
];

// ── Main export ───────────────────────────────────────────────────────────────

export default function RealHeatmapMap() {
  return (
    <div className="absolute inset-0">
      <MapContainer
        // Mexico City centre
        center={[19.4326, -99.1332]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        // Prevent accidental scroll-to-zoom while scrolling the landing page
        scrollWheelZoom={false}
        // Hide default zoom UI — kept minimal for Apple-like aesthetic
        zoomControl={false}
        // Disable attribution (we credit in CSS tooltip) — kept via TileLayer
        attributionControl={true}
      >
        {/* CartoDB Positron — light, minimal tiles that match the design system */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {mexicoCityRiskPoints.map((point) => (
          <RiskZone key={point.id} point={point} />
        ))}
      </MapContainer>

      {/* ── Overlays (z-[1000] sits above all Leaflet panes ~400–600) ── */}

      {/* Legend — bottom-left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-card px-3 py-2.5 pointer-events-none">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
          Nivel de Riesgo
        </p>
        {legendItems.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Live indicator — top-right */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-600">En vivo</span>
      </div>
    </div>
  );
}
