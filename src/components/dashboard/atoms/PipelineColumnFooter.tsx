"use client";
import { C } from "@/components/dashboard/tokens";

type Props = {
  total: number;
};

export function PipelineColumnFooter({ total }: Props) {
  return (
    <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.line}`, fontSize: 11.5, color: C.muted, display: "flex", justifyContent: "space-between" }}>
      <span>Total</span>
      <b style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>${total.toLocaleString()}</b>
    </div>
  );
}
