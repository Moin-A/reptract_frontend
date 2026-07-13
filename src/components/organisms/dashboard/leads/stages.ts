export type OpportunityStageKey =
  | "prospecting"
  | "analysis"
  | "presentation"
  | "proposal"
  | "negotiation"
  | "final_review"
  | "won"
  | "lost";

export const OPPORTUNITY_STAGES: { key: OpportunityStageKey; label: string }[] = [
  { key: "prospecting",  label: "Prospecting"  },
  { key: "analysis",     label: "Analysis"     },
  { key: "presentation", label: "Presentation" },
  { key: "proposal",     label: "Proposal"     },
  { key: "negotiation",  label: "Negotiation"  },
  { key: "final_review", label: "Final Review" },
  { key: "won",          label: "Won"          },
  { key: "lost",         label: "Lost"         },
];
