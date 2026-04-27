"use client";

import {
  LayoutDashboard, CheckSquare, Megaphone, Users,
  FileText, UserCircle, Activity, UserCheck,
  type LucideIcon,
} from "lucide-react";
import { NavTab } from "../atoms/NavTab";
import { useDashboard } from "../DashboardContext";

const NAV_TABS: { id: string; Icon: LucideIcon }[] = [
  { id: "Dashboard",     Icon: LayoutDashboard },
  { id: "Tasks",         Icon: CheckSquare },
  { id: "Campaigns",     Icon: Megaphone },
  { id: "Leads",         Icon: Users },
  { id: "Accounts",      Icon: FileText },
  { id: "Contacts",      Icon: UserCircle },
  { id: "Opportunities", Icon: Activity },
  { id: "Team",          Icon: UserCheck },
];

export function NavTabBar() {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <nav style={{
      display: "flex", alignItems: "center", gap: 2,
      padding: "6px 20px",
      overflowX: "auto",
      scrollbarWidth: "none",
    }}>
      {NAV_TABS.map(({ id, Icon }) => (
        <NavTab
          key={id}
          id={id}
          Icon={Icon}
          isActive={activeTab === id}
          onClick={() => setActiveTab(id)}
        />
      ))}
    </nav>
  );
}
