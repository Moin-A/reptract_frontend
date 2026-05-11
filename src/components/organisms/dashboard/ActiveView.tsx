"use client";

import { useDashboard } from "./DashboardContext";
import { PageHeader } from "@/components/molecules/PageHeader";
import Dashboard from "./index";
import CampaignDashboard from "./CampaignDashboard";
import { OpportunitiesView } from "./opportunities";
import { AccountsView } from "./accounts";

const TAB_TITLES: Record<string, string> = {
  Dashboard:     "Dashboards",
  Tasks:         "Tasks",
  Campaigns:     "Campaigns",
  Leads:         "Leads",
  Accounts:      "Accounts",
  Contacts:      "Contacts",
  Opportunities: "Opportunities",
  Team:          "Team",
};

export function ActiveView() {
  const { activeTab } = useDashboard();

  return (
    <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
      <PageHeader
        title={TAB_TITLES[activeTab] ?? activeTab}
        subtitle="Monday, 21 April 2026 · Good morning, Admin."
      />
      {activeTab === "Dashboard"     && <Dashboard />}
      {activeTab === "Campaigns"     && <CampaignDashboard />}
      {activeTab === "Tasks"         && <Dashboard />}
      {activeTab === "Opportunities" && <OpportunitiesView />}
      {activeTab === "Accounts"      && <AccountsView />}
    </main>
  );
}
