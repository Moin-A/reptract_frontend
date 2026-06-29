import type { ReactNode } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  children: ReactNode;
  color?: string;
  solid?: boolean;
  onClick?: () => void;
};

/** Small row-action button: outline by default, solid accent when `solid`. */
export function Action({ children, color, solid, onClick }: Props) {
  return (
    <button className="cc-btn" type="button" onClick={onClick} style={{
      padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      border: solid ? "none" : `1px solid ${color ?? C.line}`,
      background: solid ? C.accent : C.surface,
      color: solid ? "#fff" : (color ?? C.ink2),
    }}>{children}</button>
  );
}
