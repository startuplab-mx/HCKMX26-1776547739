"use client";

import { Copy } from "lucide-react";
import { artifacts, getSeverityConfig, type ArtifactType } from "@/lib/mock/ctiData";

const TYPE_ICON: Record<ArtifactType, string> = {
  ip:     "IP",
  domain: "DOM",
  hash:   "MD5",
  url:    "URL",
  email:  "EML",
};

const TYPE_COLOR: Record<ArtifactType, string> = {
  ip:     "bg-blue-50 text-blue-700",
  domain: "bg-purple-50 text-purple-700",
  hash:   "bg-slate-100 text-slate-600",
  url:    "bg-orange-50 text-orange-700",
  email:  "bg-teal-50 text-teal-700",
};

export default function ArtifactsPanel() {
  function copy(val: string) {
    navigator.clipboard.writeText(val).catch(() => {});
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Artefactos / IOCs</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">{artifacts.length} indicadores activos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Tipo</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px]">Valor</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Severidad</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden md:table-cell">Última vista</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-400 uppercase tracking-wide text-[10px] hidden sm:table-cell">Hits</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {artifacts.map((a) => {
              const sev = getSeverityConfig(a.severity);
              return (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_COLOR[a.type]}`}>
                      {TYPE_ICON[a.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <span className="font-mono text-[11px] text-slate-700 truncate block">{a.value}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {a.tags.map((t) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.text}`}>
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{a.lastSeen}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-600 font-semibold hidden sm:table-cell">
                    {a.hits}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => copy(a.value)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      title="Copiar"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
