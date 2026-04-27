"use client";

import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";

interface DashboardContextValue {
  activeTab:      string;
  setActiveTab:   Dispatch<SetStateAction<string>>;
  sidebarOpen:    boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
