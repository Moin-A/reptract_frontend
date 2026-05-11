"use client";
import { useState } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

export function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${C.line}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", width: "100%", textAlign: "left", fontSize: 14, fontWeight: 600, color: C.accent, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit", transition: "background 120ms" }}
        onMouseEnter={e => { e.currentTarget.style.background = C.bg; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <svg style={{ transition: "transform 200ms", transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
        {title}
      </button>
      {open && <div style={{ padding: "0 24px 18px" }}>{children}</div>}
    </div>
  );
}
