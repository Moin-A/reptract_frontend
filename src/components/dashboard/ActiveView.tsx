"use client";

import { useDashboard } from "./DashboardContext";
import { PageHeader } from "./PageHeader";
import Dashboard from "./index";
import CampaignDashboard from "./CampaignDashboard";

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
      {activeTab === "Dashboard" && <Dashboard />}
      {activeTab === "Campaigns" && <CampaignDashboard />}
    </main>
  );
}
