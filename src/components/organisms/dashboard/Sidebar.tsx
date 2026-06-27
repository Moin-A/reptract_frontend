"use client";

import React from "react";
import { List, Plus, X } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { C } from "./tokens";
import { useDashboard } from "./DashboardContext";
import { STAGES } from "./opportunities/stages";
import { CATEGORIES } from "./accounts/categories";
import { LEAD_STATUSES } from "./leads/statuses";
import CampaignSideBarMain from "@/components/organisms/dashboard/campaigns/CapaignSideBar"

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

        {activeTab === "Tasks" && (
          <SidebarSection heading="Tasks" divider>
            <TaskStatusSection />
          </SidebarSection>
        )}

        {activeTab === "Opportunities" && (
          <SidebarSection heading="Opportunity Stages" divider>
            <OpportunityStagesSection />
          </SidebarSection>
        )}

        {activeTab === "Accounts" && (
          <SidebarSection heading="Account Categories" divider>
            <AccountCategoriesSection />
          </SidebarSection>
        )}

        {activeTab === "Leads" && (
          <SidebarSection heading="Lead Status" divider>
            <LeadStatusSection />
          </SidebarSection>
        )}

        {activeTab === "Campaigns" && (
          <SidebarSection heading="Campaigns" divider>
            <CampaignSideBarMain />
          </SidebarSection>
        )}

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


function TaskStatusSection() {
    const { tasks } = useDashboard();
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
        {Object.entries(tasks)?.map(([label, taskList], i) => (
          <div
            key={`task_${i}`}
            style={{
              display: "grid",
              gridTemplateColumns: "20px 1fr auto",
              alignItems: "center",
              gap: 6,
              padding: "5px 4px",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              readOnly
              style={{ width: 13, height: 13, accentColor: C.accent, cursor: "pointer", margin: 0 }}
            />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>
              {label}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: label === "Overdue" ? C.err : C.ink,
            }}>
              {taskList.length}
            </span>
          </div>
        ))}

        {/* Hardcoded total row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "20px 1fr auto",
            alignItems: "center",
            gap: 6,
            padding: "5px 4px",
            borderRadius: 5,
            borderTop: `1px solid ${C.line}`,
            marginTop: 4,
            cursor: "pointer",
          }}
        >
          <span />
          <span style={{ fontSize: 12, color: C.ink, fontWeight: 600 }}>
            Total Pending Tasks
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>
            {Object.values(tasks).reduce((sum, list) => sum + list.length, 0)}
          </span>
        </div>
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

function AccountCategoriesSection() {
  const { acctCatFilter, setAcctCatFilter, acctCountByCategory } = useDashboard();

  function toggle(key: string) {
    setAcctCatFilter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  const total = Object.values(acctCountByCategory).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      {CATEGORIES.map(c => {
        const active = acctCatFilter.includes(c.key);
        const count  = acctCountByCategory[c.key] ?? 0;
        return (
          <div key={c.key} onClick={() => toggle(c.key)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 2px", fontSize: 13, cursor: "pointer", borderRadius: 6, transition: "background 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.line; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${active ? C.accent : C.ink2}`, background: active ? C.accent : "transparent", display: "grid", placeItems: "center", flexShrink: 0, transition: "background 120ms, border-color 120ms" }}>
                {active && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                )}
              </div>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: c.color, flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.label}</span>
            </div>
            <span style={{ fontSize: 12, color: C.muted2, background: "white", border: `1px solid ${C.line}`, borderRadius: 100, padding: "1px 8px", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{count}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: `1px solid ${C.line}`, marginTop: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Accounts</span>
        <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{total}</span>
      </div>
    </div>
  );
}

function OpportunityStagesSection() {
  const { oppStageFilter, setOppStageFilter } = useDashboard();

  function toggle(key: string) {
    setOppStageFilter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  const total = STAGES.reduce((sum, s) => sum + s.count, 0);
  const pipeline = STAGES.reduce((sum, s) => sum + s.count * 5000, 0);

  return (
    <div>
      {STAGES.map(s => {
        const active = oppStageFilter.includes(s.key);
        return (
          <div key={s.key} onClick={() => toggle(s.key)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 2px", fontSize: 13, cursor: "pointer", borderRadius: 6, transition: "background 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.line; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${active ? C.accent : C.ink2}`, background: active ? C.accent : "transparent", display: "grid", placeItems: "center", flexShrink: 0, transition: "background 120ms, border-color 120ms" }}>
                {active && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                )}
              </div>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: s.color, flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
            </div>
            <span style={{ fontSize: 12, color: C.muted2, background: "white", border: `1px solid ${C.line}`, borderRadius: 100, padding: "1px 8px", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{s.count}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: `1px solid ${C.line}`, marginTop: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</span>
        <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{total}</span>
      </div>
      <div style={{ fontSize: 11.5, color: C.ok, marginTop: 2, textAlign: "right" }}>
        Pipeline value: ${(pipeline / 1000).toFixed(0)}K
      </div>
    </div>
  );
}

function LeadStatusSection() {
  const { leadStatusFilter, setLeadStatusFilter, leadCountByStatus } = useDashboard();

  function toggle(key: string) {
    setLeadStatusFilter(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  const total = Object.values(leadCountByStatus).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      {LEAD_STATUSES.map(s => {
        const active = leadStatusFilter.includes(s.key);
        const count  = leadCountByStatus[s.key] ?? 0;
        return (
          <div key={s.key} onClick={() => toggle(s.key)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 2px", fontSize: 13, cursor: "pointer", borderRadius: 6, transition: "background 120ms" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.line; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${active ? C.accent : C.ink2}`, background: active ? C.accent : "transparent", display: "grid", placeItems: "center", flexShrink: 0, transition: "background 120ms, border-color 120ms" }}>
                {active && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                )}
              </div>
              <span style={{ width: 8, height: 8, borderRadius: 8, background: s.color, flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
            </div>
            <span style={{ fontSize: 12, color: C.muted2, background: "white", border: `1px solid ${C.line}`, borderRadius: 100, padding: "1px 8px", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{count}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: `1px solid ${C.line}`, marginTop: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Leads</span>
        <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{total}</span>
      </div>
    </div>
  );
}
