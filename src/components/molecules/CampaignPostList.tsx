"use client";

import { useState, type ReactNode } from "react";
import { POSTS, CARD_STYLE, type Post, type PostKind } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/molecules/StatusPill";

const TABS = ["All", "Published", "Pending", "Failed", "Drafts"] as const;
type Tab = typeof TABS[number];

const KIND_STYLES: Record<PostKind, { label: string; bg: string; color: string }> = {
  post:  { label: "POST", bg: "#EEF2FF", color: "#3730A3" },
  ad:    { label: "AD",   bg: "#FFEDD5", color: "#9A3412" },
  draft: { label: "POST", bg: "#F1F0EC", color: C.muted },
};

function KindBadge({ kind }: { kind: PostKind }) {
  const m = KIND_STYLES[kind];
  return (
    <Badge style={{ background: m.bg, color: m.color, border: "none", letterSpacing: "0.05em", flex: "none", alignSelf: "flex-start" }}>
      {m.label}
    </Badge>
  );
}

function Action({ children, color, solid }: { children: ReactNode; color?: string; solid?: boolean }) {
  return (
    <button className="cc-btn" style={{
      padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      border: solid ? "none" : `1px solid ${color ?? C.line}`,
      background: solid ? C.accent : C.surface,
      color: solid ? "#fff" : (color ?? C.ink2),
    }}>{children}</button>
  );
}

export function CampaignPostList() {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = POSTS.filter(p => {
    if (tab === "All") return true;
    if (tab === "Drafts") return p.draft;
    return p.pubs.some(x => x.status === tab.toLowerCase());
  });

  return (
    <section style={{ ...CARD_STYLE, overflow: "hidden" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: C.accent }} /> Posts
        </div>
        <div style={{ display: "inline-flex", gap: 2, padding: 3, background: C.bg, borderRadius: 10, border: `1px solid ${C.line}` }}>
          {TABS.map(t => (
            <button key={t} className="cc-btn" onClick={() => setTab(t)} style={{
              padding: "5px 12px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
              background: tab === t ? C.surface : "transparent", color: tab === t ? C.ink : C.muted,
              boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,.08)" : "none",
            }}>{t}</button>
          ))}
        </div>
      </header>

      <div>
        {filtered.map((p: Post, i) => (
          <article key={i} className="cc-row" style={{ display: "flex", gap: 14, padding: "18px 20px", borderTop: i ? `1px solid ${C.line}` : "none" }}>
            <KindBadge kind={p.kind} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: C.ink2 }}>{p.body}</p>
                <span style={{ fontSize: 12, color: C.muted2, whiteSpace: "nowrap" }}>{p.time}</span>
              </div>
              {p.media > 0 && (
                <div style={{ display: "flex", gap: 8, margin: "10px 0 0" }}>
                  {Array.from({ length: p.media }).map((_, m) => (
                    <div key={m} style={{ width: 56, height: 56, borderRadius: 10, background: C.bg, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted2 }}>⬚</div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0 0" }}>
                {p.draft
                  ? <span style={{ fontSize: 12.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: C.muted2 }} />Draft · not published</span>
                  : p.pubs.map((x, j) => <StatusPill key={j} platform={x.platform} status={x.status} />)}
              </div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0 0" }}>
                {p.pubs.some(x => x.status === "failed") && <Action color={C.err}>Retry failed</Action>}
                {p.draft && <Action solid>Select accounts &amp; publish</Action>}
                {p.draft && <Action>Edit</Action>}
                {!p.draft && <Action>View</Action>}
                <Action>Delete</Action>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
