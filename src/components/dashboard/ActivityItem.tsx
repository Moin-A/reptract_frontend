import { Avatar } from "@/components/ui/avatar";
import { C } from "./tokens";

type ActivityItemProps = {
  initials: string;
  avatarColor: string;
  text: React.ReactNode;
  timestamp: string;
  isLast?: boolean;
};

export function ActivityItem({ initials, avatarColor, text, timestamp, isLast = false }: ActivityItemProps) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 0",
      borderBottom: isLast ? "none" : `1px solid ${C.line}`,
    }}>
      <Avatar initials={initials} color={avatarColor} size={30} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: C.ink }}>{text}</div>
        <div style={{ fontSize: 11.5, color: C.muted2, marginTop: 2 }}>{timestamp}</div>
      </div>
    </div>
  );
}
