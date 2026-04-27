import { C } from "@/components/dashboard/tokens";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { TopNav }    from "@/components/dashboard/TopNav";
import { Sidebar }   from "@/components/dashboard/Sidebar";
import { ActiveView } from "@/components/dashboard/ActiveView";
import { getTasks }  from "@/lib";

export default async function DashboardPage() {
  const initialTasks = await getTasks();

  return (
    <DashboardProvider initialTasks={initialTasks}>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, background: C.bg, color: C.ink, minHeight: "100vh" }}>
        <TopNav userName="Admin" />
        <div className="dashboard-grid">
          <Sidebar />
          <ActiveView />
        </div>
      </div>
    </DashboardProvider>
  );
}
