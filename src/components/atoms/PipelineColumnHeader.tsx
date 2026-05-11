"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  color: string;
  label: string;
  count: number;
};

export function PipelineColumnHeader({ color, label, count }: Props) {
  return (
    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: 7, background: color, display: "inline-block" }} />
        {label}
      </span>
      <span style={{ fontSize: 11.5, color: C.muted, background: C.bg, padding: "1px 7px", borderRadius: 100 }}>{count}</span>
    </div>
  );
}
