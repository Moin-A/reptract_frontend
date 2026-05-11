"use client";
import { useState } from "react";
import { C } from "@/components/dashboard/tokens";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { type Opp } from "@/lib/types";
import { deleteOpp } from "@/components/dashboard/atoms/deleteOpp";
import { CreateOpportunityCard } from "./CreateOpportunityCard";
import { OppSearchBar } from "./OppSearchBar";
import { OppListView } from "./OppListView";
import { OppPipelineView } from "./OppPipelineView";


const SEED_OPPS: Opp[] = [
  { id:  1, name: "Placeat voluptas dolore aliquid iusto sed",                           stage: "presentation", acct: "Kunze-Miller",       amt: 24000, prob: 30,  user: "Aaron Assembler",    daysAgo: 18 },
  { id:  2, name: "Maiores quisquam praesentium perspiciatis commodi provident",          stage: "other",        acct: "Kunze-Miller",       amt: 0,     prob: 0,   user: "George Globals",     daysAgo: 18 },
  { id:  3, name: "Molestiae unde odio dicta veritatis reprehenderit voluptates",         stage: "won",          acct: "Cole-Mann",          amt: 48000, prob: 100, user: "Cindy Cluster",      daysAgo: 18 },
  { id:  4, name: "Nulla consequuntur dicta",                                             stage: "other",        acct: "Bailey LLC",         amt: 0,     prob: 0,   user: "Ben Bootloader",     daysAgo: 18 },
  { id:  5, name: "Expedita distinctio illum ipsa",                                      stage: "final",        acct: "Wuckert-Ruecker",    amt: 62500, prob: 85,  user: "Heather Hash",       daysAgo: 19 },
  { id:  6, name: "Cupiditate earum aspernatur nulla occaecati eligendi deserunt",        stage: "proposal",     acct: "McDermott-Weimann",  amt: 38000, prob: 50,  user: "George Globals",     daysAgo: 19 },
  { id:  7, name: "Totam cum facilis assumenda",                                          stage: "analysis",     acct: "Bailey LLC",         amt: 12500, prob: 20,  user: "Cindy Cluster",      daysAgo: 19 },
  { id:  8, name: "Fugit quas deserunt dicta",                                            stage: "presentation", acct: "Cole-Mann",          amt: 28200, prob: 30,  user: "Dan Debugger",       daysAgo: 19 },
  { id:  9, name: "Laudantium illo vitae quod",                                           stage: "negotiation",  acct: "Wuckert-Ruecker",    amt: 96000, prob: 70,  user: "Cindy Cluster",      daysAgo: 20 },
  { id: 10, name: "Ab quisquam magni pariatur ipsam assumenda",                           stage: "prospecting",  acct: "Bailey LLC",         amt: 8500,  prob: 10,  user: "George Globals",     daysAgo: 20 },
  { id: 11, name: "Ut distinctio possimus eaque occaecati hic",                           stage: "presentation", acct: "McDermott-Weimann",  amt: 21000, prob: 30,  user: "Heather Hash",       daysAgo: 20 },
  { id: 12, name: "Repellat libero quidem voluptas enim odio est",                        stage: "prospecting",  acct: "Cole-Mann",          amt: 14500, prob: 10,  user: "Cindy Cluster",      daysAgo: 21 },
  { id: 13, name: "Placeat tempora repudiandae",                                          stage: "prospecting",  acct: "Wuckert-Ruecker",    amt: 11200, prob: 10,  user: "Elizabeth Emulator", daysAgo: 21 },
  { id: 14, name: "Exercitationem odio expedita amet quia",                               stage: "lost",         acct: "Bailey LLC",         amt: 0,     prob: 0,   user: "Aaron Assembler",    daysAgo: 21 },
  { id: 15, name: "Exercitationem nulla sit alias magni quo hic officiis",                stage: "final",        acct: "Cole-Mann",          amt: 75000, prob: 85,  user: "Dan Debugger",       daysAgo: 22 },
  { id: 16, name: "Quibusdam numquam dicta alias ducimus",                                stage: "final",        acct: "Wuckert-Ruecker",    amt: 52000, prob: 85,  user: "Heather Hash",       daysAgo: 22 },
  { id: 17, name: "Similique asperiores necessitatibus atque corporis quam",              stage: "analysis",     acct: "McDermott-Weimann",  amt: 16800, prob: 20,  user: "Cindy Cluster",      daysAgo: 22 },
  { id: 18, name: "Dolore neque itaque",                                                  stage: "negotiation",  acct: "Bailey LLC",         amt: 42000, prob: 70,  user: "Frank Formatter",    daysAgo: 23 },
  { id: 19, name: "Consequuntur fugiat quaerat sit enim",                                 stage: "presentation", acct: "Cole-Mann",          amt: 19500, prob: 30,  user: "George Globals",     daysAgo: 24 },
];

export function OpportunitiesView() {
  const { oppStageFilter, setOppStageFilter } = useDashboard();
  const [opps, setOpps] = useState<Opp[]>(SEED_OPPS);
  const [search, setSearch]       = useState("");
  const [searchTab, setSearchTab] = useState<"basic" | "advanced">("basic");
  const [view, setView]           = useState<"list" | "pipeline">("list");

  const filtered = opps.filter(o => {
    const inStage = oppStageFilter.includes(o.stage);
    const q = search.toLowerCase();
    const inSearch = !q || o.name.toLowerCase().includes(q) || o.acct.toLowerCase().includes(q);
    return inStage && inSearch;
  });

  const pipelineTotal = opps.reduce((s, o) => s + o.amt, 0);
  const weighted      = opps.reduce((s, o) => s + o.amt * o.prob / 100, 0);
  const wonAmt        = opps.filter(o => o.stage === "won").reduce((s, o) => s + o.amt, 0);
  const wonCount      = opps.filter(o => o.stage === "won").length;
  const totalFinished = opps.filter(o => o.stage === "won" || o.stage === "lost").length;
  const winRate       = totalFinished ? Math.round((wonCount / totalFinished) * 100) : 0;

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
            onDelete={id => deleteOpp(id, setOpps)}
          />
        )}

        {view === "pipeline" && (
          <OppPipelineView opps={filtered} stageFilter={oppStageFilter} />
        )}
      </div>
    </>
  );
}
