"use client";
import { useEffect, useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type Account } from "@/lib/types";
import { deleteOpp } from "@/components/atoms/deleteOpp";
import { CreateAccountCard } from "./CreateAccountCard";
import { AccountSearchBar } from "./AccountSearchBar";
import { AccountListView } from "./AccountListView";
import { AccountGridView } from "./AccountGridView";

export function AccountsView() {
  const { acctCatFilter } = useDashboard();
  const [accounts,   setAccounts]   = useState<Account[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [searchTab,  setSearchTab]  = useState<"basic" | "advanced">("basic");
  const [view,       setView]       = useState<"list" | "grid">("list");

  useEffect(() => {
    fetch("/api/accounts", { credentials: "include" })
      .then(res => res.json())
      .then((data: { accounts: Account[] }) => setAccounts(data.accounts))
      .finally(() => setLoading(false));

      
  }, []);

  console.log({"accountss": accounts})

  const filtered = accounts.filter(a => {
    const inCat = !a.category || acctCatFilter.includes(a.category);
    const q = search.toLowerCase();
    return inCat && (!q || a.name.toLowerCase().includes(q));
  });

  const totalAccounts   = accounts.length;
  const activeCustomers = accounts.filter(a => a.category === "customer").length;
  const openOpps        = accounts.reduce((s, a) => s + a.opps, 0);
  const acctWithOpps    = accounts.filter(a => a.opps > 0).length;

  if (loading) {
    return <div style={{ padding: 32, fontSize: 13, color: "#9A9A9A" }}>Loading accounts…</div>;
  }

  return (
    <>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Total accounts",     value: String(totalAccounts),   sub: "↑ 6 this month",                                             up: true  },
          { label: "Active customers",   value: String(activeCustomers), sub: `${Math.round(activeCustomers / totalAccounts * 100)}% of book`, up: false },
          { label: "Open opportunities", value: String(openOpps),        sub: `across ${acctWithOpps} accounts`,                            up: true  },
          { label: "Avg. account value", value: "$8.4K",                 sub: "↑ 3% vs last quarter",                                       up: true  },
        ].map(k => (
          <div key={k.label} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.up ? C.ok : C.muted, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <CreateAccountCard
        view={view}
        onViewChange={setView}
        onAccountCreated={acct => setAccounts(prev => [acct, ...prev])}
      />

      {/* Search + List/Grid card */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
        <AccountSearchBar
          search={search}
          onSearchChange={setSearch}
          searchTab={searchTab}
          onSearchTabChange={setSearchTab}
          resultCount={filtered.length}
        />
        {view === "list" && (
          <AccountListView
            accounts={filtered}
            onDelete={id => deleteOpp(id, setAccounts, "Delete this account?")}
          />
        )}
        {view === "grid" && <AccountGridView accounts={filtered} />}
      </div>
    </>
  );
}
