"use client";

import type { GuardEvent } from "@/lib/types/heatmap";
import RiskIndicatorsTable from "@/components/dashboard/RiskIndicatorsTable";

interface Props {
  recentGuardEvents?: GuardEvent[];
}

export default function ArtifactsPanel({ recentGuardEvents }: Props) {
  return <RiskIndicatorsTable recentGuardEvents={recentGuardEvents} />;
}
