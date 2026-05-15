"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { C } from "@/components/organisms/dashboard/tokens";
import { CATEGORIES, type AccountCategoryKey } from "./categories";
import { type Account } from "@/lib/types";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { CreateCardShell } from "@/components/molecules/CreateCardShell";
import { FormFooter } from "@/components/molecules/FormFooter";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";
import { SelectWrap } from "@/components/atoms/SelectWrap";
import { fieldLabel, baseInput, baseSelect } from "@/components/atoms/formStyles";
import { TagsInput } from "@/components/atoms/TagsInput";
import { AssigneeSelect } from "@/components/atoms/AssigneeSelect";
import { StarRating } from "@/components/atoms/StarRating";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";

type Props = {
  view:              "list" | "grid";
  onViewChange:      (v: "list" | "grid") => void;
  onAccountCreated:  (acct: Account) => void;
  onAccountUpdated?: (acct: Account) => void;
  editAccount?:      Account | null;
  onEditCancel?:     () => void;
};

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia"];

function AddressGroup({ title, icon, ids, disabled, onInput }: {
  title: string;
  icon: React.ReactNode;
  ids: { street1: string; street2: string; city: string; state: string; zip: string; country: string };
  disabled?: boolean;
  onInput?: () => void;
}) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, background: "white" }}>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        {icon}{title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input id={ids.street1} disabled={disabled} style={{ ...baseInput, opacity: disabled ? 0.5 : 1 }} placeholder="Street address" onFocus={focusInput} onBlur={blurInput} onInput={onInput} />
        <input id={ids.street2} disabled={disabled} style={{ ...baseInput, opacity: disabled ? 0.5 : 1 }} placeholder="Apt, suite, etc." onFocus={focusInput} onBlur={blurInput} onInput={onInput} />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
          <input id={ids.city}  disabled={disabled} style={{ ...baseInput, opacity: disabled ? 0.5 : 1 }} placeholder="City"  onFocus={focusInput} onBlur={blurInput} onInput={onInput} />
          <input id={ids.state} disabled={disabled} style={{ ...baseInput, opacity: disabled ? 0.5 : 1 }} placeholder="State" onFocus={focusInput} onBlur={blurInput} onInput={onInput} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
          <input id={ids.zip} disabled={disabled} style={{ ...baseInput, opacity: disabled ? 0.5 : 1 }} placeholder="ZIP" onFocus={focusInput} onBlur={blurInput} onInput={onInput} />
          <SelectWrap>
            <select id={ids.country} disabled={disabled} style={{ ...baseSelect, opacity: disabled ? 0.5 : 1 }} onFocus={focusInput} onBlur={blurInput} onChange={onInput}>
              <option value="">Select a country</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </SelectWrap>
        </div>
      </div>
    </div>
  );
}

export function CreateAccountCard({ view, onViewChange, onAccountCreated, onAccountUpdated, editAccount, onEditCancel }: Props) {
  const [formOpen,   setFormOpen]   = useState(false);
  const [fName,      setFName]      = useState("");
  const [fCategory,  setFCategory]  = useState<AccountCategoryKey>("other");
  const [fAssigned,  setFAssigned]  = useState("");
  const [fRating,    setFRating]    = useState(0);
  const [fTags,      setFTags]      = useState<string[]>([]);
  const [fPhone,     setFPhone]     = useState("");
  const [fTollfree,  setFTollfree]  = useState("");
  const [fFax,       setFFax]       = useState("");
  const [fEmail,     setFEmail]     = useState("");
  const [fWebsite,   setFWebsite]   = useState("");
  const [sameAsBill, setSameAsBill] = useState(true);
  const [fNameError,   setFNameError]   = useState(false);
  const [fSuccess,     setFSuccess]     = useState(false);
  const [serverError,  setServerError]  = useState<FormError | null>(null);

  useEffect(() => {
    if (!editAccount) return;
    setFName(editAccount.name);
    setFCategory((editAccount.category as AccountCategoryKey) ?? "other");
    setFAssigned(editAccount.assigned_to ?? "");
    setFRating(editAccount.rating ?? 0);
    setFPhone(editAccount.phone ?? "");
    setFEmail(editAccount.email ?? "");
    setFormOpen(true);
  }, [editAccount]);

  function reset() {
    setFName(""); setFCategory("other"); setFAssigned(""); setFRating(0);
    setFTags([]); setFPhone(""); setFTollfree(""); setFFax("");
    setFEmail(""); setFWebsite(""); setSameAsBill(true);
    setFNameError(false); setFSuccess(false); setServerError(null);
    ["b-street1","b-street2","b-city","b-state","b-zip","b-country",
     "s-street1","s-street2","s-city","s-state","s-zip","s-country"].forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      if (el) el.value = "";
    });
  }

  function syncShipping() {
    if (!sameAsBill) return;
    [["b-street1","s-street1"],["b-street2","s-street2"],["b-city","s-city"],
     ["b-state","s-state"],["b-zip","s-zip"],["b-country","s-country"]].forEach(([b, s]) => {
      const bEl = document.getElementById(b) as HTMLInputElement | HTMLSelectElement | null;
      const sEl = document.getElementById(s) as HTMLInputElement | HTMLSelectElement | null;
      if (bEl && sEl) sEl.value = bEl.value;
    });
  }

  const body = {
    name:     fName.trim(),
    category: fCategory,
    assigned_to: fAssigned || null,
    rating:   fRating,
    tags:     fTags,
    phone:    fPhone,
    tollfree: fTollfree,
    fax:      fFax,
    email:    fEmail,
    website:  fWebsite,
  };

  async function submit() {
    if (!fName.trim()) { setFNameError(true); return; }
    setFNameError(false);
    setServerError(null);

    if (editAccount) {
      const res  = await fetch(`/api/accounts/${editAccount.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs: string[] = data?.errors ?? [];
        setServerError({ title: "Couldn't save changes", body: msgs.length ? msgs.join(", ") : "The server returned an error. Try again in a few seconds." });
        return;
      }
      onAccountUpdated?.(data as Account);
    } else {
      const res  = await fetch("/api/accounts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs: string[] = data?.errors ?? [];
        setServerError({ title: "Couldn't create account", body: msgs.length ? msgs.join(", ") : "The server returned an error. Try again in a few seconds." });
        return;
      }
      onAccountCreated(data as Account);
    }

    setFSuccess(true);
    setTimeout(() => { setFSuccess(false); setFormOpen(false); reset(); onEditCancel?.(); }, 1200);
  }

  const billIds = { street1: "b-street1", street2: "b-street2", city: "b-city", state: "b-state", zip: "b-zip", country: "b-country" };
  const shipIds = { street1: "s-street1", street2: "s-street2", city: "s-city", state: "s-state", zip: "s-zip", country: "s-country" };

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {([
          { v: "list", title: "List view", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
          { v: "grid", title: "Grid view", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
        ] as const).map(({ v, title, icon }) => (
          <button key={v} onClick={() => onViewChange(v)} title={title}
            style={{ width: 30, height: 30, borderRadius: 7, display: "grid", placeItems: "center", border: `1px solid ${C.line}`, cursor: "pointer", background: view === v ? C.ink : "white", color: view === v ? "white" : C.muted, transition: "all 120ms" }}>
            {icon}
          </button>
        ))}
      </div>
      <button onClick={() => { setFormOpen(o => !o); if (!formOpen) reset(); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.accent, color: "white", border: `1px solid ${C.accent}`, cursor: "pointer" }}>
        <Plus size={14} /> Create Accounts
      </button>
    </div>
  );

  return (
    <CreateCardShell
      title={editAccount ? "Edit Account" : "Create Account"}
      formOpen={formOpen}
      onFormOpenChange={setFormOpen}
      headerRight={headerRight}
    >
      <div style={{ padding: 24 }}>

              {/* Row 1: Name + Category */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Name <span style={{ color: C.err }}>*</span></label>
                  <input value={fName} onChange={e => { setFName(e.target.value); setFNameError(false); }}
                    onFocus={focusInput} onBlur={blurInput}
                    style={{ ...baseInput, borderColor: fNameError ? C.err : C.line }}
                    placeholder="e.g. Atlas Athletic"
                    onKeyDown={e => { if (e.key === "Enter") submit(); }} />
                  {fNameError && <div style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Account name is required.</div>}
                </div>
                <div>
                  <label style={fieldLabel}>Category <span style={{ color: C.err }}>*</span></label>
                  <SelectWrap>
                    <select value={fCategory} onChange={e => setFCategory(e.target.value as AccountCategoryKey)}
                      onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                      {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                  </SelectWrap>
                </div>
              </div>

              {/* Row 2: Assigned to + Rating */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={fieldLabel}>Assigned to</label>
                  <AssigneeSelect value={fAssigned} onChange={setFAssigned} />
                </div>
                <div>
                  <label style={fieldLabel}>Rating</label>
                  <StarRating rating={fRating} onChange={setFRating} />
                </div>
              </div>

              {/* Row 3: Tags */}
              <div style={{ marginBottom: 24 }}>
                <label style={fieldLabel}>Tags</label>
                <TagsInput tags={fTags} onChange={setFTags} inputId="acct-tag-input" />
              </div>

              {/* Contact information */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>
                  Contact Information
                </div>

                {/* Phone row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { label: "Phone",     value: fPhone,    setter: setFPhone,    placeholder: "(555) 123-4567" },
                    { label: "Toll-free", value: fTollfree, setter: setFTollfree, placeholder: "1-800-…" },
                    { label: "Fax",       value: fFax,      setter: setFFax,      placeholder: "(555) 123-4568" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={fieldLabel}>{f.label}</label>
                      <input value={f.value} onChange={e => f.setter(e.target.value)}
                        onFocus={focusInput} onBlur={blurInput}
                        style={baseInput} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>

                {/* Email + Website */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {[
                    { label: "Email",   value: fEmail,   setter: setFEmail,   placeholder: "hello@example.com", type: "email" },
                    { label: "Website", value: fWebsite, setter: setFWebsite, placeholder: "https://example.com", type: "url" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={fieldLabel}>{f.label}</label>
                      <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)}
                        onFocus={focusInput} onBlur={blurInput}
                        style={baseInput} placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>

                {/* Addresses */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <AddressGroup
                    title="Billing address"
                    ids={billIds}
                    onInput={syncShipping}
                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M7 15h3"/></svg>}
                  />
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, background: "white" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 7h13v10H3zM16 11h4l3 3v3h-7zM6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
                        Shipping address
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: C.muted }}>
                        <input type="checkbox" checked={sameAsBill}
                          onChange={e => { setSameAsBill(e.target.checked); if (e.target.checked) syncShipping(); }}
                          style={{ accentColor: C.accent }} />
                        Same as billing
                      </label>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[shipIds.street1, shipIds.street2].map((id, i) => (
                        <input key={id} id={id} disabled={sameAsBill}
                          style={{ ...baseInput, opacity: sameAsBill ? 0.5 : 1 }}
                          placeholder={i === 0 ? "Street address" : "Apt, suite, etc."}
                          onFocus={focusInput} onBlur={blurInput} />
                      ))}
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                        <input id={shipIds.city}  disabled={sameAsBill} style={{ ...baseInput, opacity: sameAsBill ? 0.5 : 1 }} placeholder="City"  onFocus={focusInput} onBlur={blurInput} />
                        <input id={shipIds.state} disabled={sameAsBill} style={{ ...baseInput, opacity: sameAsBill ? 0.5 : 1 }} placeholder="State" onFocus={focusInput} onBlur={blurInput} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                        <input id={shipIds.zip} disabled={sameAsBill} style={{ ...baseInput, opacity: sameAsBill ? 0.5 : 1 }} placeholder="ZIP" onFocus={focusInput} onBlur={blurInput} />
                        <SelectWrap>
                          <select id={shipIds.country} disabled={sameAsBill} style={{ ...baseSelect, opacity: sameAsBill ? 0.5 : 1 }} onFocus={focusInput} onBlur={blurInput}>
                            <option value="">Select a country</option>
                            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </SelectWrap>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      <CollapsibleSection title="Comment">
        <textarea onFocus={focusInput} onBlur={blurInput} rows={3}
          placeholder="You can add comments later."
          style={{ ...baseInput, height: "auto", padding: "10px 12px", resize: "vertical" }} />
      </CollapsibleSection>

      <CollapsibleSection title="Permissions">
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
          By default all users will have access to the account. You can change permissions later.
        </p>
      </CollapsibleSection>

      <div style={{ padding: "0 24px" }}>
        <FormErrorBanner
          error={serverError}
          onDismiss={() => setServerError(null)}
          onRetry={submit}
        />
      </div>

      <FormFooter
        label={editAccount ? "Save Changes" : "Account"}
        onSubmit={submit}
        onCancel={() => { setFormOpen(false); reset(); onEditCancel?.(); }}
        success={fSuccess}
      />
    </CreateCardShell>
  );
}
