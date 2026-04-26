"use client";

import "leaflet/dist/leaflet.css";
import { Fragment } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from "react-leaflet";
import type { Incident } from "@/lib/mockData";
import { TYPE_LABELS, SOURCE_LABELS } from "@/lib/mockData";

// ── Colour helpers ────────────────────────────────────────────────────────────

function riskColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f97316";
  return "#f59e0b";
}

function riskLabel(score: number): string {
  if (score >= 75) return "Alto";
  if (score >= 50) return "Medio";
  return "Bajo";
}

/** Geographic radii in metres (heatmap mode). Scaled by risk. */
function heatRadii(score: number) {
  if (score >= 75) return { outer: 2000, mid: 1000 };
  if (score >= 50) return { outer: 1500, mid: 750  };
  return                  { outer: 1000, mid: 500   };
}

// ── Popup card ────────────────────────────────────────────────────────────────

function IncidentPopup({ inc }: { inc: Incident }) {
  const color = riskColor(inc.risk);
  const dt = new Date(inc.timestamp).toLocaleString("en-MX", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ minWidth: 186, fontFamily: "inherit" }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 6 }}>
        {inc.zone}
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
        {riskLabel(inc.risk)} Risk · {inc.risk}
      </span>
      <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["Tipo",        TYPE_LABELS[inc.type]   ],
            ["Fuente",      SOURCE_LABELS[inc.source]],
            ["Fecha/Hora",  dt                        ],
          ].map(([k, v]) => (
            <tr key={k}>
              <td style={{ color: "#94a3b8", paddingRight: 8, paddingBottom: 2 }}>{k}</td>
              <td style={{ color: "#475569", fontWeight: 500 }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND = [
  { label: "Riesgo Alto",  color: "#ef4444" },
  { label: "Riesgo Medio", color: "#f97316" },
  { label: "Riesgo Bajo",  color: "#f59e0b" },
];

// ── Main component ────────────────────────────────────────────────────────────

export type MapViewMode = "heatmap" | "markers";

interface Props {
  incidents: Incident[];
  viewMode: MapViewMode;
}

export default function FilteredMapLeaflet({ incidents, viewMode }: Props) {
  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[19.41, -99.15]}
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

        {incidents.map((inc) => {
          const color = riskColor(inc.risk);
          const popup = <IncidentPopup inc={inc} />;

          if (viewMode === "heatmap") {
            const { outer, mid } = heatRadii(inc.risk);
            return (
              // Fragment lets us return three Leaflet layers per incident
              <Fragment key={inc.id}>
                <Circle center={[inc.lat, inc.lng]} radius={outer}
                  pathOptions={{ color: "transparent", fillColor: color, fillOpacity: 0.07, weight: 0, interactive: false }}
                />
                <Circle center={[inc.lat, inc.lng]} radius={mid}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.15, weight: 0.5, opacity: 0.25, interactive: false }}
                />
                <CircleMarker center={[inc.lat, inc.lng]} radius={7}
                  pathOptions={{ color: "#fff", fillColor: color, fillOpacity: 0.95, weight: 1.5, opacity: 1 }}
                >
                  <Popup minWidth={190} closeButton>{popup}</Popup>
                </CircleMarker>
              </Fragment>
            );
          }

          // Markers mode — just the dot
          return (
            <CircleMarker
              key={inc.id}
              center={[inc.lat, inc.lng]}
              radius={8}
              pathOptions={{ color: "#fff", fillColor: color, fillOpacity: 0.9, weight: 2, opacity: 1 }}
            >
              <Popup minWidth={190} closeButton>{popup}</Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-xl border border-slate-100 shadow-card px-3 py-2.5 pointer-events-none">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
          Nivel de Riesgo
        </p>
        {LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 mb-1 last:mb-0">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[11px] font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* View mode badge */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 pointer-events-none">
        <span className="text-[10px] font-semibold text-slate-600 capitalize">{viewMode}</span>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm px-2.5 py-1.5 flex items-center gap-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-semibold text-slate-600">En vivo · {incidents.length} pts</span>
      </div>
    </div>
  );
}
