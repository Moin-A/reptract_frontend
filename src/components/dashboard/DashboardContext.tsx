"use client";

import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { type Task } from "./TaskItem";

interface DashboardContextValue {
  activeTab:      string;
  setActiveTab:   Dispatch<SetStateAction<string>>;
  sidebarOpen:    boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  tasks:          { [key: string]: Task[] };
  setTasks:       Dispatch<SetStateAction<{ [key: string]: Task[] }>>;
  nextId:         number;
  setNextId:      Dispatch<SetStateAction<number>>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, initialTasks = {} }: { children: ReactNode; initialTasks?: { [key: string]: Task[] } }) {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks]             = useState<{[key: string]: Task[]}>(initialTasks);
  const [nextId, setNextId]           = useState(Object.values(initialTasks).flat().length + 1);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tasks, setTasks, nextId, setNextId }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
