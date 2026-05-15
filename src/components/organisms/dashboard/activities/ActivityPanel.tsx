"use client";
import { useState, useEffect, memo } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { ActivityItem, type ActivityEntry } from "./ActivityItem";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type DayGroup, type RawActivity } from "@/lib/types";
import { ActivityFilterBar, SHOW_OPTIONS, WHEN_OPTIONS } from "@/components/molecules/ActivityFilterBar";
import { PanelHeader } from "@/components/molecules/PanelHeader";
import { GhostButton } from "@/components/atoms/GhostButton";
import { ExportItem } from "@/components/atoms/ExportItem";
import { SectionLabel } from "@/components/atoms/SectionLabel";


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
    if (!a.entity) continue;
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

const EXPORT_FMTS = ["XLS", "CSV", "RSS", "ATOM", "PERM"];


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

      <PanelHeader
        title="Recent Activity"
        actions={
          <button style={{ fontSize: 12, color: C.muted, fontWeight: 500, cursor: "pointer", padding: "5px 10px", borderRadius: 8, border: `1px solid ${C.line}`, background: "white" }}>
            Options ▾
          </button>
        }
      />

      <ActivityFilterBar
        show={show} by={by} when={when} users={users}
        onShowChange={setShow} onByChange={setBy} onWhenChange={setWhen}
        onReset={() => { setShow(0); setBy(""); setWhen(0); }}
      />

      {groups.map((group, gi) => (
        <div key={gi}>
          <SectionLabel label={group.label} />
          <div style={{ padding: "0 20px 4px", position: "relative" }}>
            <div style={{ position: "absolute", left: 35, top: 8, bottom: 14, width: 1, background: C.line, zIndex: 0 }} />
            {group.entries.map((entry, ei) => (
              <ActivityItem key={ei} {...entry} />
            ))}
          </div>
        </div>
      ))}

      <div style={{ borderTop: `1px solid ${C.line}`, background: "#FAFAF7", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <GhostButton fontSize={12.5}>View all activity →</GhostButton>
        <div style={{ display: "flex", alignItems: "center", fontSize: 12 }}>
          {EXPORT_FMTS.map((fmt, i) => (
            <ExportItem key={fmt} label={fmt} first={i === 0} last={i === EXPORT_FMTS.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default ActivityPanel;
