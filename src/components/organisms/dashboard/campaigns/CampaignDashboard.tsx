"use client";

import { CampaignComposer } from "@/components/molecules/CampaignComposer";
import { CampaignPostList } from "@/components/molecules/CampaignPostList";

/** Campaign view: compose a post once, then publish it to every connected account. */
export default function CampaignDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <CampaignComposer />
      <CampaignPostList />
    </div>
  );
}
