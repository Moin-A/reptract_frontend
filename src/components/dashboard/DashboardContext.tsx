"use client";

import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { type Task, type User } from "@/lib/types";
import { ALL_STAGE_KEYS } from "./opportunities/stages";

export type { User };

interface DashboardContextValue {
  activeTab:      string;
  setActiveTab:   Dispatch<SetStateAction<string>>;
  sidebarOpen:    boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  tasks:          { [key: string]: Task[] };
  setTasks:       Dispatch<SetStateAction<{ [key: string]: Task[] }>>;
  nextId:         number;
  setNextId:      Dispatch<SetStateAction<number>>;
  users:              User[];
  setUsers:           Dispatch<SetStateAction<User[]>>;
  oppStageFilter:     string[];
  setOppStageFilter:  Dispatch<SetStateAction<string[]>>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, initialTasks = {}, initialUsers = [] }: { children: ReactNode; initialTasks?: { [key: string]: Task[] }; initialUsers?: User[] }) {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks]             = useState<{[key: string]: Task[]}>(initialTasks);
  const [nextId, setNextId]           = useState(Object.values(initialTasks).flat().length + 1);
  const [users, setUsers]                     = useState<User[]>(initialUsers);
  const [oppStageFilter, setOppStageFilter]   = useState<string[]>(ALL_STAGE_KEYS);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tasks, setTasks, nextId, setNextId, users, setUsers, oppStageFilter, setOppStageFilter }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
