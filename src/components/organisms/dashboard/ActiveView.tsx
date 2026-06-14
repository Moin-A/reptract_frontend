"use client";

import { useMemo } from "react";
import { useDashboard } from "./DashboardContext";
import { PageHeader } from "@/components/molecules/PageHeader";
import Dashboard from "./index";
import CampaignDashboard from "./CampaignDashboard";
import { OpportunitiesView } from "./opportunities";
import { AccountsView } from "./accounts";
import { LeadsView } from "./leads";

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
  const { activeTab, incrementAcctCreate, incrementAcctExport, incrementAcctImport, incrementLeadCreate } = useDashboard();

  const subtitle = useMemo(() => {
    const d = new Date();
    const dateStr = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const hour = d.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${dateStr} · ${greeting}, Admin.`;
  }, []);

  return (
    <main style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
      <PageHeader
        title={TAB_TITLES[activeTab] ?? activeTab}
        subtitle={subtitle}
        onNewRecord={activeTab === "Accounts" ? incrementAcctCreate : activeTab === "Leads" ? incrementLeadCreate : undefined}
        onExport={activeTab === "Accounts" ? incrementAcctExport : undefined}
        onImport={activeTab === "Accounts" ? incrementAcctImport : undefined}
      />
      {activeTab === "Dashboard"     && <Dashboard />}
      {activeTab === "Campaigns"     && <CampaignDashboard />}
      {activeTab === "Tasks"         && <Dashboard />}
      {activeTab === "Opportunities" && <OpportunitiesView />}
      {activeTab === "Accounts"      && <AccountsView />}
      {activeTab === "Leads"         && <LeadsView />}
    </main>
  );
}
