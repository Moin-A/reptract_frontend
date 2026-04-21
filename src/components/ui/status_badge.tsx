import { STATUS_STYLES, type StatusVariant } from "@/components/dashboard/tokens";

type StatusBadgeProps = {
  variant: StatusVariant;
  label: string;
};

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const { bg, color } = STATUS_STYLES[variant];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}
