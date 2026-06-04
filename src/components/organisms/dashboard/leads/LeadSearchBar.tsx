"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { SearchTabToggle } from "@/components/atoms/SearchTabToggle";
import { SearchInput } from "@/components/atoms/SearchInput";
import { LEAD_STATUSES, LEAD_SOURCES } from "./statuses";

type SortKey = "newest" | "oldest" | "name";

type Props = {
  search:            string;
  onSearchChange:    (s: string) => void;
  searchTab:         "basic" | "advanced";
  onSearchTabChange: (t: "basic" | "advanced") => void;
  resultCount:       number;
  sort:              SortKey;
  onSortChange:      (s: SortKey) => void;
  advancedStatus:    string;
  onAdvancedStatusChange: (s: string) => void;
  advancedSource:    string;
  onAdvancedSourceChange: (s: string) => void;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name",   label: "Name A–Z"    },
];

export function LeadSearchBar({
  search, onSearchChange,
  searchTab, onSearchTabChange,
  resultCount,
  sort, onSortChange,
  advancedStatus, onAdvancedStatusChange,
  advancedSource, onAdvancedSourceChange,
}: Props) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px", borderBottom: `1px solid ${C.line}`,
        background: "white", flexWrap: "wrap",
      }}>
        <SearchTabToggle activeTab={searchTab} onTabChange={onSearchTabChange} />
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search leads…" />

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted }}>
          <span>Sort by</span>
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value as SortKey)}
            style={{
              fontSize: 12.5, color: C.accent, border: "none", background: "transparent",
              cursor: "pointer", fontFamily: "inherit", padding: 0, outline: "none",
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", marginLeft: "auto" }}>
          {resultCount} result{resultCount !== 1 ? "s" : ""}
        </span>
      </div>

      {searchTab === "advanced" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          padding: "12px 20px", background: "#FAFAF7", borderBottom: `1px solid ${C.line}`,
          fontSize: 12.5,
        }}>
          <span style={{ fontWeight: 600, color: C.muted2, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>
            Filters
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.muted, fontWeight: 500 }}>Status</label>
            <select
              value={advancedStatus}
              onChange={e => onAdvancedStatusChange(e.target.value)}
              style={{ fontSize: 12.5, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.line}`, background: "white", color: C.ink, fontFamily: "inherit", cursor: "pointer" }}
            >
              <option value="">All statuses</option>
              {LEAD_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.muted, fontWeight: 500 }}>Source</label>
            <select
              value={advancedSource}
              onChange={e => onAdvancedSourceChange(e.target.value)}
              style={{ fontSize: 12.5, padding: "4px 8px", borderRadius: 6, border: `1px solid ${C.line}`, background: "white", color: C.ink, fontFamily: "inherit", cursor: "pointer" }}
            >
              <option value="">All sources</option>
              {LEAD_SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          {(advancedStatus || advancedSource) && (
            <button
              onClick={() => { onAdvancedStatusChange(""); onAdvancedSourceChange(""); }}
              style={{ fontSize: 12, color: C.err, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", fontWeight: 500 }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
