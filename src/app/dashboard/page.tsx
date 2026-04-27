"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { C }        from "@/components/dashboard/tokens";
import { TopNav }   from "@/components/dashboard/TopNav";
import { Sidebar }  from "@/components/dashboard/Sidebar";
import Dashboard    from "@/components/dashboard";

export default function DashboardPage() {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile                      = useIsMobile();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, background: C.bg, color: C.ink, minHeight: "100vh" }}>

      {/* ── Layout Shell ── */}
      <TopNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        userName="Admin"
      />

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "220px 1fr", minHeight: "calc(100vh - 52px)" }}>

        {/* ── Sidebar ── */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ── Main Content ── */}
        <Dashboard />
      </div>
    </div>
  );
}
