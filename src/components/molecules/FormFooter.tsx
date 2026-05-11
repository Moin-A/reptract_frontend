"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  label:    string;
  onSubmit: () => void;
  onCancel: () => void;
  success:  boolean;
};

export function FormFooter({ label, onSubmit, onCancel, success }: Props) {
  return (
    <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.line}`, background: C.bg, display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onSubmit}
        style={{ display: "inline-flex", alignItems: "center", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: C.accent, color: "white", border: `1px solid ${C.accent}`, cursor: "pointer", fontFamily: "inherit" }}>
        Create {label}
      </button>
      <span style={{ fontSize: 13, color: C.muted }}>or</span>
      <button onClick={onCancel}
        style={{ fontSize: 13, color: C.accent, fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
        Cancel
      </button>
      {success && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ok }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m5 12 4.5 4.5L19 7"/></svg>
          {label} created!
        </span>
      )}
    </div>
  );
}
