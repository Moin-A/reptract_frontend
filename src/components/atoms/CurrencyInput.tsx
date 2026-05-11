"use client";
import { C } from "@/components/organisms/dashboard/tokens";
import { baseInput } from "./formStyles";
import { focusInput, blurInput } from "./formHelpers";

type Props = {
  value:       string;
  onChange:    (v: string) => void;
  placeholder?: string;
};

export function CurrencyInput({ value, onChange, placeholder = "0" }: Props) {
  return (
    <div style={{ position: "relative" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 14, pointerEvents: "none" }}>$</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={0}
        onFocus={focusInput}
        onBlur={blurInput}
        style={{ ...baseInput, paddingLeft: 28 }}
        placeholder={placeholder}
      />
    </div>
  );
}
