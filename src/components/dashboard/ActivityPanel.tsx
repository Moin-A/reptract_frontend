"use client";
import { useState, useEffect, memo } from "react";
import { C } from "./tokens";
import { ActivityItem, type ActivityEntry } from "./ActivityItem";
import { useDashboard } from "./DashboardContext";

export type DayGroup = {
  label: string;
  entries: ActivityEntry[];
};

type Whodunnit = {
  id: number;
  name: string;
  email: string;
};

type Entity = {
  id: number;
  name?: string;
  updated_at: string;
  [key: string]: unknown;
};

type RawActivity = {
  id: number;
  whodunnit: Whodunnit;
  event: string;
  item_id: number;
  entity: Entity;
  entity_type: string;
};

const EVENT_TONE: Record<string, ActivityEntry["tone"]> = {
  create: "create",
  update: "move",
  destroy: "delete",
};

const EVENT_ACTION: Record<string, string> = {
  create: "created",
  update: "updated",
  destroy: "deleted",
};

function toGroups(activities: RawActivity[]): DayGroup[] {
  const buckets = new Map<string, DayGroup>();

  for (const a of activities) {
    const date = new Date(a.entity.updated_at);
    const key  = date.toDateString();

    if (!buckets.has(key)) {
      buckets.set(key, {
        label: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
        entries: [],
      });
    }

    buckets.get(key)!.entries.push({
      tone:    EVENT_TONE[a.event]   ?? "default",
      actor:   a.whodunnit?.name     ?? "System",
      action:  EVENT_ACTION[a.event] ?? a.event,
      object:  a.entity?.name        ?? `${a.entity_type} #${a.item_id}`,
      metaTag: a.entity_type,
      time:    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    });
  }

  return Array.from(buckets.values());
}


const SHOW_OPTIONS = ["all activities", "my activities", "team activities"];
const WHEN_OPTIONS = ["past 2 days", "today", "past week", "past 30 days"];
const EXPORT_FMTS  = ["XLS", "CSV", "RSS", "ATOM", "PERM"];

const selectStyle: React.CSSProperties = {
  padding: "5px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
  border: `1px solid ${C.line}`, background: "white", color: C.ink,
  cursor: "pointer", outline: "none", appearance: "none",
  paddingRight: 28, backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A7A7AC' stroke-width='2.5' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
};

const ActivityPanel = memo(function ActivityPanel() {
  const { users, tasks } = useDashboard();
  const [groups, setGroups] = useState<DayGroup[]>([]);
  const [show, setShow] = useState(0);
  const [by,   setBy]   = useState("")
  const [when, setWhen] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("activity[show]", SHOW_OPTIONS[show]);
    params.set("activity[when]", WHEN_OPTIONS[when]);
    if (by) params.set("activity[by]", by);

    fetch(`/api/activities?${params}`, { credentials: "include" })
      .then(res => res.json())
      .then((data: { groups: RawActivity[] }) => {
        if (Array.isArray(data.groups)) setGroups(toGroups(data.groups));
      })
      .catch(() => {});
  }, [show, by, when, tasks]);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>

      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block", flexShrink: 0 }} />
          Recent Activity
        </div>
        <button style={{ fontSize: 12, color: C.muted, fontWeight: 500, cursor: "pointer", padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.line}`, background: "white" }}>
          Options ▾
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", borderBottom: `1px solid ${C.line}` }}>
        <select value={show} onChange={e => setShow(Number(e.target.value))} style={selectStyle}>
          {SHOW_OPTIONS.map((o, i) => <option key={o} value={i}>{o}</option>)}
        </select>
        <select value={by} onChange={e => setBy(e.target.value)} style={selectStyle}>
          <option value="">anyone</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={when} onChange={e => setWhen(Number(e.target.value))} style={selectStyle}>
          {WHEN_OPTIONS.map((o, i) => <option key={o} value={i}>{o}</option>)}
        </select>
        <span style={{ flex: 1 }} />
        <button onClick={() => { setShow(0); setBy(""); setWhen(0); }}
          style={{ fontSize: 12, color: C.accent, cursor: "pointer", padding: "4px 8px", borderRadius: 6, background: "transparent", border: "none" }}>
          Reset
        </button>
      </div>

      {/* Day groups */}
      {groups.map((group, gi) => (
        <div key={gi}>
          {/* Day label + rule */}
          <div style={{ padding: "14px 20px 6px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, display: "flex", alignItems: "center", gap: 12 }}>
            {group.label}
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>

          {/* Activity list with vertical timeline connector */}
          <div style={{ padding: "0 20px 4px", position: "relative" }}>
            <div style={{ position: "absolute", left: 35, top: 8, bottom: 14, width: 1, background: C.line, zIndex: 0 }} />
            {group.entries.map((entry, ei) => (
              <ActivityItem key={ei} {...entry} />
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${C.line}`, background: "#FAFAF7", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button style={{ fontSize: 12.5, color: C.accent, fontWeight: 500, cursor: "pointer", background: "none", border: "none" }}>
          View all activity →
        </button>
        <div style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
          {EXPORT_FMTS.map((fmt, i) => (
            <span key={fmt} style={{
              color: C.muted, fontWeight: 500, cursor: "pointer",
              padding: i === 0 ? "0 8px 0 0" : "0 8px",
              borderRight: i < EXPORT_FMTS.length - 1 ? `1px solid ${C.line}` : "none",
            }}>
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ActivityPanel;
