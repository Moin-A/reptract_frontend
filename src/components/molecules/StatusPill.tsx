import type { PlatformKey } from "@/lib/types";
import { PLATFORMS, STATUS, type PublicationStatus } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";

type Props = { platform: PlatformKey; status: PublicationStatus };

/** Per-platform publication status chip: icon + name + status dot. */
export function StatusPill({ platform, status }: Props) {
  const s = STATUS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 10px 4px 5px",
      borderRadius: 999, background: C.surface, border: `1px solid ${C.line}`, fontSize: 12, color: C.ink2,
    }}>
      <PlatformBadge platform={platform} size={18} />
      {PLATFORMS[platform].label}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: s.c, fontWeight: 500 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: s.c }} />{s.label}
      </span>
    </span>
  );
}
