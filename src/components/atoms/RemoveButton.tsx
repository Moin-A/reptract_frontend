import type { CSSProperties } from "react";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  onClick: () => void;
  label?: string;
  style?: CSSProperties;
};

/** Small circular "×" button, e.g. to remove a staged thumbnail. */
export function RemoveButton({ onClick, label = "Remove", style }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: 999,
        border: "none", cursor: "pointer", background: C.ink, color: "#fff", fontSize: 13, lineHeight: 1,
        ...style,
      }}
    >
      ×
    </button>
  );
}
