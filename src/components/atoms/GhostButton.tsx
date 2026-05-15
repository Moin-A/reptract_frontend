"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string;
  fontSize?: number;
};

export function GhostButton({ color = C.accent, fontSize = 12, style, children, ...rest }: Props) {
  return (
    <button
      style={{
        fontSize, color, fontWeight: 500, cursor: "pointer",
        padding: "4px 8px", borderRadius: 6,
        background: "transparent", border: "none", fontFamily: "inherit",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
