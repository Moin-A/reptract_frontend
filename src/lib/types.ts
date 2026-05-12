import type { StageKey } from "@/components/organisms/dashboard/opportunities/stages";
import type { AccountCategoryKey } from "@/components/organisms/dashboard/accounts/categories";

// ── User ──────────────────────────────────────────────────────────
export interface User {
  id:         number;
  name:       string;
  email:      string;
  created_at: string;
  updated_at: string;
}

// ── Task ──────────────────────────────────────────────────────────
export type TaskUser = {
  id:    number;
  name:  string;
  email: string;
};

export type Task = {
  id:            number;
  name:          string;
  due:           string;
  overdue:       boolean;
  badge:         string;
  badgeColor:    string;
  badgeTextColor: string;
  done:          boolean;
  user?:         TaskUser | null;
  assignee?:     TaskUser | null;
};

// ── Account ───────────────────────────────────────────────────────
export type Account = {
  id:       number;
  name:     string;
  category: AccountCategoryKey;
  user:     string;
  daysAgo:  number;
  contacts: number;
  opps:     number;
  rating:   number;
};

// ── Opportunity ───────────────────────────────────────────────────
export type Opp = {
  id:      number;
  name:    string;
  stage:   StageKey;
  acct:    string;
  amt:     number;
  prob:    number;
  user:    string;
  daysAgo: number;
};

// ── Activity ──────────────────────────────────────────────────────
export type ActivityEntry = {
  tone:       "create" | "move" | "email" | "note" | "signup" | "delete" | "default";
  actor:      string;
  action:     string;
  object?:    string;
  objectHref?: string;
  suffix?:    string;
  metaTag?:   string;
  metaExtra?: string;
  time:       string;
};

export type DayGroup = {
  label:   string;
  entries: ActivityEntry[];
};
