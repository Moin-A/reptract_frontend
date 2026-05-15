import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  label: string;
  first?: boolean;
  last?: boolean;
  onClick?: () => void;
};

export function ExportItem({ label, first = false, last = false, onClick }: Props) {
  return (
    <span
      onClick={onClick}
      style={{
        color: C.muted, fontWeight: 500, cursor: "pointer",
        padding: first ? "0 8px 0 0" : "0 8px",
        borderRight: last ? "none" : `1px solid ${C.line}`,
      }}
    >
      {label}
    </span>
  );
}
