"use client";

import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useDashboard } from "../DashboardContext";

export function MobileMenuButton() {
  const { setSidebarOpen } = useDashboard();
  const isMobile           = useIsMobile();

  if (!isMobile) return null;

  return (
    <button
      onClick={() => setSidebarOpen(o => !o)}
      aria-label="Open navigation menu"
      style={{ background: "none", border: "none", color: "#A7A7AC", cursor: "pointer", display: "grid", placeItems: "center", padding: 4 }}
    >
      <Menu size={20} />
    </button>
  );
}
