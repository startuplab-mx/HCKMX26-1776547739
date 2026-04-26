"use client";

import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Save } from "lucide-react";
import {
  ingestionSources,
  classificationRules,
  escalationPartners,
  dashboardPreferences,
  type IngestionSource,
  type ClassificationRule,
  type EscalationPartner,
  type DashboardPreference,
} from "@/lib/mock/dashboardSectionsData";

// ── Config ────────────────────────────────────────────────────────────────────

const SEV_CFG = {
  critical: { bg: "bg-red-50",    text: "text-red-700",    label: "Crítica" },
  high:     { bg: "bg-orange-50", text: "text-orange-700", label: "Alta"    },
  medium:   { bg: "bg-amber-50",  text: "text-amber-700",  label: "Media"   },
  low:      { bg: "bg-slate-100", text: "text-slate-600",  label: "Baja"    },
};

const METHOD_CFG = {
  api:          { label: "API",           bg: "bg-brand-50",  text: "text-brand-700"  },
  secure_email: { label: "Email seguro",  bg: "bg-teal-50",   text: "text-teal-700"   },
  manual:       { label: "Revisión manual", bg: "bg-slate-100", text: "text-slate-600" },
};

// ── Toggle component ──────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-5 w-9 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-brand-600" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function SettingsView() {
  const [sources,     setSources]     = useState<IngestionSource[]>(ingestionSources);
  const [rules,       setRules]       = useState<ClassificationRule[]>(classificationRules);
  const [partners,    setPartners]    = useState<EscalationPartner[]>(escalationPartners);
  const [prefs,       setPrefs]       = useState<DashboardPreference[]>(dashboardPreferences);
  const [feedback,    setFeedback]    = useState<string | null>(null);
  const [testingId,   setTestingId]   = useState<string | null>(null);

  function toggleSource(id: string) {
    setSources((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  }

  function togglePartner(id: string) {
    setPartners((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  }

  function togglePref(id: string) {
    setPrefs((prev) => prev.map((p) => p.id === id ? { ...p, enabled: !p.enabled } : p));
  }

  function handleSave() {
    setFeedback("Configuración guardada correctamente.");
    setTimeout(() => setFeedback(null), 2500);
  }

  function handleRestore() {
    setSources(ingestionSources);
    setRules(classificationRules);
    setPartners(escalationPartners);
    setPrefs(dashboardPreferences);
    setFeedback("Valores restaurados a la configuración por defecto.");
    setTimeout(() => setFeedback(null), 2500);
  }

  async function handleTest(partnerId: string, partnerName: string) {
    setTestingId(partnerId);
    await new Promise((r) => setTimeout(r, 1200));
    setTestingId(null);
    setFeedback(`Integración con ${partnerName} respondió correctamente (200 OK).`);
    setTimeout(() => setFeedback(null), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Configuración</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Administración de fuentes, integraciones, reglas de clasificación y preferencias operativas.
        </p>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-xs font-semibold text-green-700">{feedback}</p>
        </div>
      )}

      {/* 1. Ingestion sources */}
      <SectionCard title="Fuentes de ingesta">
        <div className="space-y-3">
          {sources.map((src) => (
            <div key={src.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Toggle enabled={src.active} onChange={() => toggleSource(src.id)} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{src.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 font-medium">{src.type}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Última sync: {src.lastSync}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-700">{src.reliability}%</div>
                <p className="text-[10px] text-slate-400">Confiabilidad</p>
              </div>
              <div className="hidden sm:flex h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${src.reliability}%`,
                    backgroundColor: src.reliability >= 90 ? "#22c55e" : src.reliability >= 75 ? "#f59e0b" : "#ef4444",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 2. Classification rules */}
      <SectionCard title="Reglas de clasificación">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Patrón</th>
                <th className="text-left py-2 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Severidad</th>
                <th className="text-right py-2 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Coincidencias</th>
                <th className="text-right py-2 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Activa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map((rule) => {
                const sev = SEV_CFG[rule.severity];
                return (
                  <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-slate-700">{rule.pattern}</span>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums font-semibold text-slate-600 hidden md:table-cell">
                      {rule.matchCount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <Toggle enabled={rule.active} onChange={() => toggleRule(rule.id)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 3. Escalation partners */}
      <SectionCard title="Partners de escalamiento">
        <div className="space-y-3">
          {partners.map((p) => {
            const method = METHOD_CFG[p.method];
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Toggle enabled={p.active} onChange={() => togglePartner(p.id)} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-800">{p.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${method.bg} ${method.text}`}>
                      {method.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    SLA: <span className="font-semibold text-slate-600">{p.sla}</span>
                    <span className="mx-1.5 text-slate-200">·</span>
                    Último envío: {p.lastSent}
                    <span className="mx-1.5 text-slate-200">·</span>
                    {p.openCases} casos abiertos
                  </p>
                </div>
                <button
                  onClick={() => handleTest(p.id, p.name)}
                  disabled={testingId === p.id || !p.active}
                  className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-3 w-3 ${testingId === p.id ? "animate-spin" : ""}`} />
                  {testingId === p.id ? "Probando…" : "Probar"}
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* 4. Dashboard preferences */}
      <SectionCard title="Preferencias del dashboard">
        <div className="space-y-4">
          {prefs.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">{pref.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{pref.description}</p>
              </div>
              <Toggle enabled={pref.enabled} onChange={() => togglePref(pref.id)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 5. Security & ethics */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 mt-0.5">
            <Shield className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Seguridad y ética</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Layers Intel está diseñado como una herramienta de inteligencia de apoyo. Las decisiones operativas
              requieren validación humana autorizada. El sistema no actúa de forma autónoma sobre individuos.
              Todos los datos son tratados bajo los principios de mínima exposición y proporcionalidad.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-brand-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Guardar configuración
        </button>
        <button
          onClick={handleRestore}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Restaurar valores
        </button>
        <button
          onClick={() => {
            const activePartner = partners.find((p) => p.active);
            if (activePartner) handleTest(activePartner.id, activePartner.name);
          }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Probar integración
        </button>
      </div>
    </div>
  );
}
