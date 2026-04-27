import { C } from "@/components/dashboard/tokens";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { TopNav }  from "@/components/dashboard/TopNav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import Dashboard   from "@/components/dashboard/index";

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, background: C.bg, color: C.ink, minHeight: "100vh" }}>
        <TopNav userName="Admin" />
        <div className="dashboard-grid">
          <Sidebar />
          <Dashboard />
        </div>
      </div>
    </DashboardProvider>
  );
}
