"use client";

import { RefreshCw, ArrowUpRight } from "lucide-react";
import { partners, type PartnerStatus } from "@/lib/mock/ctiData";

const STATUS_CFG: Record<PartnerStatus, { label: string; dot: string; text: string }> = {
  active:   { label: "Activo",    dot: "bg-green-500",  text: "text-green-700"  },
  pending:  { label: "Pendiente", dot: "bg-amber-500",  text: "text-amber-700"  },
  resolved: { label: "Resuelto",  dot: "bg-slate-400",  text: "text-slate-500"  },
};

export default function PartnerEscalation() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Escalación a Socios</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Organismos gubernamentales y autoridades</p>
        </div>
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
        {partners.map((p) => {
          const cfg = STATUS_CFG[p.status];
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
            >
              {/* Avatar */}
              <div className="h-9 w-9 shrink-0 rounded-xl bg-brand-50 flex items-center justify-center">
                <span className="text-[11px] font-bold text-brand-700">{p.logo}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 truncate">{p.name}</span>
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-medium ${cfg.text}`}>{cfg.label}</span>
                  <span className="text-[10px] text-slate-400">· {p.lastSync}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-slate-800 tabular-nums">{p.casesOpen}</div>
                <div className="text-[10px] text-slate-400">casos</div>
              </div>

              {p.escalatedToday > 0 && (
                <div className="shrink-0">
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="h-3 w-3" />
                    {p.escalatedToday}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
