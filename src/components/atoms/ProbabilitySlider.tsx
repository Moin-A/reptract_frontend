"use client";
import { C } from "@/components/organisms/dashboard/tokens";

type Props = {
  value:    number;
  onChange: (v: number) => void;
};

export function ProbabilitySlider({ value, onChange }: Props) {
  const trackBg = `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${value}%, ${C.line} ${value}%, ${C.line} 100%)`;

  return (
    <>
      <style>{`
        .prob-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
        .prob-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid ${C.accent}; cursor: pointer; }
        .prob-slider::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%; background: white; border: 2px solid ${C.accent}; cursor: pointer; }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, border: `1px solid ${C.line}`, borderRadius: 9, padding: "0 12px", background: "white" }}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="prob-slider"
          style={{ background: trackBg }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>{value}%</span>
      </div>
    </>
  );
}
