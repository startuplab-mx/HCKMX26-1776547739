import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(score: number): string {
  if (score >= 75) return "text-red-500";
  if (score >= 50) return "text-amber-500";
  return "text-emerald-500";
}

export function getRiskBg(score: number): string {
  if (score >= 75) return "bg-red-50 border-red-100";
  if (score >= 50) return "bg-amber-50 border-amber-100";
  return "bg-emerald-50 border-emerald-100";
}

export function getSeverityColor(
  severity: "high" | "medium" | "low"
): string {
  const map = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return map[severity];
}
