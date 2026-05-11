"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { STAGE_MAP, PIPELINE_STAGE_KEYS } from "./stages";
import { type Opp } from "@/lib/types";
import { PipelineColumnHeader } from "@/components/atoms/PipelineColumnHeader";
import { PipelineDealCard } from "@/components/atoms/PipelineDealCard";
import { PipelineColumnFooter } from "@/components/atoms/PipelineColumnFooter";

type Props = {
  opps: Opp[];
  stageFilter: string[];
};

export function OppPipelineView({ opps, stageFilter }: Props) {
  const visibleStages = PIPELINE_STAGE_KEYS.filter(k => stageFilter.includes(k));

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${visibleStages.length || 1}, minmax(180px, 1fr))`, gap: 14, padding: 20, background: "#FAFAF7", overflowX: "auto" }}>
      {visibleStages.map(k => {
        const s = STAGE_MAP[k];
        const items = opps.filter(o => o.stage === k);
        const total = items.reduce((sum, o) => sum + (o.amt || 0), 0);
        return (
          <div key={k} style={{ background: "white", border: `1px solid ${C.line}`, borderRadius: 12, minWidth: 180, display: "flex", flexDirection: "column" }}>
            <PipelineColumnHeader color={s.color} label={s.label} count={items.length} />
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, minHeight: 80 }}>
              {items.length === 0
                ? <div style={{ fontSize: 11.5, color: C.muted2, textAlign: "center", padding: "12px 4px" }}>No deals</div>
                : items.map(o => <PipelineDealCard key={o.id} name={o.name} amt={o.amt} acct={o.acct} />)
              }
            </div>
            {items.length > 0 && <PipelineColumnFooter total={total} />}
          </div>
        );
      })}
    </div>
  );
}
