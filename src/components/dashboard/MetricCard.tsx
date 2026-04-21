import { C } from "./tokens";

type MetricCardProps = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

export function MetricCard({ label, value, delta, trend }: MetricCardProps) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, fontWeight: 600, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, marginTop: 4, color: trend === "up" ? C.ok : C.err }}>
        {delta}
      </div>
    </div>
  );
}
