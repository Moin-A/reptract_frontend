"use client";

import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { type Task } from "./TaskItem";

interface DashboardContextValue {
  activeTab:      string;
  setActiveTab:   Dispatch<SetStateAction<string>>;
  sidebarOpen:    boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  tasks:          Task[];
  setTasks:       Dispatch<SetStateAction<Task[]>>;
  nextId:         number;
  setNextId:      Dispatch<SetStateAction<number>>;
  tasksMetadata:   { [key: string]: any };
  setTasksMetadata: Dispatch<SetStateAction<{ [key: string]: any }>>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, initialTasks = [] }: { children: ReactNode; initialTasks?: Task[] }) {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks]             = useState<Task[]>(initialTasks);
  const [tasksMetadata, setTasksMetadata] = useState<{ [key: string]: any }>({});
  const [nextId, setNextId]           = useState(initialTasks.length + 1);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tasks, setTasks, nextId, setNextId, tasksMetadata, setTasksMetadata }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
