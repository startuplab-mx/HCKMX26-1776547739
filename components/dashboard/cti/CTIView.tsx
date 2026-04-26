"use client";

import { useState, useCallback } from "react";
import CTIMetricCards from "./CTIMetricCards";
import SeverityDistribution from "./SeverityDistribution";
import LayersGuardIngestion from "./LayersGuardIngestion";
import ArtifactsPanel from "./ArtifactsPanel";
import PartnerEscalation from "./PartnerEscalation";
import ImpactAnalytics from "./ImpactAnalytics";
import IntelligenceQueue from "./IntelligenceQueue";
import AlertDetailDrawer from "./AlertDetailDrawer";
import RiskActors from "./RiskActors";
import type { CaseStatus } from "@/lib/mock/ctiData";
import type { GuardEvent } from "@/lib/types/heatmap";

export default function CTIView({ recentGuardEvents }: { recentGuardEvents?: GuardEvent[] }) {
  const [selectedId, setSelectedId]         = useState<string | null>(null);
  const [localStatuses, setLocalStatuses]   = useState<Record<string, CaseStatus>>({});

  const handleStatusChange = useCallback((id: string, newStatus: CaseStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: newStatus }));
  }, []);

  const handleClose = useCallback(() => setSelectedId(null), []);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Cyber Threat Intelligence</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Panel SOC — señales de Layers Guard, IOCs activos y casos en investigación
        </p>
      </div>

      {/* KPI cards */}
      <CTIMetricCards />

      {/* Row 1: Severity + Partners + System status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <SeverityDistribution />
        </div>
        <div className="lg:col-span-1">
          <PartnerEscalation />
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand-600 to-brand-800 shadow-card p-5 text-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-200">
                  Estado del sistema
                </span>
              </div>
              <p className="text-3xl font-bold tabular-nums">
                99.8<span className="text-lg font-normal text-brand-300">%</span>
              </p>
              <p className="text-sm text-brand-200 mt-1">Disponibilidad Layers Guard</p>
            </div>
            <div className="mt-6 space-y-2">
              {[
                { label: "Ingesta en tiempo real", ok: true },
                { label: "Correlación de IOCs",    ok: true },
                { label: "Canal CERT-MX",          ok: true },
                { label: "Canal FGR",              ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-brand-200">{label}</span>
                  <span className={`font-semibold ${ok ? "text-green-300" : "text-red-300"}`}>
                    {ok ? "Operativo" : "Degradado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact analytics */}
      <ImpactAnalytics />

      {/* Risk actors */}
      <RiskActors />

      {/* Layers Guard ingestion feed — clickable rows */}
      <LayersGuardIngestion onSelectAlert={setSelectedId} />

      {/* Artifacts panel */}
      <ArtifactsPanel recentGuardEvents={recentGuardEvents} />

      {/* Intelligence queue — clickable rows + live status overrides */}
      <IntelligenceQueue
        onSelectCase={setSelectedId}
        localStatuses={localStatuses}
      />

      {/* Alert detail drawer */}
      <AlertDetailDrawer
        caseId={selectedId}
        localStatus={selectedId ? localStatuses[selectedId] : undefined}
        onClose={handleClose}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
