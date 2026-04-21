"use client";

import {
  LayoutDashboard, CheckSquare, Megaphone, Users,
  FileText, UserCircle, Activity, UserCheck, Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { SearchInput } from "@/components/ui/search_input";
import { C } from "./tokens";

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

type TopNavProps = {
  activeTab: string;
  onTabChange: (id: string) => void;
  userName?: string;
};

export function TopNav({ activeTab, onTabChange, userName = "Admin" }: TopNavProps) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.ink, color: "white",
      borderBottom: `1px solid ${C.line2}`,
    }}>
      {/* ── Row 1: logo + user meta ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 48, borderBottom: `1px solid ${C.line2}`,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "white" }}>
            RepTrack
          </span>
        </div>

        {/* User meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12.5, color: "#8C8C92" }}>
            Welcome, <b style={{ color: "white" }}>{userName}!</b>
          </span>
          <NavDivider />
          <SearchInput />
          <NavDivider />
          <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>Profile</span>
          <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>{userName}</span>
          <span style={{ fontSize: 12.5, color: C.accent, cursor: "pointer" }}>Logout</span>
        </div>
      </div>

      {/* ── Row 2: nav tabs ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 20px" }}>
        {NAV_TABS.map(({ id, Icon }) => (
          <NavTab
            key={id}
            id={id}
            Icon={Icon}
            isActive={activeTab === id}
            onClick={() => onTabChange(id)}
          />
        ))}
      </nav>
    </div>
  );
}

function LogoMark() {
  return (
    <div style={{ width: 30, height: 30, background: C.accent, borderRadius: 7, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <Dumbbell size={16} color="white" />
    </div>
  );
}

function NavTab({ id, Icon, isActive, onClick }: { id: string; Icon: LucideIcon; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 14px", borderRadius: 8,
        fontSize: 13, fontWeight: 500, cursor: "pointer",
        background: isActive ? C.navActiveBg : "transparent",
        color: isActive ? "white" : "#A7A7AC",
        border: "none", whiteSpace: "nowrap",
        transition: "background 140ms, color 140ms",
      }}
    >
      <Icon size={14} />
      {id}
    </button>
  );
}

function NavDivider() {
  return <div style={{ width: 1, height: 14, background: C.line2, flexShrink: 0 }} />;
}
