"use client";

import { useState, useEffect } from "react";
import { POSTS, CARD_STYLE, type Post } from "@/lib/campaigns";
import { C } from "@/components/organisms/dashboard/tokens";
import { StatusPill } from "@/components/molecules/StatusPill";
import { KindBadge } from "@/components/atoms/KindBadge";
import { Action } from "@/components/atoms/Action";

const TABS = ["All", "Published", "Pending", "Failed", "Drafts"] as const;
type Tab = typeof TABS[number];

type Props = { onEdit?: (post: Post) => void; refreshKey?: number };

export function CampaignPostList({ onEdit, refreshKey }: Props) {
  const [tab, setTab] = useState<Tab>("All");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`/api/campaign/posts`)
      .then(res => res.json())
      .then(data => setFilteredPosts(data));
  }, [tab, refreshKey]);

  async function handleDelete(id?: number) {
    if (!id) return;
    const res = await fetch(`/api/campaign/posts/${id}`, { method: "DELETE" });
    if (res.ok) setFilteredPosts(prev => prev.filter(p => p.id !== id));
  }

  const filtered = filteredPosts.filter(p => {
    if (tab === "All") return true;
    if (tab === "Drafts") return p.status === "draft";
    if (tab === "Pending") return p.publications.some(x => x.status === "ready" || x.status === "wip");
    if (tab === "Published") return p.publications.some(x => x.status === "published");
    if (tab === "Failed") return p.publications.some(x => x.status === "failed");
    return false;
  });

console.log("Filtered posts:", filtered);
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
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: C.ink2 }}>{p.content ?? p.body}</p>
                {p.time && <span style={{ fontSize: 12, color: C.muted2, whiteSpace: "nowrap" }}>{p.time}</span>}
              </div>
              {p.media?.length > 0 && (
                <div style={{ display: "flex", gap: 8, margin: "10px 0 0" }}>
                  {p.media.map(m => (
                    // eslint-disable-next-line @next/next/no-img-element -- Active Storage URL, served cross-origin by Rails
                    <img key={m.id} src={m.url} alt={m.filename} title={m.filename}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.line}`, background: C.bg }} />
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0 0" }}>
                {p.status === "draft"
                  ? <span style={{ fontSize: 12.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: C.muted2 }} />Draft · not published</span>
                  : p.publications.map((x) => <StatusPill key={x.id} platform={x.platform} status={x.status} />)}
              </div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0 0" }}>
                {p.publications.some(x => x.status === "failed") && <Action color={C.err}>Retry failed</Action>}
                {p.status === "draft" && <Action solid>Select accounts &amp; publish</Action>}
                {p.status === "draft" && <Action onClick={() => onEdit?.(p)}>Edit</Action>}
                {p.status !== "draft" && <Action onClick={() => onEdit?.(p)}>View</Action>}
                <Action onClick={() => handleDelete(p.id)}>Delete</Action>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
