"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { SearchTabToggle } from "@/components/atoms/SearchTabToggle";
import { SearchInput } from "@/components/atoms/SearchInput";
import { CATEGORIES } from "./categories";

type SortKey = "newest" | "oldest" | "name";

type Props = {
  search:                     string;
  onSearchChange:             (s: string) => void;
  searchTab:                  "basic" | "advanced";
  onSearchTabChange:          (t: "basic" | "advanced") => void;
  resultCount:                number;
  sort:                       SortKey;
  onSortChange:               (s: SortKey) => void;
  advancedCategory:           string;
  onAdvancedCategoryChange:   (c: string) => void;
  advancedMinRating:          number;
  onAdvancedMinRatingChange:  (r: number) => void;
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name",   label: "Name A–Z"    },
];

export function AccountSearchBar({
  search, onSearchChange,
  searchTab, onSearchTabChange,
  resultCount,
  sort, onSortChange,
  advancedCategory, onAdvancedCategoryChange,
  advancedMinRating, onAdvancedMinRatingChange,
}: Props) {
  return (
    <div>
      {/* Main bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px", borderBottom: `1px solid ${C.line}`,
        background: "white", flexWrap: "wrap",
      }}>
        <SearchTabToggle activeTab={searchTab} onTabChange={onSearchTabChange} />
        <SearchInput value={search} onChange={onSearchChange} placeholder="Search accounts…" />

        {/* Sort dropdown */}
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

      {/* Advanced filter panel */}
      {searchTab === "advanced" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          padding: "12px 20px", background: "#FAFAF7", borderBottom: `1px solid ${C.line}`,
          fontSize: 12.5,
        }}>
          <span style={{ fontWeight: 600, color: C.muted2, textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 11 }}>
            Filters
          </span>

          {/* Category filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.muted, fontWeight: 500 }}>Category</label>
            <select
              value={advancedCategory}
              onChange={e => onAdvancedCategoryChange(e.target.value)}
              style={{
                fontSize: 12.5, padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${C.line}`, background: "white",
                color: C.ink, fontFamily: "inherit", cursor: "pointer",
              }}
            >
              <option value="">All categories</option>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Min rating filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ color: C.muted, fontWeight: 500 }}>Min rating</label>
            <select
              value={advancedMinRating}
              onChange={e => onAdvancedMinRatingChange(Number(e.target.value))}
              style={{
                fontSize: 12.5, padding: "4px 8px", borderRadius: 6,
                border: `1px solid ${C.line}`, background: "white",
                color: C.ink, fontFamily: "inherit", cursor: "pointer",
              }}
            >
              <option value={0}>Any</option>
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{"★".repeat(n)} {n}+</option>
              ))}
            </select>
          </div>

          {/* Reset filters */}
          {(advancedCategory || advancedMinRating > 0) && (
            <button
              onClick={() => { onAdvancedCategoryChange(""); onAdvancedMinRatingChange(0); }}
              style={{
                fontSize: 12, color: C.err, background: "none", border: "none",
                cursor: "pointer", padding: 0, fontFamily: "inherit", fontWeight: 500,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
