"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type Account } from "@/lib/types";
import { deleteOpp } from "@/components/atoms/deleteOpp";
import { CreateAccountCard } from "./CreateAccountCard";
import { AccountSearchBar } from "./AccountSearchBar";
import { AccountListView } from "./AccountListView";
import { AccountGridView } from "./AccountGridView";

const SEED_ACCOUNTS: Account[] = [
  { id:  1, name: "Greenholt-Kirlin",           cat: "customer",   user: "George Globals",  daysAgo: 18, contacts: 0, opps: 0, rating: 0 },
  { id:  2, name: "O'Reilly, Leffler and West", cat: "reseller",   user: "Aaron Assembler", daysAgo: 18, contacts: 0, opps: 0, rating: 0 },
  { id:  3, name: "Wuckert-Ruecker",            cat: "partner",    user: "Aaron Assembler", daysAgo: 19, contacts: 0, opps: 0, rating: 0 },
  { id:  4, name: "Batko-Ullrich",              cat: "reseller",   user: "George Globals",  daysAgo: 19, contacts: 0, opps: 0, rating: 0 },
  { id:  5, name: "Cole-Mann",                  cat: "customer",   user: "Cindy Cluster",   daysAgo: 19, contacts: 3, opps: 2, rating: 4 },
  { id:  6, name: "Bailey LLC",                 cat: "customer",   user: "Heather Hash",    daysAgo: 20, contacts: 5, opps: 1, rating: 3 },
  { id:  7, name: "McDermott-Weimann",          cat: "partner",    user: "Marco Kent",      daysAgo: 20, contacts: 2, opps: 3, rating: 5 },
  { id:  8, name: "Kunze-Miller",               cat: "affiliate",  user: "George Globals",  daysAgo: 21, contacts: 1, opps: 0, rating: 0 },
  { id:  9, name: "Hansen Brothers",            cat: "vendor",     user: "Priya Kumar",     daysAgo: 21, contacts: 4, opps: 0, rating: 2 },
  { id: 10, name: "Lehner-Davis",               cat: "reseller",   user: "Sam Rivera",      daysAgo: 22, contacts: 2, opps: 1, rating: 0 },
  { id: 11, name: "Funk-Mayer",                 cat: "competitor", user: "Cindy Cluster",   daysAgo: 22, contacts: 0, opps: 0, rating: 0 },
  { id: 12, name: "Schmitt and Sons",           cat: "partner",    user: "Aaron Assembler", daysAgo: 23, contacts: 3, opps: 2, rating: 3 },
  { id: 13, name: "Connelly Group",             cat: "customer",   user: "Heather Hash",    daysAgo: 24, contacts: 6, opps: 1, rating: 4 },
  { id: 14, name: "Volkman LLC",                cat: "affiliate",  user: "George Globals",  daysAgo: 25, contacts: 1, opps: 0, rating: 0 },
  { id: 15, name: "Larson-Botsford",            cat: "vendor",     user: "Priya Kumar",     daysAgo: 26, contacts: 2, opps: 0, rating: 0 },
  { id: 16, name: "Predovic-Mraz",              cat: "other",      user: "Marco Kent",      daysAgo: 27, contacts: 0, opps: 0, rating: 0 },
];

export function AccountsView() {
  const { acctCatFilter } = useDashboard();
  const [accounts,   setAccounts]   = useState<Account[]>(SEED_ACCOUNTS);
  const [search,     setSearch]     = useState("");
  const [searchTab,  setSearchTab]  = useState<"basic" | "advanced">("basic");
  const [view,       setView]       = useState<"list" | "grid">("list");

  const filtered = accounts.filter(a => {
    const inCat = acctCatFilter.includes(a.cat);
    const q = search.toLowerCase();
    return inCat && (!q || a.name.toLowerCase().includes(q));
  });

  const totalAccounts   = accounts.length;
  const activeCustomers = accounts.filter(a => a.cat === "customer").length;
  const openOpps        = accounts.reduce((s, a) => s + a.opps, 0);
  const acctWithOpps    = accounts.filter(a => a.opps > 0).length;

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
