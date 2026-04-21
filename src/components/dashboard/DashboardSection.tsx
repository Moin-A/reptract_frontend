import { C } from "./tokens";

type DashboardSectionProps = {
  title: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function DashboardSection({ title, action, footer, children }: DashboardSectionProps) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block", flexShrink: 0 }} />
          {title}
        </div>
        {action && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {action}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px" }}>{children}</div>

      {/* Optional footer slot (e.g. export bar) */}
      {footer && (
        <div style={{ borderTop: `1px solid ${C.line}`, background: "#FAFAF7" }}>
          {footer}
        </div>
      )}
    </div>
  );
}
