"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { MetricCard } from "./MetricCard";

export type StatDef = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

type StatsGridProps = {
  stats: StatDef[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
      {stats.map(s => (
        <MetricCard key={s.label} label={s.label} value={s.value} delta={s.delta} trend={s.trend} />
      ))}
    </div>
  );
}
