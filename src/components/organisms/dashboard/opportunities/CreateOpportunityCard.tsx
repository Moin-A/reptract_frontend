"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "@/components/organisms/dashboard/tokens";
import { STAGES, STAGE_MAP, type StageKey } from "./stages";
import { type Opp } from "@/lib/types";
import { CollapsibleSection } from "@/components/molecules/CollapsibleSection";
import { CreateCardShell } from "@/components/molecules/CreateCardShell";
import { FormFooter } from "@/components/molecules/FormFooter";
import { focusInput, blurInput } from "@/components/atoms/formHelpers";
import { SelectWrap } from "@/components/atoms/SelectWrap";
import { fieldLabel, baseInput, baseSelect } from "@/components/atoms/formStyles";
import { TagsInput } from "@/components/atoms/TagsInput";
import { CurrencyInput } from "@/components/atoms/CurrencyInput";
import { ProbabilitySlider } from "@/components/atoms/ProbabilitySlider";
import { AssigneeSelect } from "@/components/atoms/AssigneeSelect";

type Props = {
  view: "list" | "pipeline";
  onViewChange: (v: "list" | "pipeline") => void;
  onOppCreated: (opp: Opp) => void;
};

export function CreateOpportunityCard({ view, onViewChange, onOppCreated }: Props) {
  const [formOpen, setFormOpen] = useState(false);

  const [fName,      setFName]      = useState("");
  const [fStage,     setFStage]     = useState<StageKey>("prospecting");
  const [fClose,     setFClose]     = useState("");
  const [fProb,      setFProb]      = useState(10);
  const [fAmt,       setFAmt]       = useState("");
  const [fDiscount,  setFDiscount]  = useState("");
  const [fAccount,   setFAccount]   = useState("");
  const [fAssigned,  setFAssigned]  = useState("");
  const [fCampaign,  setFCampaign]  = useState("");
  const [fTags,      setFTags]      = useState<string[]>([]);
  const [fNameError, setFNameError] = useState(false);
  const [fSuccess,   setFSuccess]   = useState(false);

  function reset() {
    setFName(""); setFStage("prospecting"); setFClose(""); setFProb(10);
    setFAmt(""); setFDiscount(""); setFAccount(""); setFAssigned("");
    setFCampaign(""); setFTags([]); setFNameError(false); setFSuccess(false);
  }

  function submit() {
    if (!fName.trim()) { setFNameError(true); return; }
    setFNameError(false);
    onOppCreated({
      id: Date.now(), name: fName.trim(), stage: fStage,
      acct: fAccount || "New account", amt: parseInt(fAmt) || 0,
      prob: fProb, user: fAssigned || "Unassigned", daysAgo: 0,
    });
    setFSuccess(true);
    setTimeout(() => { setFSuccess(false); setFormOpen(false); reset(); }, 1200);
  }

  const headerRight = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {(["list", "pipeline"] as const).map(v => (
          <button key={v} onClick={() => onViewChange(v)} title={v === "list" ? "List view" : "Pipeline view"}
            style={{ width: 30, height: 30, borderRadius: 7, display: "grid", placeItems: "center", border: `1px solid ${C.line}`, cursor: "pointer", background: view === v ? C.ink : "white", color: view === v ? "white" : C.muted, transition: "all 120ms" }}>
            {v === "list"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/></svg>
            }
          </button>
        ))}
      </div>
      <button onClick={() => { setFormOpen(o => !o); if (!formOpen) reset(); }}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.accent, color: "white", border: `1px solid ${C.accent}`, cursor: "pointer" }}>
        <Plus size={14} /> Create Opportunity
      </button>
    </div>
  );

  return (
    <CreateCardShell
      title="Create Opportunity"
      formOpen={formOpen}
      onFormOpenChange={setFormOpen}
      headerRight={headerRight}
    >
      <div style={{ padding: 24 }}>
        {/* Row 1: Name + Stage */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>Name <span style={{ color: C.err }}>*</span></label>
            <input value={fName} onChange={e => { setFName(e.target.value); setFNameError(false); }}
              onFocus={focusInput} onBlur={blurInput}
              style={{ ...baseInput, borderColor: fNameError ? C.err : C.line }}
              placeholder="e.g. Atlas Athletic — Multi-location upgrade"
              onKeyDown={e => { if (e.key === "Enter") submit(); }} />
            {fNameError && <div style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Opportunity name is required.</div>}
          </div>
          <div>
            <label style={fieldLabel}>Stage <span style={{ color: C.err }}>*</span></label>
            <SelectWrap>
              <select value={fStage}
                onChange={e => { const k = e.target.value as StageKey; setFStage(k); setFProb(STAGE_MAP[k].prob); }}
                onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </SelectWrap>
          </div>
        </div>

        {/* Row 2: Close date / Probability / Amount / Discount */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>Close date</label>
            <input type="date" value={fClose} onChange={e => setFClose(e.target.value)}
              onFocus={focusInput} onBlur={blurInput} style={baseInput} />
          </div>
          <div>
            <label style={fieldLabel}>Probability</label>
            <ProbabilitySlider value={fProb} onChange={setFProb} />
          </div>
          <div>
            <label style={fieldLabel}>Amount</label>
            <CurrencyInput value={fAmt} onChange={setFAmt} />
          </div>
          <div>
            <label style={fieldLabel}>Discount</label>
            <CurrencyInput value={fDiscount} onChange={setFDiscount} />
          </div>
        </div>

        {/* Row 3: Account + Assigned to */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>Account</label>
            <input value={fAccount} onChange={e => setFAccount(e.target.value)}
              onFocus={focusInput} onBlur={blurInput}
              style={baseInput} placeholder="Type to create new, or pick existing" />
            <div style={{ fontSize: 11.5, color: C.muted2, marginTop: 4 }}>
              Create new or <a href="#" onClick={e => e.preventDefault()} style={{ color: C.accent }}>select existing</a>
            </div>
          </div>
          <div>
            <label style={fieldLabel}>Assigned to <span style={{ color: C.err }}>*</span></label>
            <AssigneeSelect value={fAssigned} onChange={setFAssigned} />
          </div>
        </div>

        {/* Row 4: Campaign + Tags */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={fieldLabel}>Campaign</label>
            <SelectWrap>
              <select value={fCampaign} onChange={e => setFCampaign(e.target.value)}
                onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                <option value="">Select a campaign</option>
                <option>You&apos;re not fully clean…</option>
                <option>Iron Union Q2 Member Drive</option>
                <option>Atlas Athletic Summer Shred</option>
                <option>RepTrack Partner Spotlight</option>
              </select>
            </SelectWrap>
          </div>
          <div>
            <label style={fieldLabel}>Tags</label>
            <TagsInput tags={fTags} onChange={setFTags} inputId="opp-tag-input" />
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
          By default all users will have access to the opportunity. You can change permissions later.
        </p>
      </CollapsibleSection>

      <FormFooter
        label="Opportunity"
        onSubmit={submit}
        onCancel={() => { setFormOpen(false); reset(); }}
        success={fSuccess}
      />
    </CreateCardShell>
  );
}
