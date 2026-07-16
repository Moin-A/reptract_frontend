import { type Opp } from "@/lib/types";
import { type StageKey } from "./stages";

// The API opportunity shape (OpportunitySerializer). The panel's `Opp` is a
// flattened display shape, so this bridges the two.
export type ApiOpportunity = {
  id:          number;
  name:        string;
  stage:       string | null;
  amount:      number;
  probability: number;
  account:     string | null;   // account name
  user:        string | null;   // owner name
  created_at:  string;
};

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

export function mapOpp(o: ApiOpportunity): Opp {
  return {
    id:      o.id,
    name:    o.name,
    stage:   (o.stage ?? "prospecting") as StageKey,
    acct:    o.account ?? "—",
    amt:     o.amount ?? 0,
    prob:    o.probability ?? 0,
    user:    o.user ?? "Unassigned",
    daysAgo: daysSince(o.created_at),
  };
}
