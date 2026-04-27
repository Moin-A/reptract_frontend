"use client";

import { type LucideIcon } from "lucide-react";
import { C } from "../tokens";

interface NavTabProps {
  id:       string;
  Icon:     LucideIcon;
  isActive: boolean;
  onClick:  () => void;
}

export function NavTab({ id, Icon, isActive, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 14px", borderRadius: 8,
        fontSize: 13, fontWeight: 500, cursor: "pointer",
        background: isActive ? C.navActiveBg : "transparent",
        color: isActive ? "white" : "#A7A7AC",
        border: "none", whiteSpace: "nowrap", flexShrink: 0,
        transition: "background 140ms, color 140ms",
      }}
    >
      <Icon size={14} />
      {id}
    </button>
  );
}
