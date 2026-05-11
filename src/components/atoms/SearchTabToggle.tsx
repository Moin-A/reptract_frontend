"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  activeTab: "basic" | "advanced";
  onTabChange: (t: "basic" | "advanced") => void;
};

export function SearchTabToggle({ activeTab, onTabChange }: Props) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {(["basic", "advanced"] as const).map(tab => (
        <button key={tab} onClick={() => onTabChange(tab)}
          style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 140ms", border: activeTab === tab ? `1px solid ${C.ink}` : "1px solid transparent", background: activeTab === tab ? C.ink : "transparent", color: activeTab === tab ? "white" : C.muted }}>
          {tab === "basic" ? "Basic search" : "Advanced search"}
        </button>
      ))}
    </div>
  );
}
