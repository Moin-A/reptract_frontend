import type { ReactNode } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = { children: ReactNode; count?: ReactNode };

/**
 * Uppercase section/field label with an optional right-aligned count.
 * (Distinct from the divider-style `SectionLabel` atom used elsewhere.)
 */
export function CampaignSectionLabel({ children, count }: Props) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: C.muted2 }}>{children}</span>
      {count != null && <span style={{ fontSize: 11, fontWeight: 600, color: C.muted2 }}>{count}</span>}
    </div>
  );
}
