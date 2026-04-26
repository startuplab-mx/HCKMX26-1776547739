import { alertsData } from "@/lib/mockData";
import { getSeverityColor } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Radio, Search } from "lucide-react";

const iconMap = {
  high: AlertTriangle,
  medium: Radio,
  low: CheckCircle2,
};

const typeIconMap: Record<string, React.ElementType> = {
  "Alerta OSINT": Search,
};

export default function AlertsList() {
  return (
    <div className="space-y-2">
      {alertsData.map((alert) => {
        const Icon = typeIconMap[alert.type] ?? iconMap[alert.severity];
        return (
          <div
            key={alert.id}
            className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2.5 hover:bg-white hover:shadow-sm transition-all"
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${getSeverityColor(alert.severity)}`}
            >
              <Icon className="h-3 w-3" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-700 truncate">
                  {alert.zone}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {alert.time}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-1">
                {alert.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
