import { MetricCard } from "./MetricCard";

type StatDef = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

type StatsGridProps = {
  stats: StatDef[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {stats.map(s => (
        <MetricCard key={s.label} label={s.label} value={s.value} delta={s.delta} trend={s.trend} />
      ))}
    </div>
  );
}
