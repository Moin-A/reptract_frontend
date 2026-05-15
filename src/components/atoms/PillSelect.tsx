"use client";
import { pillSelect } from "./formStyles";

type Option = { label: string; value: string | number };

type Props = {
  value: string | number;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
};

export function PillSelect({ value, onChange, options, placeholder }: Props) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={pillSelect}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
