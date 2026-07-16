"use client";
import { useState, useEffect } from "react";
import { Phone, CheckCircle } from "lucide-react";
import { C } from "@/components/organisms/dashboard/tokens";
import { type Lead } from "@/lib/types";
import { LEAD_STATUSES, LEAD_SOURCES, type LeadStatusKey, type LeadSourceKey } from "./statuses";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { CreateCardShell } from "@/components/molecules/CreateCardShell";
import { FormFooter } from "@/components/molecules/FormFooter";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";
import { SelectWrap } from "@/components/atoms/SelectWrap";
import { FormInput } from "@/components/atoms/FormInput";
import { FormField } from "@/components/atoms/FormField";
import { FormRow } from "@/components/atoms/FormRow";
import { AssigneeSelect } from "@/components/atoms/AssigneeSelect";
import { StarRating } from "@/components/atoms/StarRating";
import { TagsInput } from "@/components/atoms/TagsInput";
import { baseInput, baseSelect } from "@/components/atoms/formStyles";
import { FormErrorBanner, type FormError } from "@/components/ui/error_banner";
import { Plus } from "lucide-react";

type Props = {
  onLeadCreated:  (lead: Lead) => void;
  onLeadUpdated?: (lead: Lead) => void;
  editLead?:      Lead | null;
  onEditCancel?:  () => void;
  externalOpenSignal?: number;
};

type PermValue = "private" | "everyone";

const SectionTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{
    fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
    color: C.ink, marginBottom: 12, marginTop: 4,
    display: "flex", alignItems: "center", gap: 8,
  }}>
    <span style={{ color: C.muted2 }}>{icon}</span>
    {children}
  </div>
);

export function CreateLeadCard({ onLeadCreated, onLeadUpdated, editLead, onEditCancel, externalOpenSignal }: Props) {
  const [formOpen,    setFormOpen]    = useState(false);
  // Basic
  const [fFirst,      setFFirst]      = useState("");
  const [fLast,       setFLast]       = useState("");
  const [fEmail,      setFEmail]      = useState("");
  const [fPhone,      setFPhone]      = useState("");
  const [fTags,       setFTags]       = useState<string[]>([]);
  // Status section
  const [fAssigned,   setFAssigned]   = useState("");
  const [fStatus,     setFStatus]     = useState<LeadStatusKey>("new");
  const [fRating,     setFRating]     = useState(0);
  const [fSource,     setFSource]     = useState<LeadSourceKey>("other");
  const [fCampaign,   setFCampaign]   = useState("");
  // Contact info
  const [fTitle,      setFTitle]      = useState("");
  const [fCompany,    setFCompany]    = useState("");
  const [fAltEmail,   setFAltEmail]   = useState("");
  const [fMobile,     setFMobile]     = useState("");
  // Address
  const [fStreet1,    setFStreet1]    = useState("");
  const [fStreet2,    setFStreet2]    = useState("");
  const [fCity,       setFCity]       = useState("");
  const [fAddrState,  setFAddrState]  = useState("");
  const [fZip,        setFZip]        = useState("");
  const [fCountry,    setFCountry]    = useState("");
  // Other contact
  const [fReferredBy, setFReferredBy] = useState("");
  const [fDoNotCall,  setFDoNotCall]  = useState(false);
  // Web presence
  const [fWebsite,    setFWebsite]    = useState("");
  const [fLinkedin,   setFLinkedin]   = useState("");
  const [fFacebook,   setFFacebook]   = useState("");
  // Permissions
  const [fPerm,       setFPerm]       = useState<PermValue>("private");
  // UI
  const [fFirstErr,   setFFirstErr]   = useState(false);
  const [fLastErr,    setFLastErr]    = useState(false);
  const [fSuccess,    setFSuccess]    = useState(false);
  const [serverError, setServerError] = useState<FormError | null>(null);
  // Address is required by the backend (Address validates street1/city/state/
  // zipcode/country). street2 is the only optional part.
  const [addrErrs,    setAddrErrs]    = useState<Record<string, boolean>>({});
  const [fEmailErr,   setFEmailErr]   = useState(false);
  const [fPhoneErr,   setFPhoneErr]   = useState(false);

  const isOpen = formOpen || !!editLead;

  useEffect(() => {
    if (!editLead) return;
    setFFirst(editLead.first_name ?? editLead.name?.split(" ")[0] ?? "");
    setFLast(editLead.last_name  ?? editLead.name?.split(" ").slice(1).join(" ") ?? "");
    setFEmail(editLead.email ?? "");
    setFPhone(editLead.phone ?? "");
    setFTags(editLead.tags ?? []);
    setFAssigned(editLead.assignee_id ? String(editLead.assignee_id) : "");
    setFStatus((editLead.status as LeadStatusKey) ?? "new");
    setFRating(editLead.rating ?? 0);
    setFSource((editLead.source as LeadSourceKey) ?? "other");
    setFCampaign(editLead.campaign ?? "");
    setFTitle(editLead.title ?? "");
    setFCompany(editLead.company ?? "");
    setFAltEmail(editLead.alt_email ?? "");
    setFMobile(editLead.mobile ?? "");
    setFReferredBy(editLead.referred_by ?? "");
    setFDoNotCall(editLead.do_not_call ?? false);
    setFWebsite(editLead.website ?? "");
    setFLinkedin(editLead.linkedin ?? "");
    setFFacebook(editLead.facebook ?? "");
    const addr = editLead.business_address;
    setFStreet1(addr?.street1 ?? "");
    setFStreet2(addr?.street2 ?? "");
    setFCity(addr?.city ?? "");
    setFAddrState(addr?.state ?? "");
    setFZip(addr?.zipcode ?? "");
    setFCountry(addr?.country ?? "");
    setFormOpen(true);
  }, [editLead]);

  function reset() {
    setFFirst(""); setFLast(""); setFEmail(""); setFPhone(""); setFTags([]);
    setFAssigned(""); setFStatus("new"); setFRating(0); setFSource("other"); setFCampaign("");
    setFTitle(""); setFCompany(""); setFAltEmail(""); setFMobile("");
    setFStreet1(""); setFStreet2(""); setFCity(""); setFAddrState(""); setFZip(""); setFCountry("");
    setFReferredBy(""); setFDoNotCall(false);
    setFWebsite(""); setFLinkedin(""); setFFacebook("");
    setFPerm("private");
    setFFirstErr(false); setFLastErr(false); setFSuccess(false); setServerError(null);
    setAddrErrs({}); setFEmailErr(false); setFPhoneErr(false);
  }

  // "New Record" in the page header bumps this counter; open a blank form.
  // Resetting state here is the point of the effect — it mirrors CreateAccountCard.
  useEffect(() => {
    if (!externalOpenSignal) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    reset();
    setFormOpen(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [externalOpenSignal]);

  async function submit() {
    let valid = true;
    if (!fFirst.trim()) { setFFirstErr(true); valid = false; }
    if (!fLast.trim())  { setFLastErr(true);  valid = false; }

    // Mirror the backend's Address presence validation so the user sees the
    // problem here rather than as a server error after submitting.
    const missing: Record<string, boolean> = {
      street1: !fStreet1.trim(),
      city:    !fCity.trim(),
      state:   !fAddrState.trim(),
      zipcode: !fZip.trim(),
      country: !fCountry.trim(),
    };
    setAddrErrs(missing);
    if (Object.values(missing).some(Boolean)) valid = false;

    // Format checks (the backend validates email format too).
    const emailBad = !!fEmail.trim() && !/\S+@\S+\.\S+/.test(fEmail.trim());
    const phoneBad = !!fPhone.trim() && !/^[\d\s()+.-]{7,}$/.test(fPhone.trim());
    setFEmailErr(emailBad);
    setFPhoneErr(phoneBad);
    if (emailBad || phoneBad) valid = false;

    if (!valid) return;
    setFFirstErr(false); setFLastErr(false);
    setServerError(null);

    const body = {
      lead: {
      first_name:   fFirst.trim(),
      last_name:    fLast.trim(),
      status:       fStatus,
      source:       fSource,
      tags:         fTags,
      assignee_id:  fAssigned ? parseInt(fAssigned) : null,
      rating:       fRating,
      campaign:     fCampaign || null,
      referred_by:  fReferredBy || null,
      do_not_call:  fDoNotCall,
      permissions:  fPerm,
      title:        fTitle    || null,
      company:      fCompany  || null,
      email:        fEmail    || null,
      phone:        fPhone    || null,
      alt_email:    fAltEmail || null,
      mobile:       fMobile   || null,
      website:      fWebsite  || null,
      linkedin:     fLinkedin || null,
      facebook:     fFacebook || null,
      business_address_attributes: {
        street1:    fStreet1  || null,
        street2:    fStreet2  || null,
        city:       fCity     || null,
        state:      fAddrState || null,
        zipcode:    fZip      || null,
        country:    fCountry  || null,
      },
    }};

    const url    = editLead ? `/api/leads/${editLead.id}` : "/api/leads";
    const method = editLead ? "PATCH" : "POST";
    const res    = await fetch(url, {
      method, credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const msgs: string[] = data?.errors ?? [];
      setServerError({ title: editLead ? "Couldn't save changes" : "Couldn't create lead", body: msgs.length ? msgs.join(", ") : "The server returned an error." });
      return;
    }
    const saved = (data?.lead ?? data) as Lead;
    if (editLead) onLeadUpdated?.(saved);
    else          onLeadCreated(saved);

    setFSuccess(true);
    setTimeout(() => { setFSuccess(false); setFormOpen(false); reset(); onEditCancel?.(); }, 1200);
  }

  return (
    <CreateCardShell
      title={editLead ? "Edit Lead" : "Create Lead"}
      formOpen={isOpen}
      onFormOpenChange={open => { setFormOpen(open); if (!open) onEditCancel?.(); }}
      headerRight={
        <button
          onClick={() => { setFormOpen(o => !o); if (!formOpen) reset(); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, fontWeight: 600,
            color: formOpen ? C.muted : C.accent,
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <Plus size={15} />
          {formOpen ? "Close" : "New Lead"}
        </button>
      }
    >
      <div style={{ padding: 24 }}>

        {/* Row 1: First / Last name */}
        <FormRow columns="1fr 1fr">
          <FormField label="First name" required>
            <FormInput value={fFirst} onChange={e => { setFFirst(e.target.value); setFFirstErr(false); }}
              style={{ borderColor: fFirstErr ? C.err : undefined }}
              placeholder="Syble"
              onKeyDown={e => { if (e.key === "Enter") submit(); }} />
            {fFirstErr && <div style={{ fontSize: 12, color: C.err, marginTop: 4 }}>First name is required.</div>}
          </FormField>
          <FormField label="Last name" required>
            <FormInput value={fLast} onChange={e => { setFLast(e.target.value); setFLastErr(false); }}
              style={{ borderColor: fLastErr ? C.err : undefined }}
              placeholder="Hoppe"
              onKeyDown={e => { if (e.key === "Enter") submit(); }} />
            {fLastErr && <div style={{ fontSize: 12, color: C.err, marginTop: 4 }}>Last name is required.</div>}
          </FormField>
        </FormRow>

        {/* Row 2: Email / Phone */}
        <FormRow columns="1fr 1fr">
          <FormField label="Email">
            <FormInput value={fEmail} onChange={e => { setFEmail(e.target.value); setFEmailErr(false); }}
              type="email" placeholder="syble@borer-lindgren.com"
              style={fEmailErr ? { borderColor: C.err } : undefined} />
            {fEmailErr && <div style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Enter a valid email address.</div>}
          </FormField>
          <FormField label="Phone">
            <FormInput value={fPhone} onChange={e => { setFPhone(e.target.value); setFPhoneErr(false); }}
              type="tel" placeholder="(555) 123-4567"
              style={fPhoneErr ? { borderColor: C.err } : undefined} />
            {fPhoneErr && <div style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Enter a valid phone number.</div>}
          </FormField>
        </FormRow>

        {/* Row 3: Tags */}
        <FormRow columns="1fr" mb={20}>
          <FormField label="Tags">
            <TagsInput tags={fTags} onChange={setFTags} inputId="lead-tag-input" />
          </FormField>
        </FormRow>

        {/* ── STATUS SECTION ── */}
        <SectionTitle icon={<CheckCircle size={14} />}>Status</SectionTitle>

        <FormRow columns="1fr 1fr 1fr">
          <FormField label="Assigned to">
            <AssigneeSelect value={fAssigned} onChange={setFAssigned} useId />
          </FormField>
          <FormField label="Status">
            <SelectWrap>
              <select value={fStatus} onChange={e => setFStatus(e.target.value as LeadStatusKey)}
                onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                {LEAD_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </SelectWrap>
          </FormField>
          <FormField label="Rating">
            <StarRating rating={fRating} onChange={setFRating} />
          </FormField>
        </FormRow>

        <FormRow columns="1fr 1fr" mb={24}>
          <FormField label="Source">
            <SelectWrap>
              <select value={fSource} onChange={e => setFSource(e.target.value as LeadSourceKey)}
                onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                {LEAD_SOURCES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </SelectWrap>
          </FormField>
          <FormField label="Campaign">
            <FormInput value={fCampaign} onChange={e => setFCampaign(e.target.value)} placeholder="— None —" />
          </FormField>
        </FormRow>

        {/* ── CONTACT INFORMATION ── */}
        <SectionTitle icon={<Phone size={14} />}>Contact Information</SectionTitle>

        <FormRow columns="1fr 1fr">
          <FormField label="Title">
            <FormInput value={fTitle} onChange={e => setFTitle(e.target.value)} placeholder="Project Manager" />
          </FormField>
          <FormField label="Company">
            <FormInput value={fCompany} onChange={e => setFCompany(e.target.value)} placeholder="Borer-Lindgren" />
          </FormField>
        </FormRow>

        <FormRow columns="1fr 1fr">
          <FormField label="Alternative email">
            <FormInput value={fAltEmail} onChange={e => setFAltEmail(e.target.value)} type="email" placeholder="alt@example.com" />
          </FormField>
          <FormField label="Mobile">
            <FormInput value={fMobile} onChange={e => setFMobile(e.target.value)} type="tel" placeholder="(555) 987-6543" />
          </FormField>
        </FormRow>

        {/* Address + Referred by */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
          {/* Address */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Address <span style={{ color: C.err }}>*</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <FormInput value={fStreet1} onChange={e => { setFStreet1(e.target.value); setAddrErrs(p => ({ ...p, street1: false })); }}
                placeholder="Street 1 *" style={addrErrs.street1 ? { borderColor: C.err } : undefined} />
              <FormInput value={fStreet2} onChange={e => setFStreet2(e.target.value)} placeholder="Street 2" />
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8 }}>
                <FormInput value={fCity} onChange={e => { setFCity(e.target.value); setAddrErrs(p => ({ ...p, city: false })); }}
                  placeholder="City *" style={addrErrs.city ? { borderColor: C.err } : undefined} />
                <FormInput value={fAddrState} onChange={e => { setFAddrState(e.target.value); setAddrErrs(p => ({ ...p, state: false })); }}
                  placeholder="State *" style={addrErrs.state ? { borderColor: C.err } : undefined} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                <FormInput value={fZip} onChange={e => { setFZip(e.target.value); setAddrErrs(p => ({ ...p, zipcode: false })); }}
                  placeholder="ZIP *" style={addrErrs.zipcode ? { borderColor: C.err } : undefined} />
                <SelectWrap>
                  <select value={fCountry} onChange={e => { setFCountry(e.target.value); setAddrErrs(p => ({ ...p, country: false })); }}
                    onFocus={focusInput} onBlur={blurInput}
                    style={{ ...baseSelect, ...(addrErrs.country ? { borderColor: C.err } : {}) }}>
                    <option value="">Select a country *</option>
                    {["United States","Canada","United Kingdom","Australia","India","Other"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </SelectWrap>
              </div>
              {Object.values(addrErrs).some(Boolean) && (
                <div style={{ fontSize: 12, color: C.err }}>All address fields except Street 2 are required.</div>
              )}
            </div>
          </div>

          {/* Referred by + Do not call */}
          <div>
            <FormField label="Referred by">
              <FormInput value={fReferredBy} onChange={e => setFReferredBy(e.target.value)} placeholder="Kina Wunsch" />
            </FormField>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: C.ink, marginTop: 14 }}>
              <input
                type="checkbox"
                checked={fDoNotCall}
                onChange={e => setFDoNotCall(e.target.checked)}
                style={{ accentColor: C.accent, width: 15, height: 15 }}
              />
              Do not call
            </label>
          </div>
        </div>

      </div>

      {/* ── COLLAPSIBLE: Comment ── */}
      <CollapsibleSection title="Comment">
        <textarea
          onFocus={focusInput} onBlur={blurInput}
          rows={3}
          placeholder="You can add comments later."
          style={{ ...baseInput, height: "auto", padding: "10px 12px", resize: "vertical" }}
        />
      </CollapsibleSection>

      {/* ── COLLAPSIBLE: Web Presence ── */}
      <CollapsibleSection title="Web Presence">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <FormField label="Website">
            <FormInput value={fWebsite}  onChange={e => setFWebsite(e.target.value)}  type="url"  placeholder="https://…"  />
          </FormField>
          <FormField label="LinkedIn">
            <FormInput value={fLinkedin} onChange={e => setFLinkedin(e.target.value)} type="text" placeholder="in/username" />
          </FormField>
          <FormField label="Facebook">
            <FormInput value={fFacebook} onChange={e => setFFacebook(e.target.value)} type="text" placeholder="@handle"     />
          </FormField>
        </div>
      </CollapsibleSection>

      {/* ── COLLAPSIBLE: Permissions ── */}
      <CollapsibleSection title="Permissions">
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5, marginBottom: 14 }}>
          Decide who else can see and edit this lead.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {([
            { value: "private",  title: "Keep it private",         sub: "Only you (and admins) can see this lead."                   },
            { value: "everyone", title: "Share it with everyone",   sub: "All RepTrack users in your workspace can view this lead."   },
          ] as { value: PermValue; title: string; sub: string }[]).map(opt => {
            const sel = fPerm === opt.value;
            return (
              <label key={opt.value} onClick={() => setFPerm(opt.value)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "10px 12px", borderRadius: 9, cursor: "pointer",
                  border: `1px solid ${sel ? C.accent : C.line}`,
                  background: sel ? "#FFF8F4" : "white",
                  boxShadow: sel ? "0 0 0 3px rgba(255,91,31,0.10)" : "none",
                  transition: "border-color 140ms, background 140ms",
                }}
              >
                <input type="radio" name="lead-perm" value={opt.value} checked={sel} onChange={() => setFPerm(opt.value)} style={{ display: "none" }} />
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

      <div style={{ padding: "0 24px" }}>
        <FormErrorBanner error={serverError} onDismiss={() => setServerError(null)} onRetry={submit} />
      </div>

      <FormFooter
        label="Lead"
        submitLabel={editLead ? "Save Changes" : undefined}
        successLabel={editLead ? "Changes saved!" : undefined}
        onSubmit={submit}
        onCancel={() => { setFormOpen(false); reset(); onEditCancel?.(); }}
        success={fSuccess}
      />
    </CreateCardShell>
  );
}
