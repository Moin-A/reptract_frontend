"use client";

import { useState } from "react";
import {
  ErrorToast,
  ErrorTopBanner,
  FormErrorBanner,
  ErrorModal,
  type FormError,
} from "@/components/ui/error_banner";

const PRESETS: { label: string; error: FormError; detail?: string }[] = [
  {
    label: "Save failed",
    error: { title: "Couldn't save account", body: "The server didn't respond. Your changes are still here." },
  },
  {
    label: "Connection lost",
    error: { title: "Connection lost.", body: "We can't reach RepTrack right now. Changes won't be saved until you're back online." },
  },
  {
    label: "Payment failed",
    error: { title: "Payment couldn't go through", body: "Your card was declined. Your account is unchanged and no funds have moved." },
    detail: "card_declined · Stripe ref: ch_3PqA9bL2K8jR… · 14:32 UTC",
  },
  {
    label: "Form validation",
    error: { title: "Couldn't save this account", body: "The server returned an error. Your changes are still here — try again in a few seconds." },
  },
];

type Pattern = "toast" | "banner" | "inline" | "modal";

export default function ErrorPatternsPage() {
  const [active, setActive] = useState<Pattern>("toast");
  const [preset, setPreset] = useState(0);
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody]   = useState("");
  const [showing, setShowing]         = useState(false);
  const [retried, setRetried]         = useState(false);

  const currentError: FormError = customTitle || customBody
    ? { title: customTitle || "Error", body: customBody || "" }
    : PRESETS[preset].error;

  const currentDetail = !customTitle && !customBody ? PRESETS[preset].detail : undefined;

  function trigger() { setShowing(true); setRetried(false); }
  function dismiss()  { setShowing(false); }
  function retry()    { setRetried(true); setTimeout(() => { setRetried(false); setShowing(true); }, 900); setShowing(false); }

  const activeError: FormError | null = showing ? currentError : null;

  const PATTERNS: { key: Pattern; num: string; title: string; tag: string; tagColor: string; desc: string }[] = [
    { key: "toast",  num: "01", title: "Toast (top-right)", tag: "Recommended default", tagColor: "#1F9D55",
      desc: "Non-blocking. Auto-dismisses after 5 s. For save / fetch / update errors." },
    { key: "banner", num: "02", title: "Top banner",        tag: "System-wide",         tagColor: "#E0A82E",
      desc: "Sticky bar under the nav. For connection loss, degraded service, expired sessions." },
    { key: "inline", num: "03", title: "Inline banner",     tag: "Contextual",          tagColor: "#1F9D55",
      desc: "Lives inside the card that failed. For form errors or validation tied to a section." },
    { key: "modal",  num: "04", title: "Modal dialog",      tag: "Critical only",       tagColor: "#D84A3F",
      desc: "Blocks the UI. Use only when the user must acknowledge or make a choice." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F3F1EC", fontFamily: "Inter, system-ui, sans-serif", fontSize: 14 }}>

      {/* Top banner lives here (pattern 02) */}
      {active === "banner" && <ErrorTopBanner error={activeError} onDismiss={dismiss} onRetry={retry}/>}

      {/* Toast (pattern 01) */}
      {active === "toast" && <ErrorToast error={activeError} onDismiss={dismiss} onRetry={retry}/>}

      {/* Modal (pattern 04) */}
      {active === "modal" && (
        <ErrorModal
          error={activeError}
          onDismiss={dismiss}
          onRetry={retry}
          retryLabel="Try a different card"
          errorDetail={currentDetail}
        />
      )}

      <div style={{ padding: "28px 32px", maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", margin: 0 }}>
            Error &amp; alert patterns
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B70", marginTop: 4 }}>
            Four patterns covering 99% of API failures. Pick a pattern, customise the message, hit Trigger.
          </p>
        </div>

        {/* Pattern selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          {PATTERNS.map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => { setActive(p.key); setShowing(false); }}
              style={{
                padding: 14, border: `1px solid ${active === p.key ? "#FF5B1F" : "#E7E4DE"}`,
                borderRadius: 12, background: active === p.key ? "#FFF8F4" : "white",
                cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 6,
                transition: "border-color 140ms",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: "#0B0B0C" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#FF5B1F", background: "#FFEDE3",
                  padding: "2px 7px", borderRadius: 100, fontFamily: "monospace" }}>{p.num}</span>
                {p.title}
                <span style={{ fontSize: 10.5, fontWeight: 700, color: p.tagColor,
                  letterSpacing: "0.04em", textTransform: "uppercase" }}>{p.tag}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#6B6B70", lineHeight: 1.45 }}>{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Inline demo sandbox */}
        <div style={{ background: "white", border: "1px solid #E7E4DE", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #E7E4DE",
            display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAF7" }}>
            <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: "#FF5B1F", display: "inline-block" }}/>
              {PATTERNS.find(p => p.key === active)?.title}
            </div>
            <button type="button" onClick={() => setShowing(false)}
              style={{ fontSize: 12, color: "#FF5B1F", fontWeight: 500, background: "none",
                border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              ↺ Reset
            </button>
          </div>

          <div style={{ padding: 24, background: "radial-gradient(circle at 8% 14%,#0000000a,transparent 35%), radial-gradient(circle at 92% 86%,#0000000a,transparent 35%)", minHeight: 220, position: "relative" }}>

            {/* Mock card with inline alert */}
            <div style={{ background: "white", border: "1px solid #E7E4DE", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14,
                display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Create Account</span>
                <button type="button" onClick={trigger} disabled={retried}
                  style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                    background: "#FF5B1F", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit",
                    opacity: retried ? 0.6 : 1 }}>
                  {retried ? "Retrying…" : "Trigger error"}
                </button>
              </div>

              {/* Inline alert — only shown when pattern=inline */}
              {active === "inline" && (
                <FormErrorBanner
                  error={activeError}
                  onDismiss={dismiss}
                  onRetry={retry}
                  errorRef={currentDetail}
                />
              )}

              {/* Skeleton rows */}
              {[85, 65, 85].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14,
                  padding: "10px 0", borderBottom: i < 2 ? "1px dashed #E7E4DE" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#E7E4DE", flexShrink: 0 }}/>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ height: 8, borderRadius: 4, background: "#E7E4DE", width: `${w}%` }}/>
                    <div style={{ height: 8, borderRadius: 4, background: "#E7E4DE", width: "40%" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message customiser */}
        <div style={{ background: "white", border: "1px solid #E7E4DE", borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: 7, background: "#FF5B1F", display: "inline-block" }}/>
            Error message
          </div>

          {/* Presets */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {PRESETS.map((p, i) => (
              <button key={i} type="button"
                onClick={() => { setPreset(i); setCustomTitle(""); setCustomBody(""); setShowing(false); }}
                style={{ padding: "5px 12px", borderRadius: 100, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  border: `1px solid ${preset === i && !customTitle && !customBody ? "#FF5B1F" : "#E7E4DE"}`,
                  background: preset === i && !customTitle && !customBody ? "#FFF8F4" : "white",
                  color: "#0B0B0C", fontFamily: "inherit" }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom inputs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#9A9AA0", display: "block", marginBottom: 5 }}>
                Title
              </label>
              <input
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
                placeholder={currentError.title}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13,
                  border: "1px solid #E7E4DE", fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "#9A9AA0", display: "block", marginBottom: 5 }}>
                Body
              </label>
              <input
                value={customBody}
                onChange={e => setCustomBody(e.target.value)}
                placeholder={currentError.body}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13,
                  border: "1px solid #E7E4DE", fontFamily: "inherit", outline: "none",
                  boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
