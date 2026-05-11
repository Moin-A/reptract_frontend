"use client";

type Props = {
  label:     string;
  color:     string;
  pillBg:    string;
  pillColor: string;
};

export function AccountCategoryPill({ label, color, pillBg, pillColor }: Props) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 11px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, whiteSpace: "nowrap", background: pillBg, color: pillColor, flexShrink: 0 }}>
      <span style={{ width: 7, height: 7, borderRadius: 7, background: color, flexShrink: 0, display: "inline-block" }} />
      {label}
    </span>
  );
}
