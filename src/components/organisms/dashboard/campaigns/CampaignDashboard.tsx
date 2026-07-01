"use client";

import { useState } from "react";
import type { Post } from "@/lib/campaigns";
import { CampaignComposer } from "@/components/molecules/CampaignComposer";
import { CampaignPostList } from "@/components/molecules/CampaignPostList";

/** Campaign view: compose a post once, then publish it to every connected account. */
export default function CampaignDashboard() {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CampaignComposer
        key={editingPost?.id ?? "new"}
        editingPost={editingPost}
        onSaved={() => { setEditingPost(null); setRefreshKey(k => k + 1); }}
      />
      <CampaignPostList refreshKey={refreshKey} onEdit={setEditingPost} />
    </div>
  );
}
