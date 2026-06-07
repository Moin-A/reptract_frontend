"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { ActivityItem } from "./ActivityItem";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type DayGroup, type RawActivity } from "@/lib/types";
import { toGroups, to_local_date_string } from "@/lib/activities";
import { ActivityFilterBar, SHOW_OPTIONS, WHEN_OPTIONS } from "@/components/molecules/ActivityFilterBar";
import { PanelHeader } from "@/components/molecules/PanelHeader";
import { GhostButton } from "@/components/atoms/GhostButton";
import { ExportItem } from "@/components/atoms/ExportItem";
import { SectionLabel } from "@/components/atoms/SectionLabel";
import { Pagination } from "@/components/ui/Pagination";


const EXPORT_FMTS = ["XLS", "CSV", "RSS", "ATOM", "PERM"];
type ActivityPagination = { page: number; count: number; items: number };


const ActivityPanel = memo(function ActivityPanel() {
  const { users, tasks } = useDashboard();
  const [groups,     setGroups]     = useState<DayGroup[]>([]);
  const [pagination, setPagination] = useState<ActivityPagination | null>(null);
  const [page,       setPage]       = useState(1);
  const [show, setShow] = useState(0);
  const [by,   setBy]   = useState("")
  const [when, setWhen] = useState(3);

  const fetchActivities = useCallback((p: number, s: number, b: string, w: number) => {
    const params = new URLSearchParams();
    params.set("activity[show]", SHOW_OPTIONS[s]);
    params.set("activity[when]", WHEN_OPTIONS[w]);
    if (b) params.set("activity[by]", b);
    params.set("page", String(p));

    fetch(`/api/activities?${params}`, { credentials: "include" })
      .then(res => res.json())
      .then((data: { groups: RawActivity[]; pagination?: ActivityPagination }) => {
        if (Array.isArray(data.groups)) setGroups(toGroups(data.groups));
        if (data.pagination) setPagination(data.pagination);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    fetchActivities(1, show, by, when);
  }, [show, by, when, tasks, fetchActivities]);

  function handlePageChange(p: number) {
    setPage(p);
    fetchActivities(p, show, by, when);
  }

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
        onReset={() => { setShow(0); setBy(""); setWhen(3); }}
      />

      {groups.map((group, gi) => (
        <div key={gi}>
          <SectionLabel label={group.label} />
          <div style={{ padding: "0 20px 2px", position: "relative" }}>
            <div style={{ position: "absolute", left: 34, top: 6, bottom: 10, width: 1, background: C.line, zIndex: 0 }} />
            {group.entries.map((entry, ei) => (
              <ActivityItem key={ei} {...entry} />
            ))}
          </div>
        </div>
      ))}

      {pagination && (
        <div style={{ padding: "4px 20px 12px" }}>
          <Pagination
            currentPage={page}
            totalItems={pagination.count}
            perPage={pagination.items}
            onChange={handlePageChange}
          />
        </div>
      )}

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
