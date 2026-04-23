"use client";

import {
  LayoutDashboard, CheckSquare, Megaphone, Users,
  FileText, UserCircle, Activity, UserCheck, Dumbbell, Menu,
  type LucideIcon,
} from "lucide-react";
import { SearchInput } from "@/components/ui/search_input";
import { useIsMobile } from "@/hooks/useIsMobile";
import { C } from "./tokens";
import { clientFetch } from "../../../service/api";

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
  onMenuToggle?: () => void;
  userName?: string;
};

export function TopNav({ activeTab, onTabChange, onMenuToggle, userName = "Admin" }: TopNavProps) {
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await clientFetch("/users/sign_out", { method: "DELETE" });
    window.location.href = "/";
  };

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
        {/* Left: hamburger (mobile) + logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isMobile && (
            <button
              onClick={onMenuToggle}
              aria-label="Open navigation menu"
              style={{ background: "none", border: "none", color: "#A7A7AC", cursor: "pointer", display: "grid", placeItems: "center", padding: 4 }}
            >
              <Menu size={20} />
            </button>
          )}
          <LogoMark />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "white" }}>
            RepTrack
          </span>
        </div>

        {/* Right: user meta */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14 }}>
          {!isMobile && (
            <>
              <span style={{ fontSize: 12.5, color: "#8C8C92" }}>
                Welcome, <b style={{ color: "white" }}>{userName}!</b>
              </span>
              <NavDivider />
              <SearchInput />
              <NavDivider />
              <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>Profile</span>
              <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>{userName}</span>
            </>
          )}
          <span style={{ fontSize: 12.5, color: C.accent, cursor: "pointer" }} onClick={handleLogout}>Logout</span>
        </div>
      </div>

      {/* ── Row 2: nav tabs (horizontally scrollable on mobile) ── */}
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
        border: "none", whiteSpace: "nowrap", flexShrink: 0,
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
