"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  name: string;
  amt: number;
  acct: string;
};

export function PipelineDealCard({ name, amt, acct }: Props) {
  return (
    <div
      style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, cursor: "pointer", transition: "transform 120ms" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = C.ink2; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = C.line; }}
    >
      <div style={{ fontWeight: 600, lineHeight: 1.3, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{name}</div>
      <div style={{ fontSize: 11.5, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{amt ? `$${amt.toLocaleString()}` : "—"} · {acct}</div>
    </div>
  );
}
