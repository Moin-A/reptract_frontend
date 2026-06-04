"use client";

import { createContext, useContext, useState, useCallback, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { type Task, type User, type Group } from "@/lib/types";
import { ALL_STAGE_KEYS } from "./opportunities/stages";
import { ALL_CAT_KEYS } from "./accounts/categories";
import { ALL_LEAD_STATUS_KEYS } from "./leads/statuses";

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
  acctCatFilter:      string[];
  setAcctCatFilter:   Dispatch<SetStateAction<string[]>>;
  groups:             Group[];
  setGroups:          Dispatch<SetStateAction<Group[]>>;
  acctCountByCategory:    Record<string, number>;
  setAcctCountByCategory: Dispatch<SetStateAction<Record<string, number>>>;
  acctCreateSignal:    number;
  incrementAcctCreate: () => void;
  acctExportSignal:    number;
  incrementAcctExport: () => void;
  leadStatusFilter:     string[];
  setLeadStatusFilter:  Dispatch<SetStateAction<string[]>>;
  leadCountByStatus:    Record<string, number>;
  setLeadCountByStatus: Dispatch<SetStateAction<Record<string, number>>>;
  leadCreateSignal:    number;
  incrementLeadCreate: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children, initialTasks = {}, initialUsers = [], usergroups = [] }: { children: ReactNode; initialTasks?: { [key: string]: Task[] }; initialUsers?: User[]; usergroups?: Group[];}) {
  const [activeTab, setActiveTab]     = useState("Dashboard");
  const [groups, setGroups] = useState<Group[]>(usergroups);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks]             = useState<{[key: string]: Task[]}>(initialTasks);
  const [nextId, setNextId]           = useState(Object.values(initialTasks).flat().length + 1);
  const [users, setUsers]                     = useState<User[]>(initialUsers);
  const [oppStageFilter, setOppStageFilter]   = useState<string[]>(ALL_STAGE_KEYS);
  const [acctCatFilter,  setAcctCatFilter]    = useState<string[]>(ALL_CAT_KEYS);
  const [acctCountByCategory, setAcctCountByCategory] = useState<Record<string, number>>({});
  const [acctCreateSignal, setAcctCreateSignal] = useState(0);
  const [acctExportSignal, setAcctExportSignal] = useState(0);
  const incrementAcctCreate = useCallback(() => setAcctCreateSignal(s => s + 1), []);
  const incrementAcctExport = useCallback(() => setAcctExportSignal(s => s + 1), []);
  const [leadStatusFilter,    setLeadStatusFilter]    = useState<string[]>(ALL_LEAD_STATUS_KEYS);
  const [leadCountByStatus,   setLeadCountByStatus]   = useState<Record<string, number>>({});
  const [leadCreateSignal,    setLeadCreateSignal]    = useState(0);
  const incrementLeadCreate = useCallback(() => setLeadCreateSignal(s => s + 1), []);

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, tasks, setTasks, nextId, setNextId, users, setUsers, oppStageFilter, setOppStageFilter, acctCatFilter, setAcctCatFilter, groups, setGroups, acctCountByCategory, setAcctCountByCategory, acctCreateSignal, incrementAcctCreate, acctExportSignal, incrementAcctExport, leadStatusFilter, setLeadStatusFilter, leadCountByStatus, setLeadCountByStatus, leadCreateSignal, incrementLeadCreate }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
