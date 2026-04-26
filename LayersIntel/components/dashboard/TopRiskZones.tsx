import { topRiskZones } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, getRiskColor } from "@/lib/utils";

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColor = {
  up: "text-red-500",
  down: "text-emerald-500",
  stable: "text-slate-400",
};

export default function TopRiskZones() {
  return (
    <div className="space-y-2">
      {topRiskZones.map((zone) => {
        const Icon = trendIcon[zone.trend as keyof typeof trendIcon];
        return (
          <div
            key={zone.zone}
            className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors group"
          >
            {/* Score bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-700 truncate">
                  {zone.zone}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      getRiskColor(zone.score)
                    )}
                  >
                    {zone.score}
                  </span>
                  <Icon
                    className={cn(
                      "h-3 w-3",
                      trendColor[zone.trend as keyof typeof trendColor]
                    )}
                  />
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    zone.score >= 75
                      ? "bg-red-400"
                      : zone.score >= 50
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  )}
                  style={{ width: `${zone.score}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
