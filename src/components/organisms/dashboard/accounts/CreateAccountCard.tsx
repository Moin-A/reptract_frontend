"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { C } from "@/components/organisms/dashboard/tokens";
import { CATEGORIES, type AccountCategoryKey } from "./categories";
import { type Account } from "@/lib/types";
import { BILL_IDS, SHIP_IDS, PHONE_FIELDS, CONTACT_FIELDS } from "@/lib/constants";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { CreateCardShell } from "@/components/molecules/CreateCardShell";
import { FormFooter } from "@/components/molecules/FormFooter";
import { focusInput, blurInput, readAddr } from "@/components/atoms/formHelpers";
import { SelectWrap } from "@/components/atoms/SelectWrap";
import { CountrySelect } from "@/components/atoms/CountrySelect";
import { CheckboxLabel } from "@/components/atoms/CheckboxLabel";
import { PhoneIcon, CreditCardIcon, TruckIcon } from "@/components/atoms/icons";
import { FormInput } from "@/components/atoms/FormInput";
import { FormField } from "@/components/atoms/FormField";
import { FormRow } from "@/components/atoms/FormRow";
import { AccountListHeader } from "./AccountListHeader";
import { AddressGroup } from "./AddressGroup";
import { FormInputGroup } from "@/components/organisms/dashboard/FormInputGroup";
import { baseInput, baseSelect } from "@/components/atoms/formStyles";
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
    [...Object.values(BILL_IDS), ...Object.values(SHIP_IDS)].forEach(id => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
      if (el) el.value = "";
    });
  }

  function syncShipping() {
    if (!sameAsBill) return;
    (Object.keys(BILL_IDS) as (keyof typeof BILL_IDS)[]).map(k => [BILL_IDS[k], SHIP_IDS[k]]).forEach(([b, s]) => {
      const bEl = document.getElementById(b) as HTMLInputElement | HTMLSelectElement | null;
      const sEl = document.getElementById(s) as HTMLInputElement | HTMLSelectElement | null;
      if (bEl && sEl) sEl.value = bEl.value;
    });
  }


  async function submit() {
    if (!fName.trim()) { setFNameError(true); return; }
    setFNameError(false);
    setServerError(null);

    const body = {
      name:        fName.trim(),
      category:    fCategory,
      assigned_to: fAssigned || null,
      rating:      fRating,
      tags:        fTags,
      phone:       fPhone,
      email:       fEmail,
      website:     fWebsite,
      shipping_address_attributes: readAddr(SHIP_IDS, "shipping"),
      billing_address_attributes:  readAddr(BILL_IDS, "billing"),
    };

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



  return (
    <CreateCardShell
      title={editAccount ? "Edit Account" : "Create Account"}
      formOpen={formOpen}
      onFormOpenChange={setFormOpen}
      headerRight={
        <AccountListHeader
          view={view}
          onViewChange={onViewChange}
          onCreateClick={() => { setFormOpen(o => !o); if (!formOpen) reset(); }}
        />
      }
    >
      <div style={{ padding: 24 }}>

              <FormRow columns="2fr 1fr">
                <FormField label="Name" required>
                  <FormInput value={fName} onChange={e => { setFName(e.target.value); setFNameError(false); }}
                    style={{ borderColor: fNameError ? C.err : C.line }}
                    placeholder="e.g. Atlas Athletic"
                    onKeyDown={e => { if (e.key === "Enter") submit(); }} />
                  {fNameError && <div style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Account name is required.</div>}
                </FormField>
                <FormField label="Category" required>
                  <SelectWrap>
                    <select value={fCategory} onChange={e => setFCategory(e.target.value as AccountCategoryKey)}
                      onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                      {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                    </select>
                  </SelectWrap>
                </FormField>
              </FormRow>

              <FormRow columns="1fr 1fr">
                <FormField label="Assigned to">
                  <AssigneeSelect value={fAssigned} onChange={setFAssigned} />
                </FormField>
                <FormField label="Rating">
                  <StarRating rating={fRating} onChange={setFRating} />
                </FormField>
              </FormRow>

              <FormRow columns="1fr" mb={24}>
                <FormField label="Tags">
                  <TagsInput tags={fTags} onChange={setFTags} inputId="acct-tag-input" />
                </FormField>
              </FormRow>

              {/* Contact information */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <PhoneIcon />
                  Contact Information
                </div>

                <FormInputGroup columns="1fr 1fr 1fr"
                  fields={PHONE_FIELDS}
                  values={[fPhone, fTollfree, fFax]}
                  setters={[setFPhone, setFTollfree, setFFax]}
                />

                <FormInputGroup columns="1fr 1fr"
                  fields={CONTACT_FIELDS}
                  values={[fEmail, fWebsite]}
                  setters={[setFEmail, setFWebsite]}
                />

                {/* Addresses */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <AddressGroup
                    title="Billing address"
                    ids={BILL_IDS}
                    onInput={syncShipping}
                    icon={<CreditCardIcon />}
                  />
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, background: "white" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.ink, display: "flex", alignItems: "center", gap: 6 }}>
                        <TruckIcon />
                        Shipping address
                      </div>
                      <CheckboxLabel
                        checked={sameAsBill}
                        onChange={v => { setSameAsBill(v); if (v) syncShipping(); }}
                      >
                        Same as billing
                      </CheckboxLabel>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[SHIP_IDS.street1, SHIP_IDS.street2].map((id, i) => (
                        <FormInput key={id} id={id} disabled={sameAsBill}
                          placeholder={i === 0 ? "Street address" : "Apt, suite, etc."} />
                      ))}
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                        <FormInput id={SHIP_IDS.city}  disabled={sameAsBill} placeholder="City"  />
                        <FormInput id={SHIP_IDS.state} disabled={sameAsBill} placeholder="State" />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                        <FormInput id={SHIP_IDS.zip} disabled={sameAsBill} placeholder="ZIP" />
                        <CountrySelect id={SHIP_IDS.country} disabled={sameAsBill} />
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
