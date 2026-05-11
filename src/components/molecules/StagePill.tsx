import { STAGE_MAP, type StageKey } from "@/components/organisms/dashboard/opportunities/stages";

export function StagePill({ stageKey }: { stageKey: StageKey }) {
  const s = STAGE_MAP[stageKey];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "5px 11px", borderRadius: 100, fontSize: 11.5, fontWeight: 700,
      whiteSpace: "nowrap", background: s.pillBg, color: s.pillColor,
      width: 120, flexShrink: 0,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 7, background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}
