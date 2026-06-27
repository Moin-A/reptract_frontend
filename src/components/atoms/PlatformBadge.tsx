import type { PlatformKey } from "@/lib/types";
import { PLATFORMS } from "@/lib/campaigns";

type Props = { platform: PlatformKey; size?: number };

/** Small coloured square showing a social platform's glyph. */
export function PlatformBadge({ platform, size = 28 }: Props) {
  const meta = PLATFORMS[platform];
  return (
    <span style={{
      width: size, height: size, borderRadius: size * 0.3, flex: "none",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: meta.badge, color: "#fff", fontSize: size * 0.5, fontWeight: 700, lineHeight: 1,
    }}>{meta.mark}</span>
  );
}
