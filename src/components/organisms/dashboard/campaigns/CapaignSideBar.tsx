"use client";

import { useEffect, useState } from "react";
import type { PlatformKey } from "@/lib/types";
import { MONTH } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { PlatformBadge } from "@/components/atoms/PlatformBadge";
import { CampaignSectionLabel } from "@/components/atoms/CampaignSectionLabel";
import { ConnectAccountMenu, type ConnectedAccountPayload } from "@/components/molecules/ConnectAccountMenu";

type SocialAccount = {
  id: number;
  platform_tag: string;
  label: string;
  active: boolean;
  connected_at: string | null;
  followers?: number | null;
};

/** Campaign rail: connected accounts, this-month usage and drafts. */
export default function CampaignSideBar() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    fetch("/api/campaign/social_accounts")
      .then(res => (res.ok ? res.json() : []))
      .then((data: SocialAccount[]) => setAccounts(data))
      .catch(() => setAccounts([]));
  }, []);

  // A freshly connected account from the credentials form — insert or replace.
  function handleConnected(account: ConnectedAccountPayload) {
    setAccounts(prev => {
      const rest = prev.filter(a => a.id !== account.id);
      const followers = account.metadata?.["followers_count"] ?? account.metadata?.["fan_count"];
      return [...rest, {
        id: account.id, platform_tag: account.platform_tag, label: account.label,
        active: account.active, connected_at: account.connected_at,
        followers: typeof followers === "number" ? followers : null,
      }];
    });
  }

  // Validate the account's stored credentials against the platform and pull
  // live metadata (name, followers) — no login flow involved.
  async function refresh(id: number) {
    const res = await fetch(`/api/campaign/social_accounts/${id}/refresh`, { method: "POST" });
    const data = await res.json().catch(() => null);
    if (!data) return;
    setAccounts(prev => prev.map(a => a.id === id
      ? { ...a, label: data.label ?? a.label, active: data.active ?? false, followers: data.metadata?.followers_count ?? data.metadata?.fan_count ?? a.followers }
      : a));
  }

  return (
    <div>
      {/* connected accounts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {accounts.length === 0 && (
          <div style={{ fontSize: 12.5, color: C.muted2, padding: "2px 0 6px" }}>No accounts connected yet</div>
        )}
        {accounts.map(a => (
          <div key={a.id} className="cc-row" onClick={() => refresh(a.id)} title="Click to refresh from the platform" style={{
            display: "flex", alignItems: "center", gap: 10, padding: 10, cursor: "pointer",
            background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10,
          }}>
            <PlatformBadge platform={a.platform_tag as PlatformKey} size={32} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.label}</div>
              <div style={{ fontSize: 11.5, color: a.active ? C.muted : C.err, textTransform: "capitalize" }}>
                {a.platform_tag}{a.followers != null ? ` · ${a.followers} followers` : ""}{a.active ? "" : " · reconnect needed"}
              </div>
            </div>
            <span style={{
              width: 8, height: 8, borderRadius: 999, flex: "none",
              background: a.active ? C.ok : C.err,
              boxShadow: `0 0 0 3px ${a.active ? "rgba(31,157,85,.18)" : "rgba(216,74,63,.18)"}`,
            }} />
          </div>
        ))}
        <ConnectAccountMenu onConnected={handleConnected} />
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
