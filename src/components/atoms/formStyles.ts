import type React from "react";
import { C } from "@/components/organisms/dashboard/tokens";

export const fieldLabel: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.07em", color: C.muted, display: "block", marginBottom: 6,
};

export const baseInput: React.CSSProperties = {
  width: "100%", height: 40, border: `1px solid ${C.line}`, borderRadius: 9,
  padding: "0 12px", fontSize: 14, outline: "none", background: "white",
  color: C.ink, fontFamily: "inherit", transition: "border-color 140ms, box-shadow 140ms",
  boxSizing: "border-box",
};

export const baseSelect: React.CSSProperties = {
  ...baseInput, padding: "0 32px 0 12px", appearance: "none", cursor: "pointer",
};
