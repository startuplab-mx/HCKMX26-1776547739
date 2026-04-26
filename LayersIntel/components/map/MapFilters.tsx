"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  type FilterState,
  type IncidentType,
  type IncidentSource,
  type RiskLevel,
  type DateRange,
  DEFAULT_FILTERS,
  TYPE_LABELS,
  SOURCE_LABELS,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface MapFiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

// Generic multi-toggle helper
function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const RISK_LEVELS: { id: RiskLevel; label: string; color: string }[] = [
  { id: "high",   label: "Alto",  color: "bg-red-500"   },
  { id: "medium", label: "Medio", color: "bg-orange-400" },
  { id: "low",    label: "Bajo",  color: "bg-amber-400"  },
];

const DATE_OPTIONS: { id: DateRange; label: string }[] = [
  { id: "24h", label: "Últimas 24 horas" },
  { id: "7d",  label: "Últimos 7 días"   },
  { id: "30d", label: "Últimos 30 días"  },
];

const TYPES: IncidentType[] = [
  "theft",
  "violence",
  "recruitment",
  "drug_activity",
  "suspicious_activity",
];

const SOURCES: IncidentSource[] = [
  "official",
  "social_media",
  "osint",
  "citizen_reports",
];

export default function MapFilters({
  filters,
  onChange,
  resultCount,
}: MapFiltersProps) {
  const isDirty =
    filters.riskLevels.length > 0 ||
    filters.types.length > 0 ||
    filters.dateRange !== "30d" ||
    filters.sources.length > 0;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-brand-600" />
          <span className="text-xs font-semibold text-slate-800">Filtros</span>
        </div>
        {isDirty && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Scrollable filter body */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Risk Level */}
        <Section title="Nivel de Riesgo">
          <div className="flex flex-wrap gap-2">
            {RISK_LEVELS.map(({ id, label, color }) => (
              <button
                key={id}
                onClick={() =>
                  onChange({ ...filters, riskLevels: toggle(filters.riskLevels, id) })
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all",
                  filters.riskLevels.includes(id)
                    ? "border-transparent bg-slate-800 text-white"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", color)} />
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* Incident Type */}
        <Section title="Tipo de Incidente">
          <div className="space-y-1.5">
            {TYPES.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() =>
                    onChange({ ...filters, types: toggle(filters.types, type) })
                  }
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-brand-600"
                />
                <span className="text-xs text-slate-700">{TYPE_LABELS[type]}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Date Range */}
        <Section title="Rango de Fechas">
          <div className="space-y-1.5">
            {DATE_OPTIONS.map(({ id, label }) => (
              <label
                key={id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-slate-50 transition-colors"
              >
                <input
                  type="radio"
                  name="dateRange"
                  checked={filters.dateRange === id}
                  onChange={() => onChange({ ...filters, dateRange: id })}
                  className="h-3.5 w-3.5 border-slate-300 accent-brand-600"
                />
                <span className="text-xs text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Source */}
        <Section title="Fuente">
          <div className="space-y-1.5">
            {SOURCES.map((src) => (
              <label
                key={src}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.sources.includes(src)}
                  onChange={() =>
                    onChange({ ...filters, sources: toggle(filters.sources, src) })
                  }
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-brand-600"
                />
                <span className="text-xs text-slate-700">{SOURCE_LABELS[src]}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>

      {/* Footer — result count */}
      <div className="border-t border-slate-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Mostrando</span>
          <span className="text-xs font-semibold text-brand-600">
            {resultCount} incidente{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
