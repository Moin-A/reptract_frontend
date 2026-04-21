import { Download, Plus } from "lucide-react";
import { C } from "./tokens";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  onExport?: () => void;
  onNewRecord?: () => void;
};

export function PageHeader({ title, subtitle, onExport, onNewRecord }: PageHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em" }}>{title}</div>
        <div style={{ fontSize: 13, color: C.muted }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <GhostButton icon={<Download size={14} />} label="Export" onClick={onExport} />
        <PrimaryButton icon={<Plus size={14} />} label="New record" onClick={onNewRecord} />
      </div>
    </div>
  );
}

type ButtonProps = {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export function GhostButton({ icon, label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: "pointer", border: `1px solid ${C.line}`,
        background: "white", color: C.ink,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export function PrimaryButton({ icon, label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
        cursor: "pointer", border: `1px solid ${C.accent}`,
        background: C.accent, color: "white",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
