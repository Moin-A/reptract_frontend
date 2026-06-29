import type { CSSProperties } from "react";
import type { PlatformKey } from "@/lib/types";
import { C } from "@/components/organisms/dashboard/tokens";

/* ------------------------------------------------------------------ */
/* platform registry                                                   */
/* ------------------------------------------------------------------ */

export type PlatformMeta = { label: string; limit: number; mark: string; badge: string };

export const PLATFORMS: Record<PlatformKey, PlatformMeta> = {
  mastodon:  { label: "Mastodon",  limit: 500,  mark: "m",  badge: "#6364FF" },
  x:         { label: "X",         limit: 280,  mark: "𝕏",  badge: "#0B0B0C" },
  instagram: { label: "Instagram", limit: 2200, mark: "◙",  badge: "linear-gradient(45deg,#FEDA75,#D62976,#962FBF)" },
};

/* ------------------------------------------------------------------ */
/* mock data                                                           */
/* ------------------------------------------------------------------ */

export type ConnectedAccount = { handle: string; platform: PlatformKey; sub: string; healthy: boolean };

export const ACCOUNTS: ConnectedAccount[] = [
  { handle: "@ironunion@mastodon.social", platform: "mastodon",  sub: "Mastodon",                       healthy: true  },
  { handle: "@IronUnionGym",              platform: "x",         sub: "X",                              healthy: true  },
  { handle: "@ironunion.denver",          platform: "instagram", sub: "Instagram · reconnect needed",   healthy: false },
];

export type MonthStat = { label: string; value: string; danger?: boolean };

export const MONTH: MonthStat[] = [
  { label: "Posts published", value: "48" },
  { label: "Scheduled",       value: "6" },
  { label: "Failed",          value: "2", danger: true },
  { label: "Total reach",     value: "21.4K" },
];

export type PubStatus = "published" | "pending" | "failed" | "draft";
export type PostKind = "post" | "ad" | "draft";

export type PostMedia = { id: number; filename: string; url: string };

export type Post = {
  id?: number;             // from the API
  kind: PostKind;
  content?: string;        // from the API
  body?: string;           // legacy mock field
  time?: string;
  media: PostMedia[];
  publications: { id: number; status: PubStatus; platform: PlatformKey }[];
  draft?: boolean;
  status?: PubStatus;
};

export const POSTS: Post[] = [
  { kind: "post", time: "2h ago", media: [], body: "New 6am strength class drops Monday 💪 First session is free for members. Link in bio. reptrack.io/strength",
    publications: [{ id: 1, status: "published", platform: "mastodon" }, { id: 2, status: "published", platform: "x" }] },
  { kind: "ad", time: "5h ago", media: [], body: "Summer Shred challenge — 8 weeks, real coaching, measurable results. Join 200+ members already signed up. reptrack.io/shred",
    publications: [{ id: 3, status: "published", platform: "x" }, { id: 4, status: "failed", platform: "instagram" }] },
  { kind: "post", time: "just now", media: [], body: "Throwback to last weekend's deadlift PR board. Who's breaking a record this week?",
    publications: [{ id: 5, status: "pending", platform: "mastodon" }, { id: 6, status: "pending", platform: "instagram" }] },
  { kind: "draft", time: "1d ago", media: [], draft: true, body: "Draft: member spotlight on Marco — down 30lbs in 4 months. Need to grab his before/after photos.", publications: [] },
];

/* ------------------------------------------------------------------ */
/* publication status styling                                          */
/* ------------------------------------------------------------------ */

export const STATUS: Record<PubStatus, { c: string; bg: string }> = {
  published: { c: C.ok,     bg: "#ECFDF5" },
  pending:   { c: C.warn,   bg: "#FBF6E7" },
  failed:    { c: C.err,    bg: "#FCEEEC" },
  draft:     { c: C.muted2, bg: "#F1F0EC" },
};

/* shared card surface used by the composer + posts cards */
export const CARD_STYLE: CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.line}`,
  borderRadius: 16,
  boxShadow: "0 1px 2px rgba(16,16,18,.04), 0 6px 20px -12px rgba(16,16,18,.12)",
};

export async function getCampaigns(): Promise<[]> {
  return [];
}
