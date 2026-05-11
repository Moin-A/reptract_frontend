"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { C } from "@/components/dashboard/tokens";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { STAGES, STAGE_MAP, type StageKey } from "./stages";
import { type Opp } from "@/lib/types";
import { CollapsibleSection } from "@/components/dashboard/molecules/CollapsibleSection";
import { focusInput, blurInput } from "@/components/dashboard/atoms/formHelpers";
import { SelectWrap } from "@/components/dashboard/atoms/SelectWrap";

type Props = {
  view: "list" | "pipeline";
  onViewChange: (v: "list" | "pipeline") => void;
  onOppCreated: (opp: Opp) => void;
};

const fieldLabel: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.07em", color: C.muted, display: "block", marginBottom: 6,
};

const baseInput: React.CSSProperties = {
  width: "100%", height: 40, border: `1px solid ${C.line}`, borderRadius: 9,
  padding: "0 12px", fontSize: 14, outline: "none", background: "white",
  color: C.ink, fontFamily: "inherit", transition: "border-color 140ms, box-shadow 140ms",
  boxSizing: "border-box",
};

const baseSelect: React.CSSProperties = {
  ...baseInput, padding: "0 32px 0 12px", appearance: "none", cursor: "pointer",
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
  const [fTagInput,  setFTagInput]  = useState("");
  const [fNameError, setFNameError] = useState(false);
  const [fSuccess,   setFSuccess]   = useState(false);

  const sliderBg = `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${fProb}%, ${C.line} ${fProb}%, ${C.line} 100%)`;

  function reset() {
    setFName(""); setFStage("prospecting"); setFClose(""); setFProb(10);
    setFAmt(""); setFDiscount(""); setFAccount(""); setFAssigned("");
    setFCampaign(""); setFTags([]); setFTagInput(""); setFNameError(false); setFSuccess(false);
  }

  function handleTagKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = fTagInput.trim().replace(",", "");
      if (val && !fTags.includes(val)) setFTags(prev => [...prev, val]);
      setFTagInput("");
    }
    if (e.key === "Backspace" && !fTagInput && fTags.length) {
      setFTags(prev => prev.slice(0, -1));
    }
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

  return (
    <>
      <style>{`
        .opp-prob-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
        .opp-prob-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid ${C.accent}; cursor: pointer; }
        .opp-prob-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid ${C.accent}; cursor: pointer; }
      `}</style>

      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: 7, background: C.accent, display: "inline-block" }} />
            Create Opportunity
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* View toggle */}
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
        </div>

        {/* Inline form */}
        <Collapsible open={formOpen} onOpenChange={o => { if (!o) setFormOpen(false); }}>
          <CollapsibleContent>
            <div style={{ borderBottom: `1px solid ${C.line}`, background: "#FAFAF7" }}>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 12px", background: "white" }}>
                      <input type="range" min={0} max={100} value={fProb}
                        onChange={e => setFProb(Number(e.target.value))}
                        className="opp-prob-slider" style={{ background: sliderBg }} />
                      <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>{fProb}%</span>
                    </div>
                  </div>
                  <div>
                    <label style={fieldLabel}>Amount</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 14, pointerEvents: "none" }}>$</span>
                      <input type="number" value={fAmt} onChange={e => setFAmt(e.target.value)} min={0}
                        onFocus={focusInput} onBlur={blurInput} style={{ ...baseInput, paddingLeft: 28 }} placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label style={fieldLabel}>Discount</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 14, pointerEvents: "none" }}>$</span>
                      <input type="number" value={fDiscount} onChange={e => setFDiscount(e.target.value)} min={0}
                        onFocus={focusInput} onBlur={blurInput} style={{ ...baseInput, paddingLeft: 28 }} placeholder="0" />
                    </div>
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
                    <SelectWrap>
                      <select value={fAssigned} onChange={e => setFAssigned(e.target.value)}
                        onFocus={focusInput} onBlur={blurInput} style={baseSelect}>
                        <option value="">Unassigned</option>
                        <option>Admin (me)</option>
                        <option>Marco Kent</option>
                        <option>Priya Kumar</option>
                        <option>Sam Rivera</option>
                        <option>Aaron Assembler</option>
                        <option>Cindy Cluster</option>
                      </select>
                    </SelectWrap>
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
                    <div onClick={() => document.getElementById("opp-tag-input")?.focus()}
                      style={{ minHeight: 40, border: `1px solid ${C.line}`, borderRadius: 9, padding: "6px 10px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", background: "white", cursor: "text" }}>
                      {fTags.map((t, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: C.ink, color: "white", borderRadius: 100, padding: "3px 10px 3px 12px", fontSize: 12, fontWeight: 500 }}>
                          {t}
                          <span onClick={() => setFTags(prev => prev.filter((_, j) => j !== i))}
                            style={{ cursor: "pointer", opacity: 0.6, fontSize: 14, lineHeight: 1 }}>&times;</span>
                        </span>
                      ))}
                      <input id="opp-tag-input" value={fTagInput} onChange={e => setFTagInput(e.target.value)}
                        onKeyDown={handleTagKey}
                        style={{ border: 0, outline: 0, fontSize: 13, fontFamily: "inherit", minWidth: 120, background: "transparent", color: C.ink }}
                        placeholder={fTags.length ? "" : "Type and press Enter…"} />
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
                  By default all users will have access to the opportunity. You can change permissions later.
                </p>
              </CollapsibleSection>

              {/* Form footer */}
              <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, background: C.bg, display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={submit}
                  style={{ display: "inline-flex", alignItems: "center", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.accent, color: "white", border: `1px solid ${C.accent}`, cursor: "pointer", fontFamily: "inherit" }}>
                  Create Opportunity
                </button>
                <span style={{ fontSize: 13, color: C.muted }}>or</span>
                <button onClick={() => { setFormOpen(false); reset(); }}
                  style={{ fontSize: 13, color: C.accent, fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
                  Cancel
                </button>
                {fSuccess && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ok }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m5 12 4.5 4.5L19 7"/></svg>
                    Opportunity created!
                  </span>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
