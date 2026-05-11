export type AccountCategoryKey = "affiliate" | "competitor" | "customer" | "partner" | "reseller" | "vendor" | "other";

export type AccountCategory = {
  key:       AccountCategoryKey;
  label:     string;
  color:     string;
  pillBg:    string;
  pillColor: string;
  count:     number;
};

export const CATEGORIES: AccountCategory[] = [
  { key: "affiliate",  label: "Affiliate",  color: "#6366F1", pillBg: "#EEF2FF", pillColor: "#3730A3", count: 15 },
  { key: "competitor", label: "Competitor", color: "#EF4444", pillBg: "#FEE2E2", pillColor: "#991B1B", count: 14 },
  { key: "customer",   label: "Customer",   color: "#16A34A", pillBg: "#DCFCE7", pillColor: "#14532D", count: 10 },
  { key: "partner",    label: "Partner",    color: "#C026D3", pillBg: "#FAE8FF", pillColor: "#86198F", count: 18 },
  { key: "reseller",   label: "Reseller",   color: "#F59E0B", pillBg: "#FEF3C7", pillColor: "#92400E", count: 21 },
  { key: "vendor",     label: "Vendor",     color: "#06B6D4", pillBg: "#ECFEFF", pillColor: "#0E7490", count: 10 },
  { key: "other",      label: "Other",      color: "#94A3B8", pillBg: "#F1F5F9", pillColor: "#475569", count: 12 },
];

export const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c])) as Record<AccountCategoryKey, AccountCategory>;
export const ALL_CAT_KEYS: AccountCategoryKey[] = CATEGORIES.map(c => c.key);
