"use client";
import { useEffect, useRef, useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { useDashboard } from "@/components/organisms/dashboard/DashboardContext";
import { type Account } from "@/lib/types";
import { type AccountCategoryKey } from "./categories";
import { CreateAccountCard } from "./CreateAccountCard";
import { AccountSearchBar } from "./AccountSearchBar";
import { AccountListView } from "./AccountListView";
import { AccountGridView } from "./AccountGridView";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { FormErrorBanner } from "@/components/ui/error_banner";
import { FormSuccessBanner } from "@/components/ui/success_banner";
import { useDebouncedState } from "@/hooks/useDebouncing";

export function AccountsView() {
  const {
    acctCatFilter,
    setAcctCountByCategory,
    acctCreateSignal,
    acctExportSignal,
    acctImportSignal,
  } = useDashboard();

  const [accounts,        setAccounts]        = useState<Account[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [search, debouncedValue, setSearch] = useDebouncedState<string>("", 400);
  const [searchTab,       setSearchTab]       = useState<"basic" | "advanced">("basic");
  const [view,            setView]            = useState<"list" | "grid">("list");
  const [editingAccount,  setEditingAccount]  = useState<Account | null>(null);
  const [sort,            setSort]            = useState<"newest" | "oldest" | "name">("newest");
  const [advancedCategory,   setAdvancedCategory]   = useState("");
  const [advancedMinRating,  setAdvancedMinRating]  = useState(0);
  const [error,           setError]           = useState<string[] | null>(null);
  const [pendingDelete,      setPendingDelete]      = useState<Account | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("search", debouncedValue);

    fetch("/api/accounts?" + params.toString(), { credentials: "include" })
      .then(res => res.json())
      .then((data: { accounts: Account[] }) => {
        const accts = data.accounts ?? [];
        setAccounts(accts);
        const counts: Record<string, number> = {};
        accts.forEach(a => {
          const k = (a.category as string)?.toLowerCase();
          if (k) counts[k] = (counts[k] ?? 0) + 1;
        });
        setAcctCountByCategory(counts);
      })
      .finally(() => setLoading(false));
  }, [setAcctCountByCategory, debouncedValue]);

  // "New Record" button in PageHeader triggers this
  useEffect(() => {
    if (acctCreateSignal > 0) setEditingAccount(null);
  }, [acctCreateSignal]);

  async function handleExport() {
    const res = await fetch("/api/accounts/export", { credentials: "include" });
    if (!res.ok) return;
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "accounts.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  }

  // "Export" button in PageHeader triggers this
  useEffect(() => {
    if (acctExportSignal > 0) handleExport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acctExportSignal]);

  // "Import" button in PageHeader triggers this — opens the file picker.
  // A counter (not a boolean) guarantees every click re-runs this effect.
  useEffect(() => {
    if (acctImportSignal > 0) fileInputRef.current?.click();
  }, [acctImportSignal]);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset so the same file can be re-selected
    if (!file) return;

    const body = new FormData();
    body.append("file", file);
    // Browser sets the multipart Content-Type (with boundary) automatically.
    const res = await fetch("/api/accounts/import", { method: "POST", body, credentials: "include" });
    if (!res.ok) {
      const error = await res.json();
      setError(error.message);
      return;
    }

    setSuccess({ title: "Success", body: "Accounts imported successfully." });

    // Reload accounts so imported rows show up.
    const data = await fetch("/api/accounts", { credentials: "include" }).then(r => r.json());
    setAccounts(data.accounts ?? []);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setAccounts(prev => prev.filter(a => a.id !== id));
    await fetch(`/api/accounts/${id}`, { method: "DELETE", credentials: "include" });
  }

  const catKey = (a: Account) =>
    (a.category as string)?.toLowerCase() as AccountCategoryKey;

  const filtered = accounts.filter(a => {
    const k    = catKey(a);
    const inCat    = !k || acctCatFilter.includes(k);
    const q        = search.toLowerCase();
    const inSearch = !q || a.name.toLowerCase().includes(q);
    const inAdvCat = !advancedCategory || k === advancedCategory;
    const inRating = advancedMinRating === 0 || (a.rating ?? 0) >= advancedMinRating;
    return inCat && inSearch && inAdvCat && inRating;
  });

  const displayed = [...filtered].sort((a, b) => {
    if (sort === "oldest") return (b.daysAgo ?? 0) - (a.daysAgo ?? 0);
    if (sort === "name")   return a.name.localeCompare(b.name);
    return (a.daysAgo ?? 0) - (b.daysAgo ?? 0); // newest
  });

  const totalAccounts   = accounts.length;
  const activeCustomers = accounts.filter(a => (a.category as string)?.toLowerCase() === "customer").length;
  const openOpps        = accounts.reduce((s, a) => s + (a.opps ?? 0), 0);
  const acctWithOpps    = accounts.filter(a => (a.opps ?? 0) > 0).length;
  const thisMonthCount  = accounts.filter(a => (a.daysAgo ?? 0) <= 30).length;

  if (loading) {
    return <div style={{ padding: 32, fontSize: 13, color: "#9A9A9A" }}>Loading accounts…</div>;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleImport}
        style={{ display: "none" }}
      />
      
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          {
            label: "Total accounts",
            value: String(totalAccounts),
            sub:   `↑ ${thisMonthCount} this month`,
            up:    true,
          },
          {
            label: "Active customers",
            value: String(activeCustomers),
            sub:   totalAccounts > 0
              ? `${Math.round(activeCustomers / totalAccounts * 100)}% of book`
              : "0% of book",
            up: false,
          },
          {
            label: "Open opportunities",
            value: String(openOpps),
            sub:   `across ${acctWithOpps} account${acctWithOpps !== 1 ? "s" : ""}`,
            up:    true,
          },
          {
            label: "Avg. account value",
            value: "$8.4K",
            sub:   "↑ 3% vs last quarter",
            up:    true,
          },
        ].map(k => (
          <div key={k.label} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted2, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.up ? C.ok : C.muted, marginTop: 3 }}>{k.sub}</div>
          </div>
        ))}
      </div>
      <FormErrorBanner onDismiss={() => setError(null)} error={ error ? { title: "Error", body: error.join(", ") } : null} />
      <FormSuccessBanner onDismiss={() => setSuccess(null)} message = { success } autoDismissMs={3000} />
      <CreateAccountCard
        view={view}
        onViewChange={setView}
        onAccountCreated={acct => setAccounts(prev => [acct, ...prev])}
        onAccountUpdated={acct => setAccounts(prev => prev.map(a => a.id === acct.id ? acct : a))}
        editAccount={editingAccount}
        onEditCancel={() => setEditingAccount(null)}
        externalOpenSignal={acctCreateSignal}
      />

      {/* Search + List/Grid card */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
        <AccountSearchBar
          search={search}
          onSearchChange={setSearch}
          searchTab={searchTab}
          onSearchTabChange={setSearchTab}
          resultCount={displayed.length}
          sort={sort}
          onSortChange={setSort}
          advancedCategory={advancedCategory}
          onAdvancedCategoryChange={setAdvancedCategory}
          advancedMinRating={advancedMinRating}
          onAdvancedMinRatingChange={setAdvancedMinRating}
        />
        {view === "list" && (
          <AccountListView
            accounts={displayed}
            onEdit={id => setEditingAccount(accounts.find(a => a.id === id) ?? null)}
            onDelete={id => setPendingDelete(accounts.find(a => a.id === id) ?? null)}
          />
        )}
        {view === "grid" && <AccountGridView accounts={displayed} />}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={open => { if (!open) setPendingDelete(null); }}
        title="Delete account"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{pendingDelete?.name ?? ""}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </>
  );
}
