"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Search…" }: Props) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
      <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,91,31,0.10)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = "#FAFAF7"; e.currentTarget.style.boxShadow = "none"; }}
        style={{ width: "100%", height: 38, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 12px 0 36px", fontSize: 13.5, outline: "none", fontFamily: "inherit", background: "#FAFAF7", transition: "border-color 140ms, box-shadow 140ms" }} />
    </div>
  );
}
