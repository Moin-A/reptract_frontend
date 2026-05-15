import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  title: string;
  actions?: React.ReactNode;
};

export function PanelHeader({ title, actions }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block", flexShrink: 0 }} />
        {title}
      </div>
      {actions}
    </div>
  );
}
