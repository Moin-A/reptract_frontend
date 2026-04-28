"use client";

import React from "react";
import { List, Plus, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { C } from "./tokens";
import { useDashboard } from "./DashboardContext";

type RecentItemDef = { type: string; name: string };

const DEFAULT_RECENT: RecentItemDef[] = [
  { type: "Contact",     name: "Marco Kent" },
  { type: "Account",     name: "Iron Union" },
  { type: "Opportunity", name: "Pro tier upgrade" },
];

const GLOBAL_LISTS = ["All contacts", "All leads", "All accounts"];

export function Sidebar({ recentItems = DEFAULT_RECENT }: { recentItems?: RecentItemDef[] }) {
  const { sidebarOpen, setSidebarOpen, activeTab } = useDashboard();
  const isMobile = useIsMobile();
  const onClose  = () => setSidebarOpen(false);

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
    top: 0, left: 0,
    width: 260,
    height: "100vh",
    overflowY: "auto",
    zIndex: 300,
    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 299,
            background: "rgba(0,0,0,0.45)",
            opacity: sidebarOpen ? 1 : 0,
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "opacity 240ms",
          }}
        />
      )}

      <aside style={isMobile ? mobileStyle : desktopStyle}>
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

        { activeTab == "Tasks" &&
        <SidebarSection heading="Tasks" divider>
          <TaskStatusSection />
        </SidebarSection>
        }



        <SidebarSection heading="Global lists" divider>
          {GLOBAL_LISTS.map(label => <SidebarNavItem key={label} label={label} />)}
          <SidebarAddLink label="Add global list" />
        </SidebarSection>

        <SidebarSection heading="My lists" divider>
          <p style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>No saved lists</p>
          <SidebarAddLink label="Save a new list" />
        </SidebarSection>

        <SidebarSection heading="Recent items">
          {recentItems.map(item => <RecentItem key={item.type} type={item.type} name={item.name} />)}
        </SidebarSection>
      </aside>
    </>
  );
}

const TASK_STATUSES = ["Pending", "Assigned", "Completed"] as const;
type TaskStatus = typeof TASK_STATUSES[number];

const TASK_BUCKETS: { count: number; label: string }[] = [
  { count: 7,  label: "Overdue" },
  { count: 0,  label: "As Soon As Possible" },
  { count: 1,  label: "Today" },
  { count: 0,  label: "Tomorrow" },
  { count: 8,  label: "This Week" },
  { count: 8,  label: "Next Week" },
  { count: 3,  label: "Sometime Later" },
  { count: 27, label: "Total Pending Tasks" },
];

function TaskStatusSection() {
  const [active, setActive] = React.useState<TaskStatus>("Pending");

  return (
    <div>
      {/* Status column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, marginBottom: 12 }}>
        {TASK_STATUSES.map(status => (
          <button
            key={status}
            onClick={() => setActive(status)}
            style={{
              padding: "6px 4px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              textAlign: "center",
              background: active === status ? C.ink : "transparent",
              color: active === status ? "#fff" : C.muted,
              transition: "background 150ms, color 150ms",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bucket row grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {TASK_BUCKETS.map(({ count, label }, i) => {
          const isTotal = i === TASK_BUCKETS.length - 1;
          return (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                alignItems: "center",
                gap: 6,
                padding: "5px 4px",
                borderRadius: 5,
                borderTop: isTotal ? `1px solid ${C.line}` : "none",
                marginTop: isTotal ? 4 : 0,
                cursor: "pointer",
              }}
            >
              {isTotal ? (
                <span />
              ) : (
                <input
                  type="checkbox"
                  readOnly
                  style={{ width: 13, height: 13, accentColor: C.accent, cursor: "pointer", margin: 0 }}
                />
              )}
              <span style={{
                fontSize: 12,
                color: isTotal ? C.ink : C.muted,
                fontWeight: isTotal ? 600 : 400,
              }}>
                {label}
              </span>
              <span style={{
                fontSize: 12,
                fontWeight: isTotal ? 700 : 500,
                color: count > 0 ? (label === "Overdue" ? C.err : C.ink) : C.muted2,
              }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SidebarSection({ heading, divider, children }: { heading?: string; divider?: boolean; children: React.ReactNode }) {
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
