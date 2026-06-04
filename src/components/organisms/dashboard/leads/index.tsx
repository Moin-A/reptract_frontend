"use client";
import { useEffect, useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type Lead } from "@/lib/types";
import { ALL_LEAD_STATUS_KEYS, LEAD_STATUS_MAP } from "./statuses";
import { deleteOpp } from "@/components/atoms/deleteOpp";
import { CreateLeadCard } from "./CreateLeadCard";
import { LeadListView } from "./LeadListView";
import { LeadSearchBar } from "./LeadSearchBar";

type SortKey = "newest" | "oldest" | "name";

export function LeadsView() {
  const { leadStatusFilter, leadCreateSignal } = useDashboard();
  const [leads,       setLeads]       = useState<Lead[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [searchTab,   setSearchTab]   = useState<"basic" | "advanced">("basic");
  const [sort,        setSort]        = useState<SortKey>("newest");
  const [advStatus,   setAdvStatus]   = useState("");
  const [advSource,   setAdvSource]   = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetch("/api/leads", { credentials: "include" })
      .then(res => res.json())
      .then((data: { leads: Lead[] }) => {
        console.log("Leads from API:", data);
        setLeads(data.leads ?? []);
      })
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  // open create form via PageHeader "New Record" button
  useEffect(() => {
    if (leadCreateSignal > 0) setEditingLead(null);
  }, [leadCreateSignal]);

  const filtered = leads
    .filter(l => {
      const inStatus = leadStatusFilter.includes(l.status);
      const q        = search.toLowerCase();
      const fullName = `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim() || l.name;
      const matchQ   = !q || fullName.toLowerCase().includes(q) || (l.company ?? "").toLowerCase().includes(q);
      const matchSt  = !advStatus || l.status === advStatus;
      const matchSrc = !advSource || l.source === advSource;
      return inStatus && matchQ && matchSt && matchSrc;
    })
    .sort((a, b) => {
      const nameA = `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim() || a.name;
      const nameB = `${b.first_name ?? ""} ${b.last_name ?? ""}`.trim() || b.name;
      if (sort === "name")   return nameA.localeCompare(nameB);
      if (sort === "oldest") return (b.daysAgo ?? 0) - (a.daysAgo ?? 0);
      return (a.daysAgo ?? 0) - (b.daysAgo ?? 0);
    });

  const total      = leads.length;
  const newLeads   = leads.filter(l => l.status === "new").length;
  const qualified  = leads.filter(l => l.status === "contacted" || l.status === "converted").length;
  const converted  = leads.filter(l => l.status === "converted").length;
  const convRate   = total > 0 ? Math.round((converted / total) * 100) : 0;

  if (loading) {
    return <div style={{ padding: 32, fontSize: 13, color: "#9A9A9A" }}>Loading leads…</div>;
  }

  return (
    <>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Total leads",      value: String(total),      sub: "↑ 4 this month",             up: true  },
          { label: "New",              value: String(newLeads),   sub: "Awaiting first contact",      up: true  },
          { label: "Qualified",        value: String(qualified),  sub: "Ready for opportunity",       up: true  },
          { label: "Conversion rate",  value: `${convRate}%`,     sub: `${converted} converted`,      up: convRate >= 20 },
        ].map(k => (
          <div key={k.label} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.up ? C.ok : C.muted, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <CreateLeadCard
        onLeadCreated={lead => setLeads(prev => [lead, ...prev])}
        onLeadUpdated={lead => setLeads(prev => prev.map(l => l.id === lead.id ? lead : l))}
        editLead={editingLead}
        onEditCancel={() => setEditingLead(null)}
      />

      {/* Search + List card */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
        <LeadSearchBar
          search={search}           onSearchChange={setSearch}
          searchTab={searchTab}     onSearchTabChange={setSearchTab}
          resultCount={filtered.length}
          sort={sort}               onSortChange={setSort}
          advancedStatus={advStatus} onAdvancedStatusChange={setAdvStatus}
          advancedSource={advSource} onAdvancedSourceChange={setAdvSource}
        />
        <LeadListView
          leads={filtered}
          onEdit={id => setEditingLead(leads.find(l => l.id === id) ?? null)}
          onDelete={id => deleteOpp(id, setLeads, "Delete this lead?")}
          onConvert={id => setLeads(prev => prev.map(l => l.id === id ? { ...l, status: "converted" } : l))}
        />
      </div>
    </>
  );
}
