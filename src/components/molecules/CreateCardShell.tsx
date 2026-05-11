"use client";
import type { ReactNode } from "react";
import { C } from "@/components/organisms/dashboard/tokens";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

type Props = {
  title:              string;
  formOpen:           boolean;
  onFormOpenChange:   (open: boolean) => void;
  headerRight:        ReactNode;
  children:           ReactNode;
};

export function CreateCardShell({ title, formOpen, onFormOpenChange, headerRight, children }: Props) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 7, background: C.accent, display: "inline-block" }} />
          {title}
        </div>
        {headerRight}
      </div>

      <Collapsible open={formOpen} onOpenChange={o => { if (!o) onFormOpenChange(false); }}>
        <CollapsibleContent>
          <div style={{ borderBottom: `1px solid ${C.line}`, background: "#FAFAF7" }}>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
