"use client";
import { useEffect, useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { useDebouncedState } from "@/hooks/useDebouncing";
import { type Opp } from "@/lib/types";
import { mapOpp, type ApiOpportunity } from "./mapOpp";
import { CreateOpportunityCard } from "./CreateOpportunityCard";
import { OppSearchBar } from "./OppSearchBar";
import { OppListView } from "./OppListView";
import { OppPipelineView } from "./OppPipelineView";


export function OpportunitiesView() {
  const { oppStageFilter } = useDashboard();
  const [opps, setOpps]           = useState<Opp[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, debouncedSearch, setSearch] = useDebouncedState<string>("", 400);
  const [searchTab, setSearchTab] = useState<"basic" | "advanced">("basic");
  const [view, setView]           = useState<"list" | "pipeline">("list");

  // Search is handled server-side (ransack); stage filters stay local.
  useEffect(() => {
    const params = new URLSearchParams({ search: debouncedSearch });
    fetch("/api/opportunities?" + params.toString(), { credentials: "include" })
      .then(res => res.json())
      .then((data: { opportunities?: ApiOpportunity[] }) => setOpps((data.opportunities ?? []).map(mapOpp)))
      .catch(() => setOpps([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  async function handleDelete(id: number) {
    const prev = opps;
    setOpps(p => p.filter(o => o.id !== id));   // optimistic
    const res = await fetch(`/api/opportunities/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) setOpps(prev);                 // rollback on failure
  }

  const filtered = opps.filter(o => oppStageFilter.includes(o.stage));

  const pipelineTotal = opps.reduce((s, o) => s + o.amt, 0);
  const weighted      = opps.reduce((s, o) => s + o.amt * o.prob / 100, 0);
  const wonAmt        = opps.filter(o => o.stage === "won").reduce((s, o) => s + o.amt, 0);
  const wonCount      = opps.filter(o => o.stage === "won").length;
  const totalFinished = opps.filter(o => o.stage === "won" || o.stage === "lost").length;
  const winRate       = totalFinished ? Math.round((wonCount / totalFinished) * 100) : 0;

  if (loading) {
    return <div style={{ padding: 32, fontSize: 13, color: "#9A9A9A" }}>Loading opportunities…</div>;
  }

  return (
    <>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Pipeline value", value: `$${(pipelineTotal / 1000).toFixed(0)}K`, sub: "↑ $84K this month", up: true },
          { label: "Weighted",       value: `$${(weighted / 1000).toFixed(0)}K`,      sub: "based on stage probability", up: false },
          { label: "Closed won (Q2)", value: `$${(wonAmt / 1000).toFixed(0)}K`,       sub: `${wonCount} deals`, up: true },
          { label: "Win rate",        value: `${winRate}%`,                             sub: "↑ 4 pts vs Q1", up: true },
        ].map(k => (
          <div key={k.label} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.up ? C.ok : C.muted, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <CreateOpportunityCard
        view={view}
        onViewChange={setView}
        onOppCreated={opp => setOpps(prev => [opp, ...prev])}
      />

      {/* Search + List/Pipeline card */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>

        <OppSearchBar
          search={search}
          onSearchChange={setSearch}
          searchTab={searchTab}
          onSearchTabChange={setSearchTab}
          resultCount={filtered.length}
        />

        {view === "list" && (
          <OppListView
            opps={filtered}
            onDelete={handleDelete}
          />
        )}

        {view === "pipeline" && (
          <OppPipelineView opps={filtered} stageFilter={oppStageFilter} />
        )}
      </div>
    </>
  );
}
