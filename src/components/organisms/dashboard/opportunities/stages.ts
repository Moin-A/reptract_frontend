// Stage keys mirror the backend exactly (Opportunity#stage). The convert form
// and the create card both write these values, so they are the single source
// of truth — no "other", and "final_review" (not "final").
export type StageKey =
  | "prospecting" | "analysis" | "presentation" | "proposal"
  | "negotiation" | "final_review" | "won" | "lost";

export type Stage = {
  key: StageKey;
  label: string;
  color: string;
  pillBg: string;
  pillColor: string;
  prob: number;
  count: number;
};

export const STAGES: Stage[] = [
  { key: "prospecting",  label: "Prospecting",  color: "#6366F1", pillBg: "#EEF2FF", pillColor: "#3730A3", prob: 10,  count: 10 },
  { key: "analysis",     label: "Analysis",     color: "#06B6D4", pillBg: "#ECFEFF", pillColor: "#0E7490", prob: 20,  count: 9  },
  { key: "presentation", label: "Presentation", color: "#22C55E", pillBg: "#F0FDF4", pillColor: "#15803D", prob: 30,  count: 15 },
  { key: "proposal",     label: "Proposal",     color: "#F59E0B", pillBg: "#FEF3C7", pillColor: "#92400E", prob: 50,  count: 10 },
  { key: "negotiation",  label: "Negotiation",  color: "#FB923C", pillBg: "#FFEDD5", pillColor: "#9A3412", prob: 70,  count: 14 },
  { key: "final_review", label: "Final Review", color: "#C026D3", pillBg: "#FAE8FF", pillColor: "#86198F", prob: 85,  count: 20 },
  { key: "won",          label: "Closed/Won",   color: "#16A34A", pillBg: "#DCFCE7", pillColor: "#14532D", prob: 100, count: 14 },
  { key: "lost",         label: "Closed/Lost",  color: "#EF4444", pillBg: "#FEE2E2", pillColor: "#991B1B", prob: 0,   count: 11 },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map(s => [s.key, s])) as Record<StageKey, Stage>;
export const ALL_STAGE_KEYS: StageKey[] = STAGES.map(s => s.key);
export const PIPELINE_STAGE_KEYS: StageKey[] = ["prospecting", "analysis", "presentation", "proposal", "negotiation", "final_review", "won", "lost"];
