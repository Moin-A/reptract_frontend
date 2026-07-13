"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { C } from "@/components/organisms/dashboard/tokens";
import { type Account, type Lead } from "@/lib/types";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { FormField } from "@/components/atoms/FormField";
import { FormInput } from "@/components/atoms/FormInput";
import { FormRow } from "@/components/atoms/FormRow";
import { SelectWrap } from "@/components/atoms/SelectWrap";
import { AssigneeSelect } from "@/components/atoms/AssigneeSelect";
import { baseSelect } from "@/components/atoms/formStyles";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";
import { OPPORTUNITY_STAGES, type OpportunityStageKey } from "./stages";

type Props = {
  lead:         Lead | null;
  onCancel:     () => void;
  onConverted:  (leadId: number) => void;
};

type AccountMode = "existing" | "new";

// Mirrors fat_free_crm: "Lead" is not a permission level but a sentinel meaning
// "inherit whatever the lead has". The backend resolves it to the lead's access.
type AccessValue = "Lead" | "Private" | "Public";

const ACCESS_OPTIONS: { value: AccessValue; title: string; sub: string }[] = [
  { value: "Lead",    title: "Copy permissions from the lead", sub: "The new account, contact and opportunity stay visible to whoever can see this lead." },
  { value: "Private", title: "Keep it private",                sub: "Only you (and admins) can see the new records."                                      },
  { value: "Public",  title: "Share it with everyone",         sub: "All RepTrack users in your workspace can view the new records."                      },
];

const helpText: React.CSSProperties = {
  fontSize: 13, color: C.muted, lineHeight: 1.5,
};

export function ConvertLeadCard({ lead, onCancel, onConverted }: Props) {
  const [accounts,    setAccounts]    = useState<Account[]>([]);
  const [accountMode, setAccountMode] = useState<AccountMode>("existing");
  const [accountId,    setAccountId]    = useState("");
  const [accountName,  setAccountName]  = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [assigneeId,   setAssigneeId]   = useState("");

  const [oppName,        setOppName]        = useState("");
  const [oppStage,       setOppStage]       = useState(OPPORTUNITY_STAGES[0].key);
  const [oppCloseDate,   setOppCloseDate]   = useState("");
  const [oppProbability, setOppProbability] = useState("");
  const [oppAmount,      setOppAmount]      = useState("");
  const [oppDiscount,    setOppDiscount]    = useState("");

  const [access, setAccess] = useState<AccessValue>("Lead");

  const [error,      setError]      = useState<FormError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset the form each time a different lead is opened, and seed the account
  // name from the lead's company so "create new" is prefilled like the CRM does.
  useEffect(() => {
    if (!lead) return;
    setAccountMode("existing");
    setAccountId("");
    setAccountName(lead.company ?? "");
    setAccountEmail(lead.email ?? "");
    setAssigneeId(lead.assignee_id ? String(lead.assignee_id) : "");
    setOppName("");
    setOppStage(OPPORTUNITY_STAGES[0].key);
    setOppCloseDate("");
    setOppProbability("");
    setOppAmount("");
    setOppDiscount("");
    setAccess("Lead");
    setError(null);
  }, [lead]);

  useEffect(() => {
    if (!lead) return;
    fetch("/api/accounts", { credentials: "include" })
      .then(res => res.json())
      .then((data: { accounts: Account[] }) => setAccounts(data.accounts ?? []))
      .catch(() => setAccounts([]));
  }, [lead]);

  if (!lead) return null;

  async function handleSubmit() {
    if (!lead) return;
    if (!assigneeId) {
      setError({ title: "Assignee required", body: "Choose who the new contact should be assigned to." });
      return;
    }
    if (accountMode === "existing" && !accountId) {
      setError({ title: "Account required", body: "Select an existing account, or switch to “create new”." });
      return;
    }
    if (accountMode === "new" && !accountName.trim()) {
      setError({ title: "Account name required", body: "Enter a name for the new account." });
      return;
    }
    // The backend validates the email format and does not allow it to be blank,
    // so a new account without one is rejected server-side.
    if (accountMode === "new" && !/\S+@\S+/.test(accountEmail.trim())) {
      setError({ title: "Account email required", body: "Enter a valid email for the new account." });
      return;
    }

    setSubmitting(true);
    setError(null);

    // "Lead" is a UI-only sentinel meaning "inherit the lead's permissions". It is
    // resolved here so the backend only ever receives a concrete access value, and
    // that value is embedded in each record's params rather than transformed there.
    // Linking to an existing account ignores it — that account keeps its own
    // permissions; access only takes effect on records being created.
    const granted = access === "Lead" ? (lead.access ?? "Private") : access;

    const account = accountMode === "existing"
      ? { id: Number(accountId), access: granted }
      : { name: accountName.trim(), email: accountEmail.trim(), access: granted };

    const opportunity = oppName.trim()
      ? {
          name:        oppName.trim(),
          stage:       oppStage,
          closes_on:   oppCloseDate || null,
          probability: oppProbability ? Number(oppProbability) : null,
          amount:      oppAmount ? Number(oppAmount) : null,
          discount:    oppDiscount ? Number(oppDiscount) : null,
          access:      granted,
        }
      : undefined;

    try {
      const res = await fetch(`/api/leads/${lead.id}/convert`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ lead: { account, opportunity, access: granted, assignee_id: Number(assigneeId) } }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError({
          title: "Could not convert lead",
          body:  data.errors?.join(", ") ?? `The server responded with ${res.status}.`,
        });
        return;
      }

      onConverted(lead.id);
    } catch {
      setError({ title: "Network error", body: "Could not reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 7, background: C.accent, display: "inline-block" }} />
          Convert {lead.name}
        </div>
        <button
          onClick={onCancel}
          aria-label="Close form"
          title="Close form"
          style={{ display: "inline-flex", padding: 5, borderRadius: 7, border: `1px solid ${C.line}`, background: "white", color: C.muted, cursor: "pointer" }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ background: "#FAFAF7" }}>
        <div style={{ padding: "18px 24px 4px" }}>
          <p style={{ ...helpText, marginBottom: 18 }}>
            By converting the lead <strong style={{ color: C.ink }}>{lead.name}</strong> will become a contact
            associated with the existing or newly created account. Lead status will be automatically set
            to converted.
          </p>

          {error && (
            <div style={{ marginBottom: 16 }}>
              <FormErrorBanner
                error={error}
                onDismiss={() => setError(null)}
                watchValues={[accountId, accountName, accountEmail, assigneeId]}
              />
            </div>
          )}

          {/* Account + Assignee */}
          <FormRow columns="1.6fr 1fr">
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted, display: "block", marginBottom: 6 }}>
                Account (
                <button
                  onClick={() => setAccountMode(m => (m === "new" ? "existing" : "new"))}
                  style={{ background: "none", border: "none", padding: 0, font: "inherit", color: C.accent, cursor: "pointer", textTransform: "none", letterSpacing: "normal" }}
                >
                  {accountMode === "new" ? "select existing" : "create new"}
                </button>
                )
              </label>

              {accountMode === "existing" ? (
                <SelectWrap>
                  <select
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    style={baseSelect}
                  >
                    <option value="">Select an account…</option>
                    {accounts.map(a => (
                      <option key={a.id} value={String(a.id)}>{a.name}</option>
                    ))}
                  </select>
                </SelectWrap>
              ) : (
                <FormInput
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  placeholder="New account name"
                />
              )}
            </div>

            <FormField label="Assigned to" required>
              <AssigneeSelect value={assigneeId} onChange={setAssigneeId} useId />
            </FormField>
          </FormRow>

          {/* Only a new account needs an email — an existing one keeps its own. */}
          {accountMode === "new" && (
            <FormRow columns="1.6fr 1fr">
              <FormField label="Account email" required>
                <FormInput
                  type="email"
                  value={accountEmail}
                  onChange={e => setAccountEmail(e.target.value)}
                  placeholder="billing@acme.com"
                />
              </FormField>
              <div />
            </FormRow>
          )}

          {/* Opportunity */}
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.ink, marginTop: 8, marginBottom: 8 }}>
            Opportunity
          </div>
          <p style={{ ...helpText, marginBottom: 16 }}>
            You can optionally create an opportunity for the {lead.name} contact by specifying the name,
            current stage, estimated closing date, sale probability, amount of the deal, and the discount offered.
          </p>

          <FormRow columns="1.6fr 1fr">
            <FormField label="Name">
              <FormInput value={oppName} onChange={e => setOppName(e.target.value)} />
            </FormField>
            <FormField label="Stage">
              <SelectWrap>
                <select
                  value={oppStage}
                  onChange={e => setOppStage(e.target.value as OpportunityStageKey)}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  style={baseSelect}
                >
                  {OPPORTUNITY_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </SelectWrap>
            </FormField>
          </FormRow>

          <FormRow columns="repeat(4, 1fr)">
            <FormField label="Close date">
              <FormInput type="date" value={oppCloseDate} onChange={e => setOppCloseDate(e.target.value)} />
            </FormField>
            <FormField label="Probability (%)">
              <FormInput type="number" min={0} max={100} value={oppProbability} onChange={e => setOppProbability(e.target.value)} />
            </FormField>
            <FormField label="Amount ($)">
              <FormInput type="number" min={0} step="0.01" value={oppAmount} onChange={e => setOppAmount(e.target.value)} />
            </FormField>
            <FormField label="Discount ($)">
              <FormInput type="number" min={0} step="0.01" value={oppDiscount} onChange={e => setOppDiscount(e.target.value)} />
            </FormField>
          </FormRow>
        </div>

        <CollapsibleSection title="Permissions">
          <p style={{ ...helpText, marginBottom: 14 }}>
            Decide who can see the account, contact and opportunity created by this conversion.
            You can change permissions later.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ACCESS_OPTIONS.map(opt => {
              const sel = access === opt.value;
              return (
                <label key={opt.value} onClick={() => setAccess(opt.value)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    padding: "10px 12px", borderRadius: 9, cursor: "pointer",
                    border: `1px solid ${sel ? C.accent : C.line}`,
                    background: sel ? "#FFF8F4" : "white",
                    boxShadow: sel ? "0 0 0 3px rgba(255,91,31,0.10)" : "none",
                    transition: "border-color 140ms, background 140ms",
                  }}
                >
                  <input type="radio" name="convert-access" value={opt.value} checked={sel}
                    onChange={() => setAccess(opt.value)} style={{ display: "none" }} />
                  <div style={{
                    width: 16, height: 16, borderRadius: 16, border: `1.5px solid ${sel ? C.accent : "#2A2A2D"}`,
                    flexShrink: 0, marginTop: 2, display: "grid", placeItems: "center", transition: "border-color 140ms",
                  }}>
                    {sel && <div style={{ width: 8, height: 8, borderRadius: 8, background: C.accent }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{opt.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{opt.sub}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, background: C.bg, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              display: "inline-flex", alignItems: "center", padding: "7px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, background: C.accent, color: "white",
              border: `1px solid ${C.accent}`, cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.6 : 1, fontFamily: "inherit",
            }}
          >
            {submitting ? "Converting…" : "Convert Lead"}
          </button>
          <span style={{ fontSize: 13, color: C.muted }}>or</span>
          <button
            onClick={onCancel}
            style={{ fontSize: 13, color: C.accent, fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
