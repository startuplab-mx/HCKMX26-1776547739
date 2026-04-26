import { digitalSignals } from "@/lib/mockData";
import { Activity } from "lucide-react";

export default function DigitalSignals() {
  return (
    <div className="space-y-2">
      {digitalSignals.map((signal) => (
        <div
          key={signal.source}
          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 hover:bg-white hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-md ${
                signal.status === "elevated"
                  ? "bg-amber-100 text-amber-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <Activity className="h-3 w-3" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-700">
                {signal.source}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-700">
              {signal.volume.toLocaleString()}
            </span>
            <span
              className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                signal.status === "elevated"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {signal.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
