"use client";

import { C }                  from "@/components/organisms/dashboard/tokens";
import { StatsGrid, type StatDef } from "@/components/molecules/StatsGrid";
import { DashboardSection }    from "@/components/molecules/DashboardSection";
import { OpportunityItem }     from "@/components/organisms/dashboard/opportunities/OpportunityItem";
import { AccountItem }         from "@/components/organisms/dashboard/accounts/AccountItem";
import { GhostButton }         from "@/components/molecules/PageHeader";
import { DashboardTasks }      from "@/components/organisms/dashboard/DashboardTasks";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

const ActivityPanel = dynamic(() => import("@/components/organisms/dashboard/activities/ActivityPanel"));

const STATS: StatDef[] = [];

const OPPORTUNITIES = [
  { initials: "PK", avatarColor: "#7C3AED", name: "Pro tier upgrade",    sub: "Priya Kumar · Atlas Athletic", status: "Negotiation",   statusVariant: "active"  as const, amount: "$4,800 / yr" },
  { initials: "MK", avatarColor: "#2F6FEB", name: "Multi-location plan", sub: "Marco Kent · Iron Union",      status: "Proposal sent", statusVariant: "new"     as const, amount: "$9,600 / yr" },
  { initials: "SR", avatarColor: "#1F9D55", name: "Starter plan",        sub: "Sam Rivera · Forge Fitness",   status: "Closed won",    statusVariant: "closed"  as const, amount: "$1,200 / yr" },
];

const ACCOUNTS = [
  { initials: "IU", avatarColor: "#0B0B0C", name: "Iron Union",     sub: "Denver, CO · 3 locations",   status: "Active", statusVariant: "active" as const },
  { initials: "AA", avatarColor: "#6B6B70", name: "Atlas Athletic", sub: "Austin, TX · 1 location",    status: "Active", statusVariant: "active" as const },
  { initials: "FF", avatarColor: "#E0A82E", name: "Forge Fitness",  sub: "Portland, OR · 2 locations", status: "Trial",  statusVariant: "new"    as const },
];

const Dashboard = () => (
  <>
    <StatsGrid stats={STATS} />

    <DashboardTasks />

    <DashboardSection
      title="My Opportunities"
      action={<GhostButton icon={<Plus size={14} />} label="Add opportunity" />}
    >
      {OPPORTUNITIES.map((opp, i) => (
        <OpportunityItem key={opp.name} {...opp} isLast={i === OPPORTUNITIES.length - 1} />
      ))}
    </DashboardSection>

    <DashboardSection
      title="My Accounts"
      action={<GhostButton icon={<Plus size={14} />} label="Add account" />}
    >
      {ACCOUNTS.map((acc, i) => (
        <AccountItem key={acc.name} {...acc} isLast={i === ACCOUNTS.length - 1} />
      ))}
    </DashboardSection>

    <ActivityPanel />

    <footer style={{ textAlign: "center", padding: 24, fontSize: 11.5, color: C.muted2, borderTop: `1px solid ${C.line}`, marginTop: 8 }}>
      Powered by <a href="#" style={{ color: C.accent, fontWeight: 500 }}>RepTrack</a> v1.0 · © 2026
    </footer>
  </>
);

export default Dashboard;
