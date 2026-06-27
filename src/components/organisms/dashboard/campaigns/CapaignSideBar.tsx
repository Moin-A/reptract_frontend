"use client";

import { ACCOUNTS, MONTH } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";
import { CampaignSectionLabel } from "@/components/atoms/CampaignSectionLabel";

/** Campaign rail: connected accounts, this-month usage and drafts. */
export default function CampaignSideBar() {
  return (
    <div>
      {/* connected accounts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ACCOUNTS.map(a => (
          <div key={a.handle} className="cc-row" style={{
            display: "flex", alignItems: "center", gap: 10, padding: 10,
            background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10,
          }}>
            <PlatformBadge platform={a.platform} size={32} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.handle}</div>
              <div style={{ fontSize: 11.5, color: a.healthy ? C.muted : C.err }}>{a.sub}</div>
            </div>
            <span style={{
              width: 8, height: 8, borderRadius: 999, flex: "none",
              background: a.healthy ? C.ok : C.err,
              boxShadow: `0 0 0 3px ${a.healthy ? "rgba(31,157,85,.18)" : "rgba(216,74,63,.18)"}`,
            }} />
          </div>
        ))}
        <button className="cc-connect" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: 10, borderRadius: 10, border: `1px dashed ${C.line2}`, background: "transparent",
          color: C.muted, fontSize: 13, fontWeight: 500, cursor: "pointer",
        }}>+ Connect account</button>
      </div>

      <div style={{ height: 1, background: C.line, margin: "18px 0" }} />

      {/* this month */}
      <CampaignSectionLabel>This month</CampaignSectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {MONTH.map(m => (
          <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", fontSize: 13 }}>
            <span style={{ color: C.muted }}>{m.label}</span>
            <span style={{ fontWeight: 700, color: m.danger ? C.err : C.ink, fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: C.line, margin: "18px 0" }} />

      {/* drafts */}
      <CampaignSectionLabel>Drafts</CampaignSectionLabel>
      <div style={{ fontSize: 13, color: C.muted2 }}>No drafts yet</div>
    </div>
  );
}
