"use client";

import { useEffect, useState } from "react";
import { getCampaigns } from "@/lib";

type Campaign = Awaited<ReturnType<typeof getCampaigns>>[number];

export default function CampaignDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getCampaigns().then(data => {
      setCampaigns(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading campaigns…</p>;

  return (
    <section>
      {campaigns.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <ul>
          {campaigns.map((campaign, i) => (
            <li key={i}>{JSON.stringify(campaign)}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
