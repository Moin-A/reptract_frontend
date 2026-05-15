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

export const pillSelect: React.CSSProperties = {
  padding: "5px 10px", paddingRight: 28, borderRadius: 20, fontSize: 12, fontWeight: 500,
  border: `1px solid ${C.line}`, background: "white", color: C.ink,
  cursor: "pointer", outline: "none", appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23A7A7AC' stroke-width='2.5' stroke-linecap='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
};
