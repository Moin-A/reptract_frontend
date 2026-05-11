"use client";
import { C } from "@/components/dashboard/tokens";
import { SearchTabToggle } from "@/components/dashboard/atoms/SearchTabToggle";
import { SearchInput } from "@/components/dashboard/atoms/SearchInput";

type Props = {
  search: string;
  onSearchChange: (s: string) => void;
  searchTab: "basic" | "advanced";
  onSearchTabChange: (t: "basic" | "advanced") => void;
  resultCount: number;
};

export function OppSearchBar({ search, onSearchChange, searchTab, onSearchTabChange, resultCount }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: `1px solid ${C.line}`, background: "white", flexWrap: "wrap" }}>
      <SearchTabToggle activeTab={searchTab} onTabChange={onSearchTabChange} />
      <SearchInput value={search} onChange={onSearchChange} placeholder="Search opportunities…" />
      <div style={{ fontSize: 12.5, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
        Sort by <a href="#" onClick={e => e.preventDefault()} style={{ color: C.accent, marginLeft: 4 }}>date created</a>
      </div>
      <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap" }}>
        Search found {resultCount} result{resultCount !== 1 ? "s" : ""}.
      </span>
    </div>
  );
}
