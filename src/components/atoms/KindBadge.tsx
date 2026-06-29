import type { PostKind } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { Badge } from "@/components/ui/badge";

const KIND_STYLES: Record<PostKind, { label: string; bg: string; color: string }> = {
  post:  { label: "POST", bg: "#EEF2FF", color: "#3730A3" },
  ad:    { label: "AD",   bg: "#FFEDD5", color: "#9A3412" },
  draft: { label: "POST", bg: "#F1F0EC", color: C.muted },
};

/** POST/AD pill for a campaign post, built on the shared Badge. */
export function KindBadge({ kind }: { kind: PostKind }) {
  const m = KIND_STYLES[kind];
  return (
    <Badge style={{ background: m.bg, color: m.color, border: "none", letterSpacing: "0.05em", flex: "none", alignSelf: "flex-start" }}>
      {m.label}
    </Badge>
  );
}
