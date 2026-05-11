"use client";
import { useState } from "react";
import { C } from "@/components/dashboard/tokens";
import { type Opp } from "@/lib/types";
import { StagePill } from "@/components/dashboard/molecules/StagePill";
import { HoverAction } from "@/components/dashboard/molecules/HoverActions";
import { OppRowInfo } from "@/components/dashboard/atoms/OppRowInfo";

type Props = {
  opps: Opp[];
  onDelete: (id: number) => void;
};

export function OppListView({ opps, onDelete }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (opps.length === 0) {
    return (
      <div style={{ padding: "32px 20px", fontSize: 13.5, color: C.muted, textAlign: "center" }}>
        No opportunities match your filters.
      </div>
    );
  }

  return (
    <div>
      {opps.map(o => {
        const amt = o.amt ? `$${o.amt.toLocaleString()}` : "—";
        const isHovered = hoveredId === o.id;
        return (
          <div key={o.id}
            onMouseEnter={() => setHoveredId(o.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${C.line}`, cursor: "pointer", background: isHovered ? "#FAFAF7" : "transparent", transition: "background 120ms" }}>
            <StagePill stageKey={o.stage} />
            <OppRowInfo
              name={o.name}
              acct={o.acct}
              daysAgo={o.daysAgo}
              user={o.user}
              amt={amt}
              prob={o.prob}
            />
            <HoverAction
              hovered={isHovered}
              onDelete={() => onDelete(o.id)}
              task={o}
            />
          </div>
        );
      })}
    </div>
  );
}
