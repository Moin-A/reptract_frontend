"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { type Account } from "@/lib/types";
import { CAT_MAP } from "./categories";
import { AccountAvatar } from "@/components/atoms/AccountAvatar";
import { AccountCategoryPill } from "@/components/atoms/AccountCategoryPill";

type Props = {
  accounts: Account[];
};

export function AccountGridView({ accounts }: Props) {
  if (accounts.length === 0) {
    return (
      <div style={{ padding: "32px 20px", fontSize: 13.5, color: C.muted, textAlign: "center" }}>
        No accounts match your filters.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14, padding: 20, background: "#FAFAF7" }}>
      {accounts.map(a => {
        const cat = CAT_MAP[a.cat];
        return (
          <div key={a.id}
            style={{ background: "white", border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10, cursor: "pointer", transition: "transform 120ms, border-color 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.borderColor = C.ink2; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = C.line; }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <AccountAvatar name={a.name} color={cat.color} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{a.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>added {a.daysAgo}d ago</div>
              </div>
            </div>
            <AccountCategoryPill label={cat.label} color={cat.color} pillBg={cat.pillBg} pillColor={cat.pillColor} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${C.line}`, fontSize: 11.5, color: C.muted }}>
              <span><b style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{a.contacts}</b> contacts</span>
              <span><b style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{a.opps}</b> opps</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
