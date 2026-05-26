import { C } from "@/components/organisms/dashboard/tokens";
import { DashboardProvider } from "@/components/organisms/dashboard/DashboardContext";
import { TopNav }    from "@/components/organisms/dashboard/TopNav";
import { Sidebar }   from "@/components/organisms/dashboard/Sidebar";
import { ActiveView } from "@/components/organisms/dashboard/ActiveView";
import { fetchUsers, fetchGroups } from "../../../service/api";

export default async function DashboardPage() {
  const users = await fetchUsers();
  const groups = await fetchGroups();

  return (
    <DashboardProvider initialUsers={users} usergroups={groups.groups}>
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
