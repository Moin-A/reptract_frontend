export type LeadStatusKey = "new" | "contacted" | "converted" | "rejected" | "other";

export type LeadStatus = {
  key:       LeadStatusKey;
  label:     string;
  color:     string;   // avatar / dot color
  pillBg:    string;
  pillColor: string;
  count:     number;
};

export const LEAD_STATUSES: LeadStatus[] = [
  { key: "new",       label: "New",       color: "#F59E0B", pillBg: "#FEF3C7", pillColor: "#92400E", count: 0 },
  { key: "contacted", label: "Contacted", color: "#3B82F6", pillBg: "#DBEAFE", pillColor: "#1E40AF", count: 0 },
  { key: "converted", label: "Converted", color: "#16A34A", pillBg: "#DCFCE7", pillColor: "#14532D", count: 0 },
  { key: "rejected",  label: "Rejected",  color: "#EF4444", pillBg: "#FEE2E2", pillColor: "#991B1B", count: 0 },
  { key: "other",     label: "Other",     color: "#94A3B8", pillBg: "#F1F5F9", pillColor: "#475569", count: 0 },
];

export const LEAD_STATUS_MAP = Object.fromEntries(
  LEAD_STATUSES.map(s => [s.key, s])
) as Record<LeadStatusKey, LeadStatus>;

export const ALL_LEAD_STATUS_KEYS: LeadStatusKey[] = LEAD_STATUSES.map(s => s.key);

export type LeadSourceKey = "other" | "cold_call" | "conference" | "online_store" | "referral" | "web" | "word_of_mouth";

export const LEAD_SOURCES: { key: LeadSourceKey; label: string }[] = [
  { key: "other",         label: "Other"         },
  { key: "cold_call",     label: "Cold call"     },
  { key: "conference",    label: "Conference"    },
  { key: "online_store",  label: "Online store"  },
  { key: "referral",      label: "Referral"      },
  { key: "web",           label: "Web"           },
  { key: "word_of_mouth", label: "Word of mouth" },
];
