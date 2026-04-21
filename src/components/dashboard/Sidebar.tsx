"use client";

import { List, Plus, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { C } from "./tokens";

type RecentItemDef = { type: string; name: string };

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  recentItems?: RecentItemDef[];
};

const GLOBAL_LISTS = ["All contacts", "All leads", "All accounts"];

export function Sidebar({ isOpen = false, onClose, recentItems = DEFAULT_RECENT }: SidebarProps) {
  const isMobile = useIsMobile();

  const desktopStyle: React.CSSProperties = {
    background: C.sidebarBg,
    borderRight: `1px solid ${C.line}`,
    padding: "20px 0",
    position: "sticky",
    top: 102,
    height: "calc(100vh - 102px)",
    overflowY: "auto",
  };

  const mobileStyle: React.CSSProperties = {
    background: C.sidebarBg,
    borderRight: `1px solid ${C.line}`,
    padding: "20px 0",
    position: "fixed",
    top: 0,
    left: 0,
    width: 260,
    height: "100vh",
    overflowY: "auto",
    zIndex: 300,
    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 299,
            background: "rgba(0,0,0,0.45)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 240ms",
          }}
        />
      )}

      <aside style={isMobile ? mobileStyle : desktopStyle}>
        {/* Close button (mobile only) */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 12px" }}>
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, display: "grid", placeItems: "center" }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        <SidebarSection heading="Global lists" divider>
          {GLOBAL_LISTS.map(label => (
            <SidebarNavItem key={label} label={label} />
          ))}
          <SidebarAddLink label="Add global list" />
        </SidebarSection>

        <SidebarSection heading="My lists" divider>
          <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>No saved lists</p>
          <SidebarAddLink label="Save a new list" />
        </SidebarSection>

        <SidebarSection heading="Recent items">
          {recentItems.map(item => (
            <RecentItem key={item.type} type={item.type} name={item.name} />
          ))}
        </SidebarSection>
      </aside>
    </>
  );
}

// ── sub-components ────────────────────────────────────────────────

function SidebarSection({ heading, divider, children }: { heading: string; divider?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ padding: "0 16px 20px", borderBottom: divider ? `1px solid ${C.line}` : "none", marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted2, marginBottom: 10 }}>
        {heading}
      </div>
      {children}
    </div>
  );
}

function SidebarNavItem({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, fontSize: 13, color: C.muted, cursor: "pointer", marginBottom: 2 }}>
      <List size={14} />
      {label}
    </div>
  );
}

function SidebarAddLink({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 12, color: C.accent, fontWeight: 500, cursor: "pointer" }}>
      <Plus size={13} />
      {label}
    </div>
  );
}

function RecentItem({ type, name }: RecentItemDef) {
  return (
    <div style={{ padding: "8px 10px", borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: C.muted2 }}>{type}</div>
      <div style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>{name}</div>
    </div>
  );
}

const DEFAULT_RECENT: RecentItemDef[] = [
  { type: "Contact",     name: "Marco Kent" },
  { type: "Account",     name: "Iron Union" },
  { type: "Opportunity", name: "Pro tier upgrade" },
];
