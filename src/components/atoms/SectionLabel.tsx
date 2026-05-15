import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  label: string;
  padding?: string;
};

export function SectionLabel({ label, padding = "14px 20px 6px" }: Props) {
  return (
    <div style={{ padding, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, display: "flex", alignItems: "center", gap: 12 }}>
      {label}
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>
  );
}
