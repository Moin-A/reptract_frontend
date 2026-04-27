"use client";
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { C }                  from "@/components/dashboard/tokens";
import { StatsGrid, type StatDef } from "@/components/dashboard/StatsGrid";
import { DashboardSection }    from "@/components/dashboard/DashboardSection";
import { TaskItem, type Task } from "@/components/dashboard/TaskItem";
import { OpportunityItem }     from "@/components/dashboard/OpportunityItem";
import { AccountItem }         from "@/components/dashboard/AccountItem";
import { ActivityItem }        from "@/components/dashboard/ActivityItem";
import { ExportBar }           from "@/components/dashboard/ExportBar";
import { GhostButton }         from "@/components/dashboard/PageHeader";
import { useDashboard }        from "@/components/dashboard/DashboardContext";
import { clientFetch }         from "../../../service/api";

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

const ACTIVITY = [
  { initials: "PK", avatarColor: "#7C3AED", timestamp: "Today at 10:14 AM",   text: <><b>Priya Kumar</b> moved <a href="#" style={{ color: C.accent }}>Pro tier upgrade</a> to Negotiation</> },
  { initials: "SR", avatarColor: "#1F9D55", timestamp: "Today at 8:52 AM",    text: <><b>Sam Rivera</b> signed up — <a href="#" style={{ color: C.accent }}>Forge Fitness</a></> },
  { initials: "MK", avatarColor: "#2F6FEB", timestamp: "Yesterday at 4:31 PM", text: <><b>Marco Kent</b> opened the proposal email for <a href="#" style={{ color: C.accent }}>Multi-location plan</a></> },
  { initials: "AD", avatarColor: "#D84A3F", timestamp: "Yesterday at 2:10 PM", text: <><b>Admin</b> added a note to <a href="#" style={{ color: C.accent }}>Iron Union</a></> },
];

// ── component ────────────────────────────────────────────────────

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { tasks, setTasks, nextId, setNextId, setTasksMetadata, tasksMetadata } = useDashboard();

  useEffect(() => {
    clientFetch("/api/tasks").then(async res => {    
      const data = await res.json();
      setTasks(data.tasks);
      setTasksMetadata(data.tasksMetadata);
      setIsLoading(false);
    });
  }, []);

  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    const blank: Task = {
      id: nextId, name: "New task", due: "No due date",
      overdue: false, badge: "General",
      badgeColor: C.line, badgeTextColor: C.muted, done: false,
    };
    setTasks(prev => [...prev, blank]);
    setNextId(n => n + 1);
  }

  return (
    
<>
          {/* KPI strip */}
          <StatsGrid stats={STATS} />

          {/* My Tasks */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-23 w-full" />
              <Skeleton className="h-23 w-full" />
              <Skeleton className="h-23 w-full" />
            </div>
          ) : (
            <DashboardSection
              title="My Tasks"
              action={<GhostButton icon={<Plus size={14} />} label="Add task" onClick={addTask} />}
            >
              {tasks.map((task, i) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} isLast={i === tasks.length - 1} />
              ))}
            </DashboardSection>
          )}
    

          {/* My Opportunities */}
          <DashboardSection
            title="My Opportunities"
            action={<GhostButton icon={<Plus size={14} />} label="Add opportunity" />}
          >
            {OPPORTUNITIES.map((opp, i) => (
              <OpportunityItem key={opp.name} {...opp} isLast={i === OPPORTUNITIES.length - 1} />
            ))}
          </DashboardSection>

          {/* My Accounts */}
          <DashboardSection
            title="My Accounts"
            action={<GhostButton icon={<Plus size={14} />} label="Add account" />}
          >
            {ACCOUNTS.map((acc, i) => (
              <AccountItem key={acc.name} {...acc} isLast={i === ACCOUNTS.length - 1} />
            ))}
          </DashboardSection>

          {/* Recent Activity */}
          <DashboardSection
            title="Recent Activity"
            footer={<ExportBar />}
          >
            {ACTIVITY.map((item, i) => (
              <ActivityItem key={i} {...item} isLast={i === ACTIVITY.length - 1} />
            ))}
          </DashboardSection>

          {/* Footer */}
          <footer style={{ textAlign: "center", padding: 24, fontSize: 11.5, color: C.muted2, borderTop: `1px solid ${C.line}`, marginTop: 8 }}>
            Powered by <a href="#" style={{ color: C.accent, fontWeight: 500 }}>RepTrack</a> v1.0 · © 2026
          </footer>

    </>   
  );
};

export default Dashboard;