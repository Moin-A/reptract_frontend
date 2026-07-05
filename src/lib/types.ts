import type { StageKey } from "@/components/organisms/dashboard/opportunities/stages";
import type { AccountCategoryKey } from "@/components/organisms/dashboard/accounts/categories";
import type { LeadStatusKey, LeadSourceKey } from "@/components/organisms/dashboard/leads/statuses";

// ── User ──────────────────────────────────────────────────────────
export interface User {
  id:         number;
  name:       string;
  email:      string;
  created_at: string;
  updated_at: string;
}

// ── Group ─────────────────────────────────────────────────────────
export interface Group {
  id:   number;
  name: string;
}

export type PlatformKey = "mastodon" | "x" | "instagram" | "facebook";

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
  due_date?:     string | null;
};

// ── Address ───────────────────────────────────────────────────────
export type Address = {
  id:           number;
  address_type: string;
  street1:      string;
  street2:      string;
  city:         string;
  state:        string;
  zipcode:      string;
  country:      string;
};

// ── Account ───────────────────────────────────────────────────────
export type Account = {
  id:          number;
  name:        string;
  category:    AccountCategoryKey;
  user:        string;
  daysAgo:     number;
  contacts:    number;
  opps:        number;
  rating:      number;
  email?:      string;
  phone?:      string;
  assigned_to?: string | null;
  billing_address?:  Address | null;
  shipping_address?: Address | null;
};

// ── Lead ──────────────────────────────────────────────────────────
export type Lead = {
  id:           number;
  first_name:   string;
  last_name:    string;
  name:         string;        // derived: first_name + " " + last_name
  status:       LeadStatusKey;
  source:       LeadSourceKey;
  title?:       string;
  company?:     string;
  email?:       string;
  phone?:       string;
  alt_email?:   string;
  mobile?:      string;
  referred_by?: string;
  do_not_call?: boolean;
  rating:       number;
  tags?:        string[];
  assigned_to?: string | null;   // display name
  assignee_id?: number | null;   // numeric FK sent to backend
  campaign?:    string;
  website?:     string;
  linkedin?:    string;
  facebook?:    string;
  business_address?: Address | null;
  user:         string;
  daysAgo:      number;
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

// ── Activity (raw API) ────────────────────────────────────────────
export type Whodunnit = {
  id:    number;
  name:  string;
  email: string;
};

export type ActivityEntity = {
  id:         number;
  name?:      string;
  updated_at: string;
  [key: string]: unknown;
};

export type RawActivity = {
  id:          number;
  whodunnit:   Whodunnit;
  event:       string;
  item_id:     number;
  entity:      ActivityEntity | null;
  entity_type: string;
  due_date:    string;
  created_at:  string;
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
