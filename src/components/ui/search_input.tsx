"use client";

import { Search } from "lucide-react";
import { C } from "@/components/dashboard/tokens";

type SearchInputProps = {
  placeholder?: string;
  shortcut?: string;
  width?: number;
};

export function SearchInput({ placeholder = "Quick find…", shortcut = "⌘K", width = 140 }: SearchInputProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.navHoverBg, border: `1px solid ${C.line2}`, borderRadius: 8, padding: "6px 12px" }}>
      <Search size={13} color="#5E5E62" />
      <input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ background: "none", border: 0, outline: 0, color: "white", fontSize: 12.5, fontFamily: "inherit", width }}
      />
      {shortcut && (
        <span style={{ fontSize: 10, padding: "2px 5px", borderRadius: 4, background: C.line2, color: "#8C8C92", fontFamily: "monospace", flexShrink: 0 }}>
          {shortcut}
        </span>
      )}
    </div>
  );
}
