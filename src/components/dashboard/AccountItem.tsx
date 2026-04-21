import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status_badge";
import { type StatusVariant, C } from "./tokens";

type AccountItemProps = {
  initials: string;
  avatarColor: string;
  name: string;
  sub: string;
  status: string;
  statusVariant: StatusVariant;
  isLast?: boolean;
};

export function AccountItem({ initials, avatarColor, name, sub, status, statusVariant, isLast = false }: AccountItemProps) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0", fontSize: 13.5,
      borderBottom: isLast ? "none" : `1px solid ${C.line}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar initials={initials} color={avatarColor} />
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
        </div>
      </div>
      <StatusBadge variant={statusVariant} label={status} />
    </div>
  );
}
