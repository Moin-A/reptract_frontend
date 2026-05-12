"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { type Account } from "@/lib/types";
import { CAT_MAP } from "./categories";
import { AccountAvatar } from "@/components/atoms/AccountAvatar";
import { AccountCategoryPill } from "@/components/atoms/AccountCategoryPill";
import { HoverAction } from "@/components/molecules/HoverActions";

type Props = {
  accounts: Account[];
  onDelete: (id: number) => void;
};

export function AccountListView({ accounts, onDelete }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (accounts.length === 0) {
    return (
      <div style={{ padding: "32px 20px", fontSize: 13.5, color: C.muted, textAlign: "center" }}>
        No accounts match your filters.
      </div>
    );
  }

  return (
    <div>
      {accounts.map(a => {
        const cat = CAT_MAP[a.category] ?? CAT_MAP["other"];
        const isHovered = hoveredId === a.id;
        return (
          <div key={a.id}
            onMouseEnter={() => setHoveredId(a.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${C.line}`, cursor: "pointer", background: isHovered ? "#FAFAF7" : "transparent", transition: "background 120ms" }}>
            <AccountAvatar name={a.name} color={cat.color} />
            <AccountCategoryPill label={cat.label} color={cat.color} pillBg={cat.pillBg} pillColor={cat.pillColor} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <a href="#" onClick={e => e.preventDefault()} style={{ color: C.ink }}>{a.name}</a>
              </div>
              <div style={{ fontSize: 12.5, color: C.muted }}>added {a.daysAgo} days ago by {a.user}</div>
            </div>
            <div style={{ flexShrink: 0, display: "flex", gap: 18 }}>
              {([{ val: a.contacts, label: "Contacts" }, { val: a.opps, label: "Opps" }] as const).map(s => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{s.val}</span>
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: C.muted2, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>
            <HoverAction hovered={isHovered} onDelete={() => onDelete(a.id)} task={a} />
          </div>
        );
      })}
    </div>
  );
}
